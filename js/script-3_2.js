//初期化処理
window.onload = () => {
    const canvas = new fabric.Canvas("canvas");
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    let app = new App(canvas);
    app.init();
};

class App{
    constructor(canvas){
        this.canvas = canvas;
        this.painter = new Painter();
        //ツール変更の反映
        document.getElementById("toolSelectPen").addEventListener('change', (event) => {
            //スタンプ描画機能の無効化？
            //this.deactivateScanner(document.getElementById("scanner-panel")); //スキャナの収納
            this.painter._toolChangePen(canvas); //ペン描画機能の有効化
            
        });
        document.getElementById("toolSelectStamp").addEventListener('change', (event) => {
            this.painter._toolChangeStamp(canvas); //ペン描画機能の無効化
            //this.activateScanner(document.getElementById("scanner-panel")); //スキャナの展開
            //this.painter.catchStamp(); //スタンプ描画機能の有効化？
            
        });
        
        //ボタン
        //document.getElementById("clear-canvas").onclick = this.painter._clearCanvas;
        document.getElementById("save-canvas").addEventListener('click', (event) => {this.writeFile();});
        
        //ラジオボタン
    }
    
    init(){
        //const winsize = window.innerWidth;
        //console.log("winsize = " + winsize + ".");
        this.canvas.setWidth(800);
        this.canvas.setHeight(600);
        //canvas.setDimentions({width:window.innnerWidth, height:500});
        //初期状態はペンのモードから
        //this.deactivateScanner(document.getElementById("scanner-panel"));
        this.painter.init(this.canvas);
        
        //this.painter.paintStamp(200, 250, 70, "triangle");
        //this.painter.paintStamp(400, 250, 70, "star-shape");
        
    }
    //画像の出力
    writeFile(){
		try {
			const filename = "canvas_image.png";
			const a = document.createElement("a");
			a.href = this.canvas.toDataURL();
			a.download = filename;
			a.click();
		}
		catch(e){
			console.error(e);
			alert(`エラー: ${ e }`);
		}
	}
	
}

