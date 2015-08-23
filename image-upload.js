// Module declaration
(function() {

'use strict';

angular.module('image-upload-example', []);

})();

// Image Upload Directive
(function() {

'use strict';

angular
	.module('image-upload-example')
	.directive('imageUpload', function() {
		return {
			restrict: 'A',
			link: function() {
				console.log('test');
			}
		};
	});

})();
