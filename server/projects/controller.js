/**
 * Created by paul on 4/24/15.
 */

'use strict';
Controllers.Projects = (function () {
	function _transform(doc) {
		return new Models.Project(doc);
	}

	function GetAllByServerId(serverId) {
		return Collections.Projects.find({serverId: serverId}, {transform: _transform});
	}

	function GetByServiceProjectId(serverId, serviceProjectId) {
		return Collections.Projects.findOne({serverId: serverId, serviceProjectId: serviceProjectId}, {transform: _transform});
	}

	/**
	 * @param {Models.Build} build
	 * @returns {*}
	 * @constructor
	 */
	function AddBuild(build) {
		return Collections.Builds.upsert({
			serverId: build.serverId,
			projectId: build.projectId,
			serviceBuildId: build.serviceBuildId
		}, {
			$set: {
				name: build.name,
				href: build.href
			}
		});
	}

	/**
	 *
	 * @param {Models.Project} project
	 * @param {Models.Build} builds[]
	 * @returns {*}
	 * @constructor
	 */
	function AddProject(project, builds) {
		var parentId = null;
		if (project.serviceParentProjectId) {
			var parentProject = Controllers.Projects.getByServiceProjectId(project.serverId, project.serviceParentProjectId);
			if (parentProject) {
				parentId = parentProject._id;
			}
		}

		Collections.Projects.upsert({
			serverId: project.serverId,
			serviceProjectId: project.serviceProjectId
		}, {
			$set: {
				serviceParentProjectId: project.serviceParentProjectId,
				parentId: parentId,
				name: project.name,
				href: project.href
			}
		});

		var existingProj = Controllers.Projects.getByServiceProjectId(project.serverId, project.serviceProjectId);

		builds.forEach(function (build) {
			build.projectId = existingProj._id;
			AddBuild(build);
		});
	}

	function RemoveByServerId(serverId) {
		Collections.Projects.remove({serverId: serverId});
	}

	return {
		getAllByServerId: GetAllByServerId,
		getByServiceProjectId: GetByServiceProjectId,
		onAddProject: AddProject,
		onRemoveByServerId: RemoveByServerId
	};
})();