class Painter{
    constructor(){
        this.canvas = null;
        
        this.selected_tool =  this.checkTool();
        this.selected_pen_size = this.checkSize();
        this.selected_color = this.checkColor();
        this.selected_shape = this.checkShape();
        this.stamp_size = "80";
        
        this.scanner = null;
        this.scanResult = {};
        
        // Scanner Initialization
        this.scanner = new Scanner({
            element: "scanner-panel",
            posX: "8px", //body-tag's margin is 8px.
            posY: "188px", //body-tag's margin is 8px + div-tags' height 60 * 3.
            width: "800px",
            height: "600px",
            // bgColor: "#f5720055",
            // bgImage: "url(../images/bgScanner.png)",
            // bgActive: "url(../images/bgActive.png)",
            text: "Drawing Area",
            // showResult: true,
            // showDot: true,
            // dotColor: "#4771ed",
        });
        
        // Scanner ID Setup (works for Redmi Tab only)
        this.scanner.setId({
            minDistance: 80,
            maxDistance: 182,
        });
        
        const textResult = document.getElementById("text-result");
        const scannerPanel = document.getElementById("scanner-panel");
        //const shapePanel = document.getElementById("canvas-container");
        let scanResult = {};
        let shapeObjects = [];
        
        //ツール変更の反映
        //document.getElementById("toolSelectPen").addEventListener('change', (event) => {this._toolChangePen(this.canvas);});
        //document.getElementById("toolSelectStamp").addEventListener('change', (event) => {this._toolChangeStamp(this.canvas);});
        
        //ペンサイズ変更の反映
        document.getElementById("sizeSelectBold").addEventListener('change', event => {
            this.selected_pen_size = this.checkSize();
            document.getElementById("toolSelectPen").checked = true;
            this._toolChangePen(this.canvas);
        });
        document.getElementById("sizeSelectNormal").addEventListener('change', event => {
            this.selected_pen_size = this.checkSize();
            document.getElementById("toolSelectPen").checked = true;
            this._toolChangePen(this.canvas);
        });
        document.getElementById("sizeSelectSharp").addEventListener('change', event => {
            this.selected_pen_size = this.checkSize();
            document.getElementById("toolSelectPen").checked = true;
            this._toolChangePen(this.canvas);
        });
        
        //スタンプの種類変更の反映
        document.getElementById("stampSelectCircle").addEventListener('change', event => {
            this.selected_shape = this.checkShape();
            document.getElementById("toolSelectStamp").checked = true;
            this._toolChangeStamp(this.canvas);
            //this.paintStamp(150, 350, 70);
        });
        document.getElementById("stampSelectTriangle").addEventListener('change', event => {
            this.selected_shape = this.checkShape();
            document.getElementById("toolSelectStamp").checked = true;
            this._toolChangeStamp(this.canvas);
            //this.paintStamp(200, 350, 70);
        });
        document.getElementById("stampSelectSquare").addEventListener('change', event => {
            this.selected_shape = this.checkShape();
            document.getElementById("toolSelectStamp").checked = true;
            this._toolChangeStamp(this.canvas);
            //this.paintStamp(250, 350, 70);
        });
        document.getElementById("stampSelectStarshape").addEventListener('change', event => {
            this.selected_shape = this.checkShape();
            document.getElementById("toolSelectStamp").checked = true;
            this._toolChangeStamp(this.canvas);
            //this.paintStamp(200, 250, 70);
            //this.paintStamp(200, 350, 140);
            //this.paintStamp(300, 250, 210);
            //this.paintStamp(300, 350, 280);
        });
        
        //色変更の反映
        document.getElementById("colorSelectBlack").addEventListener('change', (event) => {
            this.selected_color = this.checkColor();
            if(this.checkTool() == "pen"){
                this._toolChangePen(this.canvas);
            } else if(this.checkTool == "stamp"){
                this._toolChangeStamp(this.canvas);
            } else {
                console.log("Now tool is " + this.checkTool() + ".");
            }
        });
        document.getElementById("colorSelectWhite").addEventListener('change', (event) => {
            this.selected_color = this.checkColor();
            if(this.checkTool() == "pen"){
                this._toolChangePen(this.canvas);
            } else if(this.checkTool == "stamp"){
                this._toolChangeStamp(this.canvas);
            } else {
                console.log("Now tool is " + this.checkTool() + ".");
            }
        });
        document.getElementById("colorSelectRed").addEventListener('change', (event) => {
            this.selected_color = this.checkColor();
            if(this.checkTool() == "pen"){
                this._toolChangePen(this.canvas);
            } else if(this.checkTool == "stamp"){
                this._toolChangeStamp(this.canvas);
            } else {
                console.log("Now tool is " + this.checkTool() + ".");
            }
        });
        document.getElementById("colorSelectBlue").addEventListener('change', (event) => {
            this.selected_color = this.checkColor();
            if(this.checkTool() == "pen"){
                this._toolChangePen(this.canvas);
            } else if(this.checkTool == "stamp"){
                this._toolChangeStamp(this.canvas);
            } else {
                console.log("Now tool is " + this.checkTool() + ".");
            }
        });
        document.getElementById("colorSelectYellow").addEventListener('change', (event) => {
            this.selected_color = this.checkColor();
            if(this.checkTool() == "pen"){
                this._toolChangePen(this.canvas);
            } else if(this.checkTool == "stamp"){
                this._toolChangeStamp(this.canvas);
            } else {
                console.log("Now tool is " + this.checkTool() + ".");
            }
        });
        document.getElementById("colorSelectGreen").addEventListener('change', (event) => {
            this.selected_color = this.checkColor();
            if(this.checkTool() == "pen"){
                this._toolChangePen(this.canvas);
            } else if(this.checkTool == "stamp"){
                this._toolChangeStamp(this.canvas);
            } else {
                console.log("Now tool is " + this.checkTool() + ".");
            }
        });
        //背景色変更の反映
        document.getElementById("backcolorisNone").addEventListener('change', (event) => {
            this._bgcChange(this.canvas, null);
            console.log("Now backgroundcolor is clear.");
        });
        document.getElementById("backcolorisWhite").addEventListener('change', (event) => {
            this._bgcChange(this.canvas, "white");
            console.log("Now backgroundcolor is white.");
        });
        document.getElementById("backcolorisBlack").addEventListener('change', (event) => {
            this._bgcChange(this.canvas, "black");
            console.log("Now backgroundcolor is black.");
        });
    }
    
