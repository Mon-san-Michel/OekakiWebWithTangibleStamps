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
        this.input_scanner = new InputScanner({
            element: "input-scanners",
            posX: "8px", //body-tag's margin is 8px.
            posY: "188px", //body-tag's margin is 8px + div-tags' height 60 * 3.
            width: "800px",
            height: "600px",
            // bgColor: "#f5720055",
            // bgImage: "url(../images/bgScanner.png)",
            // bgActive: "url(../images/bgActive.png)",
            text: "Color Select",
            // showResult: true,
            // showDot: true,
            // dotColor: "#4771ed",
        }/*, color*/);
        
        // Scanner ID Setup (works for Redmi Tab only)
        this.input_scanner.setId({
            minDistance: 80,
            maxDistance: 182,
        });
        );
        this.paint_scanner = new PaintScanner(
            {
            element: "input-scanners",
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
        }, this.canvas);
        // Scanner ID Setup (works for Redmi Tab only)
        this.paint_scanner.setId({
            minDistance: 80,
            maxDistance: 182,
        });
    }

    init(){
        //const winsize = window.innerWidth;
        //console.log("winsize = " + winsize + ".");
        this.canvas.setWidth(800);
        this.canvas.setHeight(600);
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
}