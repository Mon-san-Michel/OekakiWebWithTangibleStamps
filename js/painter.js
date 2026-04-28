class Painter {
    constructor(canvas){
        this.canvas = canvas;
    }

    //色の確認
    checkColor(tool){
        //指定されたツールの色を確認する。
        return selected_color;
    }

    //スタンプが押されると、種類に応じて描画
    paintStamp(center_x, center_y, angle, shape){
        if(shape == null) shape = this.selected_shape;
        console.log(shape + "Stamp going to paint at (" + center_x + "," + center_y + ").");
        switch(shape){
            case "circle":this.paintStampCircle(center_x, center_y, angle); break;
            case "triangle": this.paintStampTriangle(center_x, center_y, angle); break;
            case "square": this.paintStampSquare(center_x, center_y, angle); break;
            case "star-shape": this.paintStampStarShape(center_x, center_y, angle); break;
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
    		fill: this.checkColor(),
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
    		fill: this.checkColor(),
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
		    fill: this.checkColor(),
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
    		fill: this.checkColor(),
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