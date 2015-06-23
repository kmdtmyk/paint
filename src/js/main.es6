// vim: set filetype=javascript :


angular.module("app", [])

.directive("paint", () => {

	return {
		restrict: "E",
		scope: {
			width: "=",
			height: "=",
			lineWidth: "=",
			fillStyle: "=",
			paint: "="
		},
		link: (scope, element, attrs) => {

			let paint = new Paint({
				width: scope.width,
				height: scope.height,
				lineWidth: scope.lineWidth,
				fillStyle: scope.fillStyle,
				strokeStyle: scope.fillStyle,
			});
			let canvas = paint.getCanvas();

			scope.paint = paint;
			element.append(canvas);

			scope.$watch("lineWidth", (newValue, oldValue) => {
				paint.setLineWidth(newValue);
			});
			scope.$watch(() => {
				return scope.width + scope.height;
			}, (newValue, oldValue) => {
				//paint.setCanvasSize(scope.width, scope.height);
			});

		}
	}
})

.controller("MainCtrl", ($scope) => {

	$scope.paints = [
		{
			width: 600,
			height: 400,
			lineWidth: 10,
			fillStyle: "#000"
		},{
			width: 300,
			height: 200,
			lineWidth: 5,
			fillStyle: "#f00"
		}
	];


});
