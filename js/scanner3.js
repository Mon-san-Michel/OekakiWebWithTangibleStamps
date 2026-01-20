///////////////////////////////////////////////////////
///   MultitouchMarker 2.1        (2 Oct 2025)      ///
///                                                 ///
///   >> 2 to 4 conductive tips                     ///
///   >> Rotational Invariance                      ///
///////////////////////////////////////////////////////

class Scanner {
    constructor (param) {
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
            //super.pushedStamp(); //call getData & paintStamp
        });
    }
    /*======================================================================================
    //Action and getData for PC.
    clickAction(event){
        event.preventDefault();
        
        //set Data
        //現状、clickActionで格納するデータが本来の形に即していないため、素っ頓狂な数字が出て素っ頓狂な位置にスタンプが押されているので修正すること(特にposXとposY)。
        //this.touchPos = [];
        //this.distance = 0;
        this.numOfTouch = 2; //2なら、丸型か四角。3なら、三角か星型。
        this.posX = event.clientX - 8;
        this.posY = event.clientY - 188;
        this.degrees = 0;
        this.markerId = 1; //1なら、四角。2なら、丸型。
        console.log("clicked at (" + this.posX + "," + this.posY + ").");
        this.updated = true; //スタンプ描画機能にデータを渡してね、というフラグ。
        //super.paintStamp(300, 400, 0, "star-shape");これじゃダメ。
    }
    getClickData(obj){
        if (this.updated) {
            // Set Data
            obj.distance = this.distance;
            obj.numOfTouch = this.numOfTouch;
            obj.posX = this.posX;
            obj.posY = this.posY;
            obj.degrees = this.degrees;
            obj.id = this.markerId;

            this.updated = false;
            return true;
        }
        else {
            return false;
        }
    }
    ========================================================================================*/

    // =========================================================================================== TOUCH ACTION


    touchAction (event) {
        event.preventDefault();

        const touches = Array.from(event.touches).filter(touch => touch.target === this.scanner);

        if (touches.length == 3) {
            document.getElementById("text_result").innnerHTML = touches;
            if (this.bgActive) {
                this.scanner.style.backgroundImage = this.bgActive;
                
                setTimeout(() => {
                    this.scanner.style.backgroundImage = this.bgImage;
                }, 500);
            }

            this.readMarker(touches);
        }
    }
    
    startAction (event) {
        event.preventDefault();

        const touches = Array.from(event.touches).filter(touch => touch.target === this.scanner);
        //const nTouches = touches.length;

        if(touches.length == 3){
            if(this.bgActive){
                this.style.backgroundImage = this.bgActive;
                
                setTimeout(() => {
                    this.scanner.style.backgroundImage = this.bgImage;
                }, 500);
            }

            this.readMarker(touches);
        }
    }
    

    endAction (event) {
        event.preventDefault();

        // Remove dot
        Object.keys(this.dots).forEach((keyId) => {
            if (this.dots[keyId]) {
                this.scanner.removeChild(this.dots[keyId]);
                delete this.dots[keyId];
            }
        });
    }
    
    
    clickAction(event){
        event.preventDefault();
        
        //set Data
        //現状、clickActionで格納するデータが本来の形に即していないため、素っ頓狂な数字が出て素っ頓狂な位置にスタンプが押されているので修正すること(特にposXとposY)。
        //this.touchPos = [];
        //this.distance = 0;
        //this.numOfTouch = 2; //2なら、丸型か四角。3なら、三角か星型。
        this.posX = event.offsetX;
        this.posY = event.offsetY;
        this.degrees = 0;
        this.markerId = 1; //1なら、四角。2なら、丸型。
        console.log("clicked at (" + this.posX + "," + this.posY + ").");
        this.updated = true; //スタンプ描画機能にデータを渡してね、というフラグ。
        //super.paintStamp(300, 400, 0, "star-shape");これじゃダメ。
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
            
        document.getElementById("text_result").textContent = "touched at " + touches.length + " points.";
        document.getElementById("text_result1").textContent = "1(x,y) = (" + this.touchPos[0].x + "," + this.touchPos[0].y + ").";
        document.getElementById("text_result2").textContent = "2(x,y) = (" + this.touchPos[1].x + "," + this.touchPos[1].y + ").";
        document.getElementById("text_result3").textContent = "3(x,y) = (" + this.touchPos[2].x + "," + this.touchPos[2].y + ").";
    
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
                    //case 5 : this.markerId = maxId + 14; break;
                    //case 6 : this.markerId = maxId + 15; break;
                }
            }
            
            //document.getElementById("text_result3").textContent = "readMarker is actually active?";
            this.updated = true;

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


    // ================================================================================================ GETTERS

    getData (obj) {
        if (this.updated == true) {
            // Set Data
            obj.minDistance = this.minDistance;
            obj.maxDistance = this.maxDistance;
            //obj.numOfTouch = this.numOfTouch;
            obj.posX = this.posX; //left
            obj.posY = this.posY; //top
            obj.degrees = this.degrees; //angle
            obj.id = this.markerId; //markerId
            obj.time = this.time; //time
            document.getElementById("text_result").textContent = "Stamp will be pushed at (" + this.posX + "," + this.posY + ").";
            this.updated = false;
            return true;
        }
        else {
            return false;
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
}