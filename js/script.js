//初期化処理
window.onload = () => {
    const canvas = new fabric.Canvas("canvas");
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    
    let app = new App(canvas);
    app.init();
    
};

class App{
    constructor(canvas){
        
        //canvas setting
        this.canvas = canvas;
        this.painter = new Painter(canvas)
        this.canvas.setWidth(720);
        this.canvas.setHeight(540);
        
        this.input_scanner = new InputScanner({
            element: "color-change-scanner",
            posX: "0px", //body-tag's margin is 8px.
            posY: "0px", //body-tag's margin is 8px + div-tags' height 60 * 3.
            width: "720px", //比率は2480×3508に近くなるようにしたい
            height: "480px",
            // bgColor: "#f5720055",
            // bgImage: "url(../images/bgScanner.png)",
            // bgActive: "url(../images/bgActive.png)",
            text: "Color Select",
            // showResult: true,
            // showDot: true,
            // dotColor: "#4771ed",
        }, this.painter);
        
        // Scanner ID Setup (works for Redmi Tab only)
        this.input_scanner.setId({
            minDistance: 80,
            maxDistance: 182,
        });

        this.paint_scanner = new PaintScanner(
            {
            element: "paint-canvas-scanner",
            posX: "0px", //body-tag's margin is 8px.
            posY: "0px", //body-tag's margin is 8px + div-tags' height 60 * 3.
            width: "720px",
            height: "540px",
            // bgColor: "#f5720055",
            // bgImage: "url(../images/bgScanner.png)",
            // bgActive: "url(../images/bgActive.png)",
            text: "Drawing Area",
            // showResult: true,
            // showDot: true,
            // dotColor: "#4771ed",
        }, this.painter);
        
        // Scanner ID Setup (works for Redmi Tab only)
        this.paint_scanner.setId({
            minDistance: 80,
            maxDistance: 182,
        });
    }

    init(){
        const winsize = window.innerWidth;
        console.log("winsize = " + winsize + ".");
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