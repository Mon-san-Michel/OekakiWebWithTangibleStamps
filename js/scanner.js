class Scanner{
    constructor(param){
        this.scanner = document.getElementById(param.element);
        //this.scanText = document.createElement("span");
        //this.scanner.append(this.scanText);

        //if(param.text)this.scanText.textContent = param.text;
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
        //this.updated = false;
        this.referenceId = undefined;
        this.startTime = null;

        //eventlistener for PCs.
        
        this.scanner.addEventListener("click", (event) => {
            //this.startAction(event);
            // this.endAction(event);
            this.clickAction(event);
        });
        
        
        //eventlistener for Tabs.
        this.scanner.addEventListener("touchstart", (event) => {
            this.touchAction(event);
        });

        this.scanner.addEventListener("touchmove", (event) => {
            /**/
        });

        this.scanner.addEventListener("touchend", (event) => {
            /**/
        });

        document.getElementById("text_result").textContent = param.element + "is active.";
    }
    // ================================================================================================ Actions

    clickAction(event){
        event.preventDefault();
        this.posX = event.offsetX;
        this.posY = event.offsetY;
        this.degrees = 0;
        this.markerId = 2;
        console.log("clicked at (" + this.posX + "," + this.posY + ").");
    }
    touchAction(event){
        const touches = Array.from(event.touches).filter(touch => touch.target === this.scanner);
        

        if (touches.length == 3) {
            event.preventDefault();
            /*--document.getElementById("text_result").innnerHTML = touches;--*/
            this.readMarker(touches);
        } else if(touches.length == 1){
            event.preventDefault();
            this.posX = touches[0].clientX - this.scanner.getBoundingClientRect().left;
            this.posY = touches[0].clientY - this.scanner.getBoundingClientRect().top;
            this.markerId = 0;
        }
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

    // ============================================================================================ READ MARKER

    readMarker (touches) {
        this.touchPos = [];
        //this.updated = true;
        document.getElementById("text_result2").textContent = "readMarker is active.";
        
        
        // Set position
        let maxX = 0;
        let minX = Number.MAX_SAFE_INTEGER;
        let maxY = 0;
        let minY = Number.MAX_SAFE_INTEGER;
        
        let posData = {};    
        
        // ================================================================================ READ EACH TOUCH
        
        for (let i=0; i < touches.length; i++) {
            const touch = touches[i];
            
            const touchId = touch.identifier;

            // Read touch position
            const x = touch.clientX - this.scanner.getBoundingClientRect().left;
            const y = touch.clientY - this.scanner.getBoundingClientRect().top;

            // Check max and min points for position detection 
            if (x > maxX) maxX = x;
            if (x < minX) minX = x;
            if (y > maxY) maxY = y;
            if (y < minY) minY = y;
                
            this.touchPos.push({x, y});
        }
        
        // Measure distances
        this.minDistance = Number.MAX_SAFE_INTEGER;
        this.maxDistance = 0;
        /*    
        document.getElementById("text_result").textContent = "touched at " + touches.length + " points.";
        document.getElementById("text_result1").textContent = "1(x,y) = (" + this.touchPos[0].x + "," + this.touchPos[0].y + ").";
        document.getElementById("text_result2").textContent = "2(x,y) = (" + this.touchPos[1].x + "," + this.touchPos[1].y + ").";
        document.getElementById("text_result3").textContent = "3(x,y) = (" + this.touchPos[2].x + "," + this.touchPos[2].y + ").";
        */
        for (let i=0; i < touches.length; i++) {
            for (let j = i+1; j < touches.length; j++) {
                const dx = this.touchPos[j].x - this.touchPos[i].x;
                const dy = this.touchPos[j].y - this.touchPos[i].y;
                const result = Math.round(Math.sqrt((dx * dx) + (dy * dy)));

                if (result < this.minDistance) {
                    this.minDistance = result;
                    //document.getElementById("text_result").textContent = "result = " + result + " .";
    
                    posData.x1Min = Math.min(this.touchPos[i].x, this.touchPos[j].x);
                    posData.y1Min = Math.min(this.touchPos[i].y, this.touchPos[j].y);

                    posData.x1 = Math.round(Math.abs(dx/2) + posData.x1Min);
                    posData.y1 = Math.round(Math.abs(dy/2) + posData.y1Min);
    
                    for (let n=0; n < touches.length; n++){
                        if (this.touchPos[n].x != this.touchPos[i].x && this.touchPos[n].x != this.touchPos[j].x) {
                            posData.x2 = Math.round(this.touchPos[n].x);
                            posData.y2 = Math.round(this.touchPos[n].y);
                        }
                    }
                }

                if (result > this.maxDistance) {
                    this.maxDistance = result;
                    //document.getElementById("text_result").textContent = "result = " + result + " .";
                }
            }
        }
            
        //document.getElementById("text_result3").textContent = "touched at" + this.touchPos + ".";
            
        // ================================================================================= Measure distances
        posData.xPosMin = 0;//Math.min(posData.x1, posData.x2);
        posData.yPosMin = 0;//Math.min(posData.y1, posData.y2);
    
        this.posX = Math.round(Math.abs((posData.x1+posData.x2)/2 + posData.xPosMin));
        this.posY = Math.round(Math.abs((posData.y1+posData.y2)/2 + posData.yPosMin));
            
        //document.getElementById("text_result").textContent = "Stamp will be pushed at (" + this.posX + "," + this.posY + ").";
    
        // ================================================================================= Measure degree
        // Set angle
        const rad = Math.atan2(posData.y2-posData.y1, posData.x2-posData.x1);
    
        let deg = (rad * 180) / Math.PI;
        deg += 90;
    
        if (deg < 0) {
            deg += 360;
        }

            this.degrees = Math.round(deg);
            
            // ================================================================================= Set the ID
            this.markerId = 0;
            var minId = 0;
            var maxId = 0;
    
            if (this.referenceId) {
                this.referenceId.forEach((value, i) => {
                    if (this.minDistance > value - this.tolerance && this.minDistance < value + this.tolerance) {
                        minId = i + 1;
                    }
    
                    if (this.maxDistance > value - this.tolerance && this.maxDistance < value + this.tolerance) {
                        maxId = i + 1;
                    }
                });
    
                switch (minId) {
                    //後で適切な4つの選択肢に変えること。
                    case 1 : this.markerId = maxId + 0; break;
                    case 2 : this.markerId = maxId + 5; break;
                    case 3 : this.markerId = maxId + 9; break;
                    case 4 : this.markerId = maxId + 12; break;
                    case 5 : this.markerId = maxId + 14; break;
                    case 6 : this.markerId = maxId + 15; break;
                }
            }
            
            //document.getElementById("text_result3").textContent = "readMarker is actually active?";
            //this.updated = true;

        // ================================================================================= Timer
        // Remove dot after a few miliseconds
        this.time = performance.now() - this.startTime;
        this.time += 0.2;
        this.time = this.time.toFixed(2);

        // ================================================================================= Development Mode
        if (this.devMode) {
            this.scanText.textContent = `Min: ${this.minDistance} | Max: ${this.maxDistance}`;
        }

    }

    
}
class InputScanner extends Scanner{
    constructor(param, painter){
        super(param);
        this.painter = painter;
    }

    touchAction(event){
        let selected_tool = "pen";
        let selected_color = "#FF00FF";

        super.touchAction(event);
        
        //markerIdからツールを指定。
        switch(this.markerId){
            case 0 : selected_tool = "pen"; break;
            case 2 : selected_tool = "circle"; break;
            case 4 : selected_tool = "triangle"; break;
            case 9 : selected_tool = "square"; break;
            case 13 : selected_tool = "starshape"; break;
        }
        //this.posXとthis.posYから色を指定。
        if(this.posY < 240){
            if(this.posX < 240){
                selected_color="#FF0000";
            }else if(this.posX <480){
                selected_color="#0000FF";
            }else{
                selected_color="#00BB00";
            }
        }else{
            if(this.posX < 240){
                selected_color="#000000";
            }else if(this.posX <480){
                selected_color="#FFFFFF";
            }else{
                selected_color="#FFFF00";
            }
        }

        if(this.markerId == 0){
            this.painter._ToolChangeToPen();
        } else {
            this.painter._ToolChangeToStamp();
            this.painter.changeColor(selected_tool, selected_color);
        }
        document.getElementById("text_result").textContent = "Color of " + selected_tool + " is changed to " + selected_color + ".";
    }
    
    clickAction(event){
        let selected_tool = "pen";
        let selected_color = "#FF00FF";

        super.clickAction(event);

        //markerIdからツールを指定。
        switch(this.markerId){
            case 0 : selected_tool = "pen"; break;
            case 2 : selected_tool = "circle"; break;
            case 4 : selected_tool = "triangle"; break;
            case 9 : selected_tool = "square"; break;
            case 13 : selected_tool = "starshape"; break;
        }
        //this.posXとthis.posYから色を指定。
        if(this.posY < 240){
            if(this.posX < 240){
                selected_color="#FF0000";
            }else if(this.posX <480){
                selected_color="#0000FF";
            }else{
                selected_color="#00BB00";
            }
        }else{
            if(this.posX < 240){
                selected_color="#000000";
            }else if(this.posX <480){
                selected_color="#FFFFFF";
            }else{
                selected_color="#FFFF00";
            }
        }

        if(this.markerId == 0){
            this.painter._ToolChangeToPen();
        } else {
            this.painter._ToolChangeToStamp();
            this.painter.changeColor(selected_tool, selected_color);
        }
        document.getElementById("text_result").textContent = "Color of " + selected_tool + " is changed to " + selected_color + ".";
    }
}

class PaintScanner extends Scanner{
    constructor(param, painter){
        super(param);
        this.painter = painter;
    }

    touchAction(event){
        let selected_tool = "pen";

        super.touchAction(event);
        
        //markerIdからツールを指定。
        //this.posXとthis.posYからスタンプを押す座標を指定。
        //this.degreesで角度を指定。
        switch(this.markerId){
            case 0 : selected_tool = "pen"; break;
            case 2 : selected_tool = "circle"; break;
            case 4 : selected_tool = "triangle"; break;
            case 9 : selected_tool = "square"; break;
            case 13 : selected_tool = "starshape"; break;
        }
        if(this.markerId == 0){
            this.painter._ToolChangeToPen();
            document.getElementById("text_result").textContent = selected_tool + "is active.";
        } else {
            this.painter._ToolChangeToStamp();
            this.painter.paintStamp(this.posX, this.posY, this.degrees, selected_tool);
            document.getElementById("text_result").textContent = "Stamp of " + selected_tool + " is painted at (" + this.posX + "," + this.posY + ").";
        }
    }

    clickAction(event){
        let selected_tool = "pen";

        super.clickAction(event);

        switch(this.markerId){
            case 0 : selected_tool = "pen"; break;
            case 2 : selected_tool = "circle"; break;
            case 4 : selected_tool = "triangle"; break;
            case 9 : selected_tool = "square"; break;
            case 13 : selected_tool = "starshape"; break;
        }
        if(this.markerId == 0){
            this.painter._ToolChangeToPen();
            document.getElementById("text_result").textContent = selected_tool + "is active.";
        } else {
            this.painter._ToolChangeToStamp();
            this.painter.paintStamp(this.posX, this.posY, this.degrees, selected_tool);
            document.getElementById("text_result").textContent = "Stamp of " + selected_tool + " is painted at (" + this.posX + "," + this.posY + ").";
        }
    }
}