    init(canvas){
        this.canvas = canvas;
        //this.canvas.backgroundColer = this.checkBackColer();
        this.selected_tool = this.checkTool();
        this.selected_pen_size = this.checkSize();
        this.selected_shape = this.checkShape();
        this.selected_color = this.checkColor();
        
        //this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this._toolChangePen(this.canvas);
        
        //this.scanner.init(canvas);
    }
    /*
    //canvasを白で塗りつぶす。
    _clearCanvas(){}
    */
    /*--変更反映用メソッド--*/
    //ツールの確認
    checkTool(){
        let tools = document.getElementsByName("tool");
        for (let i = 0; i < tools.length; i++){
            if(tools.item(i).checked){
                console.log("Selected Tool is " + tools.item(i).value + ".");
                return tools.item(i).value;
            }
        }
        console.log("Tool is not Selected.");
        return "pen";
    }
    //ペンの太さの確認
    checkSize(){
        let sizes = document.getElementsByName("pen-size");
        for (let i = 0; i < sizes.length; i++){
            if(sizes.item(i).checked){
                console.log("Selected Pen Size is " + sizes.item(i).value + ".");
                return sizes.item(i).value;
            }
        }
        console.log("Pen-size is not Selected.");
        return 10;
    }
    //色の確認
    checkColor(){
        let colors = document.getElementsByName("color");
        for (let i = 0; i < colors.length; i++){
            if(colors.item(i).checked){
                console.log("Selected color is " + colors.item(i).value + ".");
                return colors.item(i).value;
            }
        }
        console.log("color is not Selected.");
        return "black";
    }
    //スタンプの形状の確認
    checkShape(){
        let shapes = document.getElementsByName("stamp-shape");
        for (let i = 0; i < shapes.length; i++){
            if(shapes.item(i).checked){
                console.log("Selected Shape is " + shapes.item(i).value);
                return shapes.item(i).value;
            }
        }
        console.log("Shape is not Selected.");
        return "circle";
    }
    
    
    //ツールとしてペンが選択された
    _toolChangePen(canvas){
        this.deactivateScanner(document.getElementById("scanner-panel"));
        this.selected_tool = "pen";
        canvas.freeDrawingBrush.width = this.selected_pen_size;
        canvas.freeDrawingBrush.color = this.selected_color;
        canvas.isDrawingMode = true;
        console.log("Tool is " + this.selected_tool + " & color:" + this.selected_color + ", size:" + this.selected_pen_size + ".");
    }
    
    //ツールとしてスタンプが選択された
    _toolChangeStamp(canvas){
        this.selected_tool = "stamp";
        canvas.isDrawingMode = false;
        canvas.selection = false;
        this.activateScanner(document.getElementById("scanner-panel"));
        this.catchStamp();
        console.log("Tool is " + this.selected_tool + " & color:" + this.selected_color + ", shape:" + this.selected_shape + ".");
    }
    _bgcChange(canvas, color){
        canvas.backgroundColor = color;
    }
    
    //スキャナーを出す
    activateScanner(element_scanner){
        if(element_scanner.classList.contains("invisible")){
            element_scanner.classList.remove("invisible");
        }
        //this.isActive = true;
        console.log("Scanner is Activated.");
        
    }
    //スキャナーを消す
    deactivateScanner(element_scanner){
        if(!element_scanner.classList.contains("invisible")){
            element_scanner.classList.add("invisible");
        }
        //this.isActive = false;
        console.log("Scanner is Deactivated.");
    }
    
    
    /*-- スタンプ読み込み機能用メソッド Methods for Stamps --*/
    /* スタンプ機能が有効な間、ループしている。 */
    catchStamp(){
        //ツールがスタンプなら呼び出し
        //clickの方は正常に動いている。3点タッチの方は(0,0)に描画されてしまうので近いうちに修正すること
        if(this.selected_tool == "stamp"){
            if(this.scanner.getData(this.scanResult)){
                var s = this.selected_shape;
                var pushX = this.scanResult.posX;
                var pushY = this.scanResult.posY;
                var a = this.scanResult.degrees;
                var id = this.scanResult.id;
                /*
                switch(id){
                    //後で適切な数字に変えること。
                    case 1: s = "circle"; break;
                    case 7: s = "triangle"; break;
                    case 12: s = "square"; break;
                    case 16: s = "star-shape"; break;
                }
                */
                this.paintStamp(pushX, pushY, a, s);
                console.log("Stamp pushed at (" + pushX + "," + pushY + ").");
                document.getElementById("text_result").textContent = "Stamp pushed at (" + pushX + "," + pushY + ").";
            }
            requestAnimationFrame(() => {
                this.catchStamp();
            });
        } else {
            console.log("catchStamp() is break out of loop.");
        }
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
    		fill: this.selected_color,
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
    		fill: this.selected_color,
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
		    fill: this.selected_color,
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
    		fill: this.selected_color,
        });
        console.log("Star Shape Stamp at (" + center_x + "," + center_y + ").");
        this.canvas.add(starshape);
    }
    
}