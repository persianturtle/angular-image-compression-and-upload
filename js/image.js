(function() {

	'use strict';

	angular
	.module('image-upload-example')
	.directive('image', function($timeout, $filter) {
		return {
			restrict: 'EA',
			require: '^ptImageUploader',
			scope: {
				image: '='
			},
			link: function(scope, element, attributes, controller) {
				controller.maxWidth = 400;
				controller.maxHeight = 300;
				element.bind('change', function() {
					var files = element[0].files;
					var file = files[0];
					var reader = new FileReader();

					var img = document.createElement("img");
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext("2d");

					reader.onload = function() {
						img.src = reader.result;
						scope.image.srcWidth = img.width;
						scope.image.srcHeight = img.height;
						scope.image.srcSize = file.size;
						canvas.width = scope.image.srcWidth;
						canvas.height = scope.image.srcHeight;
						ctx.drawImage(img, 0, 0);

						scope.image.ratio = Math.min(controller.maxWidth / scope.image.srcWidth, controller.maxHeight / scope.image.srcHeight);
						resample_hermite(canvas, scope.image.srcWidth, scope.image.srcHeight, Math.round(scope.image.srcWidth * scope.image.ratio), Math.round(scope.image.srcHeight * scope.image.ratio));
						var dataURL = canvas.toDataURL("image/jpeg", 0.92);
						var blob = dataURItoBlob(dataURL);
						scope.image.resultSize = blob.size;
						scope.image.compression = ($filter('number')((scope.image.srcSize - scope.image.resultSize) / scope.image.srcSize * 100, 2));

						if (controller.isSimulation) {
							scope.image.dataURL = dataURL;
							scope.$apply();
						} else {
							var s3 = {};
							s3.accessKeyId = controller.s3.accessKeyId;
							s3.secretAccessKey = controller.s3.secretAccessKey
							s3.bucket = controller.s3.bucket;
							AWS.config.update({ accessKeyId: s3.accessKeyId, secretAccessKey: s3.secretAccessKey });
							AWS.config.region = controller.s3.region;
							var bucket = new AWS.S3({ params: { Bucket: s3.bucket } });

							var filename = Date.now() + '.jpg';
							var params = { Key: filename, ContentType: 'image/jpeg', Body: file, ServerSideEncryption: 'AES256' };

							bucket.putObject(params, function(err, data) {
						  	if(err) {
								alert('Image upload failed!');
								return false;
							  }
							  else {
								// Upload Successfully Finished
								console.log("Success!");
								$timeout(function() {scope.image.dataURL = 'https://s3.amazonaws.com/' + s3.bucket + '/' + filename;}, 750);
							  }
							})
							.on('httpUploadProgress',function(progress) {
							  scope.image.uploadProgress = Math.round(progress.loaded / progress.total * 100);
							  scope.$digest();
							});
						}
					};
					reader.readAsDataURL(file);
				});
			}
		};
	});

})();
