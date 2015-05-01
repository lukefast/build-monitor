/**
 * Created by paul on 4/23/15.
 */

'use strict';
Controllers.Servers = (function () {
	function _validateUser() {
		if (!Meteor.user().isAdmin) {
			throw new Meteor.Error(403, 'You are not authorized for this change.');
		}

		return true;
	}

	function _cleanUnamePWord(uname, pword) {
		var user = (s.isBlank(uname) ? false : uname),
				password = (s.isBlank(pword) ? false : pword);

		return {user: user, password: password};
	}

	function InsertServer(name, url, uname, pword) {
		_validateUser();

		if (!name || !url) {
			throw new Meteor.Error(500, 'Missing required field');
		}

		var up = _cleanUnamePWord(uname, pword);

		return Collections.Servers.insert({
			name: name,
			type: 'teamcity',
			url: url,
			user: up.user,
			password: up.password
		});
	}

	function UpdateServer(id, name, url, uname, pword) {
		_validateUser();

		if (!id || !name || !url) {
			throw new Meteor.Error(500, 'Missing required field');
		}

		var up = _cleanUnamePWord(uname, pword);

		return Collections.Servers.update({_id: id}, {
			$set: {
				name: name,
				type: 'teamcity',
				url: url,
				user: up.user,
				password: up.password
			}
		});
	}

	return {
		onInsertServer: InsertServer,
		onUpdateServer: UpdateServer
	};
})();