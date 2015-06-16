

angular.module("app", [])

.directive("paint", () => {

	return {
		restrict: "E",
		scope: {
			width: "=",
			height: "=",
			size: "=",
			color: "=",
			paint: "="
		},
		link: (scope, element, attrs) => {
			let paint = new Paint({
				width: scope.width,
				height: scope.height,
			});
			let canvas = paint.getCanvas();

			scope.paint = paint;
			element.append(canvas);

			scope.$watch("size", (newValue, oldValue) => {
				paint.setSize(newValue);
			});
			scope.$watch(() => {
				return scope.width + scope.height;
			}, (newValue, oldValue) => {
				paint.setCanvasSize(scope.width, scope.height);
			});

		}
	}
})

.controller("MainCtrl", ($scope) => {

	$scope.paints = [
		{
			width: 400,
			height: 300,
			size: 3,
			color: "#000"
		},{
			width: 600,
			height: 400,
			size: 5,
			color: "#f00"
		}
	];

	$scope.undo = (paint) => {
		// console.log(paint);
		paint.undo();
	};

});