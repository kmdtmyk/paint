// vim: set filetype=javascript :

"use strict";

angular.module("app", []).directive("paint", function () {

	return {
		restrict: "E",
		scope: {
			width: "=",
			height: "=",
			lineWidth: "=",
			fillStyle: "=",
			paint: "="
		},
		link: function link(scope, element, attrs) {

			var paint = new Paint({
				width: scope.width,
				height: scope.height,
				lineWidth: scope.lineWidth,
				fillStyle: scope.fillStyle,
				strokeStyle: scope.fillStyle });
			var canvas = paint.getCanvas();

			scope.paint = paint;
			element.append(canvas);

			scope.$watch("lineWidth", function (newValue, oldValue) {
				paint.setLineWidth(newValue);
			});
			scope.$watch(function () {
				return scope.width + scope.height;
			}, function (newValue, oldValue) {});
		}
	};
}).controller("MainCtrl", function ($scope) {

	$scope.paints = [{
		width: 600,
		height: 400,
		lineWidth: 10,
		fillStyle: "#000"
	}, {
		width: 300,
		height: 200,
		lineWidth: 5,
		fillStyle: "#f00"
	}];
});

//paint.setCanvasSize(scope.width, scope.height);