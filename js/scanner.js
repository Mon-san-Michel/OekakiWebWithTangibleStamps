class Scanner{
    constructor(param){
        this.scanner = document.getElementById(param.element);
        this.scanText = document.createElement("span");
        this.scanner.append(this.scanText);

        if(param.text)this.scanText.textContent = param.text;
        if (param.posX) this.scanner.style.left = param.posX;
        if (param.posY) this.scanner.style.top = param.posY;
        if (param.width) this.scanner.style.width = param.width;
        if (param.height) this.scanner.style.height = param.height;
        if (param.rotate) this.scanner.style.rotate = param.rotate;
        if (param.bgColor) this.scanner.style.backgroundColor = param.bgColor;
        
        this.bgImage = param.bgImage || null;
        this.scanner.style.backgroundImage = this.bgImage;
        this.bgActive = param.bgActive || null;
        this.decMode = param.devMode || false;
        //this.showResult = param.showResult || false;
        //this.showDot = param.showDot || false;
        //this.dotColor = param.dotColor || undefined;
        
        this.minDistance = 0;
        this.maxDistance = 0;
        //this.numOfTouch = 0;
        this.posX = 0;
        this.posY = 0;
        this.degrees = 0;
        this.markerId = 0;
        this.time = 0.0;
        //this.touchTimer = null;
        
        this.dots = {};
        this.touchPos = [];
        this.updated = false;
        this.referenceId = undefined;
        this.startTime = null;

        //eventlistener for PCs.
        
        this.scanner.addEventListener("click", (event) => {
            //this.startAction(event);
            // this.endAction(event);
            this.clickAction(event);
        });
        
        
        //evebtlistener for Tabs.
        this.scanner.addEventListener("touchstart", (event) => {
            //this.startAction(event);
            this.touchAction(event);
        });

        this.scanner.addEventListener("touchmove", (event) => {
             //this.touchAction(event);
        });

        this.scanner.addEventListener("touchend", (event) => {
            //this.touchAction(event);
            // this.endAction(event);
        });
    }
    // ================================================================================================ Actions

    this.touchAction(event){
        ;
    }

    // ================================================================================================ SETTERS

    setId (param) {
        if (param.minDistance && param.maxDistance) {
            const minDistance = param.minDistance;
            const maxDistance = param.maxDistance;
            // const gap = (maxDistance - minDistance) / 5.0;

            this.tolerance = (maxDistance - minDistance) / 5.0 / 2;

            this.referenceId = [];
            this.referenceId[0] = minDistance;

            for (let i=1; i < 12; i++) {
                this.referenceId[i] = this.referenceId[i-1] + ((maxDistance - minDistance) / 5.0);
            }
        }
    }

    setMarker (param) {
        if (param.posX) this.scanner.style.left = param.posX;
        if (param.posY) this.scanner.style.top = param.posY;
        if (param.width) this.scanner.style.width = param.width;
        if (param.height) this.scanner.style.height = param.height;
        if (param.rotate) this.scanner.style.rotate = param.rotate;
        if (param.bgColor) this.scanner.style.backgroundColor = param.bgColor;
        if (param.bgImage) this.bgImage = param.bgImage;
        this.scanner.style.backgroundImage = this.bgImage;
        if (param.bgActive) this.bgActive = param.bgActive;
        if (param.text) this.scanText.textContent = param.text;
        if (param.showResult) this.showResult = param.showResult;
        if (param.showDot) this.showDot = param.showDot;
        if (param.dotColor) this.dotColor = param.dotColor;
    }

    
}
class InputScanner entend Scanner{
    constructor(param, color){
        super(param);
    }
}

class PaintScanner extend Scanner{
    constructor(param, canvas){
        super(param);
        this.painter = new Painter(canvas);
    }
}