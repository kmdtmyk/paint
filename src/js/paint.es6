// vim: set filetype=javascript :

class Paint{


	constructor(options){

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


		this.canvas.addEventListener("mousedown", (e) => this._mousedown(e));

		document.addEventListener("mousemove", (e) => this._mousemove(e));

		document.addEventListener("mouseup", (e) => this._mouseup(e));

		this._pushStack();
	}

	getCanvas(){
		// console.log("get canvas");
		return this.canvas;
	}

	setColor(color){
		// console.log("setColor" + color);
		this.color = color;
		this.context.fillStyle = color;
	}

	setSize(size){
		// console.log("setSize: " + size)
		this.size = size;
	}

	getSize(){
		return this.size;
	}


	undo(){
		// console.log("undo");
		if(this.stackCursor === 0){
			return;
		}

		this.stackCursor--;
		let data = this.stack[this.stackCursor];
		this._resotoreCanvas(data);
	}

	redo(){
		let data = this.stack[this.stackCursor + 1];
		if(!data){
			return;
		}
		this.stackCursor++;
		this._resotoreCanvas(data);
	}

	clear(){

	}


	setCanvasSize(width, height){
		this.canvas.width = width;
		this.canvas.height = height;
		this._pushStack();
	}

	_point(x, y){
		// console.log(this.size);
		this.context.beginPath();
		this.context.arc(x, y, this.size, 0, 360 * Math.PI / 180);
		this.context.fill();
	}

	_stroke(){

	}

	_pushStack(){
		this.stack.length = this.stackCursor + 1;
		this.stackCursor++;
		let width = this.canvas.width;
		let height = this.canvas.height;
		let imagedata = this.context.getImageData(0, 0, width, height);
		this.stack.push({
			width: width,
			height: height,
			imagedata: imagedata
		});
	}

	_resotoreCanvas(canvasData){
		this.canvas.width = canvasData.width;
		this.canvas.height = canvasData.height;
		this.context.putImageData(canvasData.imagedata, 0, 0);
	}

	_mousedown(e){
		// console.log("mouse down");
		e.preventDefault();
		this.pressed = true;
		this._point(e.layerX, e.layerY);
	}

	_mousemove(e){
		// console.log("mouse move");
		if(!this.pressed){
			return;
		}
		// console.log(e);
		//this._point(e.layerX, e.layerY);
	}

	_mouseup(e){
		// console.log("mouse up");
		if(!this.pressed){
			return;
		}
		this.pressed = false;
		this._stroke();
		this._pushStack();
	}


}


