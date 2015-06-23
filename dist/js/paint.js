// vim: set filetype=javascript :

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Paint = (function () {
	function Paint(options) {
		var _this = this;

		_classCallCheck(this, Paint);

		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d");

		this.canvas.width = options.width || 400;
		this.canvas.height = options.height || 300;

		this.context.lineWidth = options.lineWidth || 5;
		this.context.lineCap = options.lineCap || "round";
		this.context.lineJoin = options.lineJoin || "round";
		this.context.fillStyle = options.fillStyle;
		this.context.strokeStyle = options.strokeStyle;

		this.pathStack = [];
		this.canvasDataStack = [];
		this.stackCursor = -1;
		this.pressed = false;

		this._pushCanvasDataStack();

		this.canvas.addEventListener("mousedown", function (e) {
			return _this._mousedown(e);
		});
		document.addEventListener("mousemove", function (e) {
			return _this._mousemove(e);
		});
		document.addEventListener("mouseup", function (e) {
			return _this._mouseup(e);
		});
	}

	_createClass(Paint, [{
		key: "getCanvas",
		value: function getCanvas() {
			// console.log("get canvas");
			return this.canvas;
		}
	}, {
		key: "setFillStyle",
		value: function setFillStyle(value) {
			this.context.fillStyle = value;
		}
	}, {
		key: "setLineWidth",
		value: function setLineWidth(value) {
			this.context.lineWidth = value;
		}
	}, {
		key: "undo",
		value: function undo() {
			if (this.stackCursor === 0) {
				return;
			}

			this.stackCursor--;
			var data = this.canvasDataStack[this.stackCursor];
			this._resotoreCanvas(data);
		}
	}, {
		key: "redo",
		value: function redo() {
			var data = this.canvasDataStack[this.stackCursor + 1];
			if (!data) {
				return;
			}
			this.stackCursor++;
			this._resotoreCanvas(data);
		}
	}, {
		key: "clear",
		value: function clear() {}
	}, {
		key: "setCanvasSize",
		value: function setCanvasSize(width, height) {
			this._saveContext();
			this.canvas.width = width;
			this.canvas.height = height;
			this._pushCanvasDataStack();
			this._restoreContext();
		}
	}, {
		key: "_pushCanvasDataStack",
		value: function _pushCanvasDataStack() {
			this.canvasDataStack.length = this.stackCursor + 1;
			this.stackCursor++;
			var width = this.canvas.width;
			var height = this.canvas.height;
			var imagedata = this.context.getImageData(0, 0, width, height);
			this.canvasDataStack.push({
				width: width,
				height: height,
				imagedata: imagedata
			});
		}
	}, {
		key: "_resotoreCanvas",
		value: function _resotoreCanvas(canvasData) {
			this._saveContext();
			this.canvas.width = canvasData.width;
			this.canvas.height = canvasData.height;
			this.context.putImageData(canvasData.imagedata, 0, 0);
			this._restoreContext();
		}
	}, {
		key: "_saveContext",
		value: function _saveContext() {
			var context = this.context;
			this.contextOptions = {
				lineWidth: context.lineWidth,
				lineCap: context.lineCap,
				lineJoin: context.lineJoin,
				fillStyle: context.fillStyle,
				strokeStyle: context.strokeStyle };
		}
	}, {
		key: "_restoreContext",
		value: function _restoreContext() {
			var contextOptions = this.contextOptions;
			this.context.lineWidth = contextOptions.lineWidth;
			this.context.lineCap = contextOptions.lineCap;
			this.context.lineJoin = contextOptions.lineJoin;
			this.context.fillStyle = contextOptions.fillStyle;
			this.context.strokeStyle = contextOptions.fillStyle;
		}
	}, {
		key: "_point",
		value: function _point(x, y) {
			this.context.beginPath();
			this.context.arc(x, y, this.context.lineWidth / 2, 0, 360 * Math.PI / 180);
			this.context.fill();
		}
	}, {
		key: "_stroke",
		value: function _stroke() {

			this.context.beginPath();
			for (var i = 0; i < this.pathStack.length; i++) {
				var path = this.pathStack[i];
				if (i === 0) {
					this.context.moveTo(path.x, path.y);
				} else {
					// this.context.arcTo(this.pathStack[i - i].x, this.pathStack[i - i].y, path.x, path.y, 1);
					this.context.lineTo(path.x, path.y);
				}
				// this.context.lineTo(20, 80);
			}
			this.context.stroke();
		}
	}, {
		key: "_mousedown",
		value: function _mousedown(e) {
			// console.log("mouse down");
			e.preventDefault();
			this.pressed = true;
			this._point(e.layerX, e.layerY);

			var x = e.layerX;
			var y = e.layerY;
			this.pathStack.push({
				x: x,
				y: y
			});
		}
	}, {
		key: "_mousemove",
		value: function _mousemove(e) {
			// console.log("mouse move");
			if (!this.pressed) {
				return;
			}
			// console.log(e);
			//this._point(e.layerX, e.layerY);
			var x = e.layerX;
			var y = e.layerY;
			this.pathStack.push({
				x: x,
				y: y
			});
		}
	}, {
		key: "_mouseup",
		value: function _mouseup(e) {
			// console.log("mouse up");
			if (!this.pressed) {
				return;
			}
			this.pressed = false;
			this._stroke();
			this.pathStack.length = 0;
			this._pushCanvasDataStack();
		}
	}]);

	return Paint;
})();