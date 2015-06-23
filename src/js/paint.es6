// vim: set filetype=javascript :

class Paint{


	constructor(options){

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


		this.canvas.addEventListener("mousedown", (e) => this._mousedown(e));
		document.addEventListener("mousemove", (e) => this._mousemove(e));
		document.addEventListener("mouseup", (e) => this._mouseup(e));

	}

	getCanvas(){
		// console.log("get canvas");
		return this.canvas;
	}

	setFillStyle(value){
		this.context.fillStyle = value;
	}

	setLineWidth(value){
		this.context.lineWidth = value;
	}



	undo(){
		if(this.stackCursor === 0){
			return;
		}

		this.stackCursor--;
		let data = this.canvasDataStack[this.stackCursor];
		this._resotoreCanvas(data);
	}

	redo(){
		let data = this.canvasDataStack[this.stackCursor + 1];
		if(!data){
			return;
		}
		this.stackCursor++;
		this._resotoreCanvas(data);
	}

	clear(){

	}


	setCanvasSize(width, height){
		this._saveContext();
		this.canvas.width = width;
		this.canvas.height = height;
		this._pushCanvasDataStack();
		this._restoreContext();
	}



	_pushCanvasDataStack(){
		this.canvasDataStack.length = this.stackCursor + 1;
		this.stackCursor++;
		let width = this.canvas.width;
		let height = this.canvas.height;
		let imagedata = this.context.getImageData(0, 0, width, height);
		this.canvasDataStack.push({
			width: width,
			height: height,
			imagedata: imagedata
		});
	}

	_resotoreCanvas(canvasData){
		this._saveContext();
		this.canvas.width = canvasData.width;
		this.canvas.height = canvasData.height;
		this.context.putImageData(canvasData.imagedata, 0, 0);
		this._restoreContext();
	}

	_saveContext(){
		let context = this.context;
		this.contextOptions = {
			lineWidth: context.lineWidth,
			lineCap: context.lineCap,
			lineJoin: context.lineJoin,
			fillStyle: context.fillStyle,
			strokeStyle: context.strokeStyle,
		};
	}

	_restoreContext(){
		let contextOptions = this.contextOptions;
		this.context.lineWidth = contextOptions.lineWidth;
		this.context.lineCap = contextOptions.lineCap;
		this.context.lineJoin = contextOptions.lineJoin;
		this.context.fillStyle = contextOptions.fillStyle;
		this.context.strokeStyle = contextOptions.fillStyle;
	}

	_point(x, y){
		this.context.beginPath();
		this.context.arc(x, y, this.context.lineWidth / 2, 0, 360 * Math.PI / 180);
		this.context.fill();
	}

	_stroke(){

		this.context.beginPath();
		for(let i = 0; i < this.pathStack.length; i++){
			let path = this.pathStack[i];
			if(i === 0){
				this.context.moveTo(path.x, path.y);
			}else{
				// this.context.arcTo(this.pathStack[i - i].x, this.pathStack[i - i].y, path.x, path.y, 1);
				this.context.lineTo(path.x, path.y);
			}
			// this.context.lineTo(20, 80);
		}
		this.context.stroke();
	}



	_mousedown(e){
		// console.log("mouse down");
		e.preventDefault();
		this.pressed = true;
		this._point(e.layerX, e.layerY);

		let x = e.layerX;
		let y = e.layerY;
		this.pathStack.push({
			x: x,
			y: y
		});
	}

	_mousemove(e){
		// console.log("mouse move");
		if(!this.pressed){
			return;
		}
		// console.log(e);
		//this._point(e.layerX, e.layerY);
		let x = e.layerX;
		let y = e.layerY;
		this.pathStack.push({
			x: x,
			y: y
		});
	}

	_mouseup(e){
		// console.log("mouse up");
		if(!this.pressed){
			return;
		}
		this.pressed = false;
		this._stroke();
		this.pathStack.length = 0;
		this._pushCanvasDataStack();
	}


}


