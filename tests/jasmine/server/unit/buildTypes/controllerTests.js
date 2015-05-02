/**
 * Created by paul on 5/1/15.
 */

'use strict';
describe('Controllers.BuildTypes', function () {
	describe('UpdateBuildStatus()', function () {
		beforeEach(function () {
			spyOn(Collections.BuildTypes, 'update');
		});
		it('should update the build in the database with the current build information', function () {
			Controllers.BuildTypes.onUpdateBuildStatus('btId69', true, true, true, 20, 'Still running bro');

			expect(Collections.BuildTypes.update).toHaveBeenCalledWith(
					{_id: 'btId69'},
					{$set: {currentBuild: {pctComplete: 20, statusText: 'Still running bro'}}},
					{multi: false}
			);
		});

		it('should change isLastBuildSuccess to false if it is currently true and this build is failing', function () {
			Controllers.BuildTypes.onUpdateBuildStatus('btId70', true, false, true, 20, 'Still running bro');

			expect(Collections.BuildTypes.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{$set: {isLastBuildSuccess: false, currentBuild: {pctComplete: 20, statusText: 'Still running bro'}}},
					{multi: false}
			);
		});

		it('should not change isLastBuildSuccess to true if is currently false and the new build is a success and it is still running', function() {
			Controllers.BuildTypes.onUpdateBuildStatus('btId70', false, true, true, 50, 'Cool Step 1/3');

			expect(Collections.BuildTypes.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{$set: {currentBuild: {pctComplete: 50, statusText: 'Cool Step 1/3'}}},
					{multi: false}
			);
		});

		it('should change isLastBuildSuccess to true if it was false and the current build succeeded and it is complete', function () {
			Controllers.BuildTypes.onUpdateBuildStatus('btId70', false, true, false, 100, 'Done');

			expect(Collections.BuildTypes.update).toHaveBeenCalledWith(
					{_id: 'btId70'},
					{$set: {isLastBuildSuccess: true, isBuilding: false, currentBuild: {pctComplete: 100, statusText: 'Done'}}},
					{multi: false}
			);
		});
	});
});
