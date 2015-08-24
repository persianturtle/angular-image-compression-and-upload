(function() {

	'use strict';

	angular
	.module('image-upload-example')
	.directive('ptImageUploader', function() {
		return {
			restrict: 'EA',
			replace: true,
			bindToController: true,
			templateUrl: 'js/pt-image-uploader.html',
			controller: 'ptImageUploaderController',
			controllerAs: 'vm'
		};
	});

})();

(function() {

	'use strict';

	angular
	.module('image-upload-example')
	.controller('ptImageUploaderController', function($location, $anchorScroll) {
		var vm = this;
		vm.s3 = {};
		vm.isSimulation = true;
		vm.addImage = addImage;
		vm.removeImage = removeImage;

		vm.images = [{}];

		function addImage() {
			var image = {};
			vm.images.push(image);

			var last = vm.images.length - 1;
			vm.images[last].tab = true;

			scroll();
		}

		function removeImage(image) {
			vm.images.splice(vm.images.indexOf(image), 1);

			scroll();
		}

		function scroll() {
			$location.hash('image');
			$anchorScroll();
		}
	});

})();
