"use strict";

angular.module("app", []).directive("paint", function () {

	return {
		restrict: "E",
		scope: {
			width: "=",
			height: "=",
			size: "=",
			color: "=",
			paint: "="
		},
		link: function link(scope, element, attrs) {
			var paint = new Paint({
				width: scope.width,
				height: scope.height });
			var canvas = paint.getCanvas();

			scope.paint = paint;
			element.append(canvas);

			scope.$watch("size", function (newValue, oldValue) {
				paint.setSize(newValue);
			});
			scope.$watch(function () {
				return scope.width + scope.height;
			}, function (newValue, oldValue) {
				paint.setCanvasSize(scope.width, scope.height);
			});
		}
	};
}).controller("MainCtrl", function ($scope) {

	$scope.paints = [{
		width: 400,
		height: 300,
		size: 3,
		color: "#000"
	}, {
		width: 600,
		height: 400,
		size: 5,
		color: "#f00"
	}];

	$scope.undo = function (paint) {
		// console.log(paint);
		paint.undo();
	};
});