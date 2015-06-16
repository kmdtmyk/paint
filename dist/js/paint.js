// vim: set filetype=javascript :

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Paint = (function () {
	function Paint(options) {
		var _this = this;

		_classCallCheck(this, Paint);

		this.canvas = document.createElement("canvas");
		this.canvas.width = options.width || 400;
		this.canvas.height = options.height || 300;

		this.context = this.canvas.getContext("2d");
		this.color = "#000";
		this.size = 3;

		this.paths = [];
		this.stack = [];
		this.stackCursor = -1;
		this.pressed = false;

		this.canvas.addEventListener("mousedown", function (e) {
			return _this._mousedown(e);
		});

		document.addEventListener("mousemove", function (e) {
			return _this._mousemove(e);
		});

		document.addEventListener("mouseup", function (e) {
			return _this._mouseup(e);
		});

		this._pushStack();
	}

	_createClass(Paint, [{
		key: "getCanvas",
		value: function getCanvas() {
			// console.log("get canvas");
			return this.canvas;
		}
	}, {
		key: "setColor",
		value: function setColor(color) {
			// console.log("setColor" + color);
			this.color = color;
			this.context.fillStyle = color;
		}
	}, {
		key: "setSize",
		value: function setSize(size) {
			// console.log("setSize: " + size)
			this.size = size;
		}
	}, {
		key: "getSize",
		value: function getSize() {
			return this.size;
		}
	}, {
		key: "undo",
		value: function undo() {
			// console.log("undo");
			if (this.stackCursor === 0) {
				return;
			}

			this.stackCursor--;
			var data = this.stack[this.stackCursor];
			this._resotoreCanvas(data);
		}
	}, {
		key: "redo",
		value: function redo() {
			var data = this.stack[this.stackCursor + 1];
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
			this.canvas.width = width;
			this.canvas.height = height;
			this._pushStack();
		}
	}, {
		key: "_point",
		value: function _point(x, y) {
			// console.log(this.size);
			this.context.beginPath();
			this.context.arc(x, y, this.size, 0, 360 * Math.PI / 180);
			this.context.fill();
		}
	}, {
		key: "_stroke",
		value: function _stroke() {}
	}, {
		key: "_pushStack",
		value: function _pushStack() {
			this.stack.length = this.stackCursor + 1;
			this.stackCursor++;
			var width = this.canvas.width;
			var height = this.canvas.height;
			var imagedata = this.context.getImageData(0, 0, width, height);
			this.stack.push({
				width: width,
				height: height,
				imagedata: imagedata
			});
		}
	}, {
		key: "_resotoreCanvas",
		value: function _resotoreCanvas(canvasData) {
			this.canvas.width = canvasData.width;
			this.canvas.height = canvasData.height;
			this.context.putImageData(canvasData.imagedata, 0, 0);
		}
	}, {
		key: "_mousedown",
		value: function _mousedown(e) {
			// console.log("mouse down");
			e.preventDefault();
			this.pressed = true;
			this._point(e.layerX, e.layerY);
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
			this._pushStack();
		}
	}]);

	return Paint;
})();