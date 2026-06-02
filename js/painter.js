class Painter {
    constructor(canvas){
        this.canvas = canvas;
        this.pen_color = "#222222";
        this.circle_color = "#222222";
        this.triangle_color = "#222222";
        this.square_color = "#222222";
        this.starshape_color = "#222222";
    }

    //色の確認
    checkColor(tool){
        //指定されたツールの色を確認する。
        let selected_color = "#222222";
        switch(tool){
            case "pen": selected_color = this.pen_color; break;
            case "circle": selected_color = this.circle_color; break;
            case "triangle": selected_color = this.triangle_color; break;
            case "square": selected_color = this.square_color; break;
            case "starshape": selected_color = this.starshape_color; break;
        }
        return selected_color;
    }
    changeColor(tool, color){
        switch(tool){
            case "pen": this.pen_color = color; document.getElementById("pen-icon").style.color = color; break;
            case "circle": this.circle_color = color; document.getElementById("circle-icon").style.color = color; break;
            case "triangle": this.triangle_color = color; document.getElementById("triangle-icon").style.color = color; break;
            case "square": this.square_color = color; document.getElementById("square-icon").style.color = color; break;
            case "starshape": this.starshape_color = color; document.getElementById("starshape-icon").style.color = color; break;
        }
    }

    _ToolChangeToPen(){
        document.getElementById("pen-icon").style.color = this.checkColor("pen");

        document.getElementById("circle-icon").style.color = "#888888"; //カラーブレンド用の関数にして、元の色がわかるようにするべきかも
        document.getElementById("triangle-icon").style.color = "#888888";
        document.getElementById("square-icon").style.color = "#888888";
        document.getElementById("starshape-icon").style.color = "#888888";

        this._deactivateScanner("paint-canvas-scanner");
        canvas.isDrawingMode = true;

    }
    _ToolChangeToStamp(){
        document.getElementById("pen-icon").style.color = "#888888";

        document.getElementById("circle-icon").style.color = this.checkColor("circle");
        document.getElementById("triangle-icon").style.color = this.checkColor("triangle");
        document.getElementById("square-icon").style.color = this.checkColor("square");
        document.getElementById("starshape-icon").style.color = this.checkColor("starshape");

        this._activateScanner("paint-canvas-scanner");
        canvas.isDrawingMode = false;
    }

    //スキャナーを出す
    _activateScanner(scanner_name){
        let element_scanner = document.getElementById(scanner_name);
        if(document.getElementById("element_scanner").classList.contains("invisible")){
            element_scanner.classList.remove("invisible");
        }
        //this.isActive = true;
        console.log("Scanner is Activated.");
        
    }
    //スキャナーを消す
    _deactivateScanner(scanner_name){
        let element_scanner = document.getElementById(scanner_name);
        if(!element_scanner.classList.contains("invisible")){
            element_scanner.classList.add("invisible");
        }
        //this.isActive = false;
        console.log("Scanner is Deactivated.");
    }

    //スタンプが押されると、種類に応じて描画
    paintStamp(center_x, center_y, angle, shape){
        //if(shape == null) shape = this.selected_shape;
        console.log(shape + "Stamp going to paint at (" + center_x + "," + center_y + ").");
        switch(shape){
            case "circle": this.paintStampCircle(center_x, center_y, angle); break;
            case "triangle": this.paintStampTriangle(center_x, center_y, angle); break;
            case "square": this.paintStampSquare(center_x, center_y, angle); break;
            case "starshape": this.paintStampStarShape(center_x, center_y, angle); break;
            default : console.log("Any Stamp Shape is not Selected."); break;
        }
    }

    //丸型
    paintStampCircle(center_x, center_y, angle){
        //var r_size = this.stamp_size / 2;
    	var circle = new fabric.Circle({
    		radius: this.stamp_size / 2,
    		originX: 'center',
    		originY: 'center',
    		left: center_x,
    		top: center_y,
    		fill: this.checkColor("circle"),
            opacity: 1.0,
    	});
        
    	console.log(" Circle Stamp at (" + center_x + "," + center_y + ").");
    	this.canvas.add(circle);
    }

    //三角
    paintStampTriangle(center_x, center_y, angle){
    	var triangle = new fabric.Triangle({
    		originX: 'center',
    		originY: 'center',
    		left: center_x,
    		top: center_y,
    		width: this.stamp_size,
    		height: (this.stamp_size * Math.sqrt(3)) / 2,
    		angle: angle,
    		fill: this.checkColor("triangle"),
            opacity: 1.0,
    	});
    	console.log("Triangle Stamp at (" + center_x + "," + center_y + ").");
    	this.canvas.add(triangle);
    }
    
    //四角
    paintStampSquare(center_x, center_y, angle){
    	var square = new fabric.Rect({
	    	originX: 'center',
	    	originY: 'center',
	    	left: center_x,
	    	top: center_y,
	    	width: this.stamp_size / 1,
	    	height: this.stamp_size / 1,
		    angle: angle,
		    fill: this.checkColor("square"),
            opacity: 1.0,
	    });
	    console.log("Square Stamp at (" + center_x + "," + center_y + ").");
	    this.canvas.add(square);
    }

    //星型
    paintStampStarShape(center_x, center_y, angle){
        var starshape = new fabric.Polygon([
            {x: 20.0, y: 2.0,}, //1-12時の位置の頂点
            {x: 9.4199, y: 34.5623,}, //3-7時から8時の位置の頂点
            {x: 37.1190, y: 14.4377,}, //5-2時から3時の位置の頂点
            {x: 2.8810, y: 14.4377,}, //2-9時から10時の位置の頂点
            {x: 30.5801, y: 34.5623,}, //4-4時から5時の位置の頂点
            {x: 20.0, y: 2.0,}, //6=1
        ], {
            originX: 'center',
            originY: 'center',
            left: center_x,
            top: center_y,
            scaleX: this.stamp_size / 25,
            scaleY: this.stamp_size / 25,            
            angle: angle,
    		fill: this.checkColor("starshape"),
            opacity: 1.0,
        });
        console.log("Star Shape Stamp at (" + center_x + "," + center_y + ").");
        this.canvas.add(starshape);
    }

    //スタンプの削除
    
    deleteObject(canvas) {
        let target = canvas.getActiveObject();
        if(target != null){
            canvas.remove(target);
            console.log("Target is deleted.");
        } else {
            console.log("Any object is not selected.");
        }
        canvas.requestRenderAll();
    }
}