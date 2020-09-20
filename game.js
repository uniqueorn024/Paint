// Creating variables
endlessCanvas=true;
var menuX = 10, menuY=45, iconSize = 40,
lineMode = false,strokeMode = false,pencilMode=false,
pencilX=[],pencilY=[],pencilSize=[],drawMode=false,
eraserMode=false, 
eraserX=[], eraserY=[],eraserSize=[],clearMode=false,
rectangleMode = false, strokeRectangle = false;
var currGlobalColor = "yellow", currGlobalSize = 7,currMode;
class Line{
    constructor(sx, sy, fx, fy, size, color){
        this.sx = sx;
        this.sy = sy;
        this.fx = fx;
        this.fy = fy;
        this.size=size;
        this.color = color;
    }
    draw(){
        context.beginPath();
        context.moveTo(this.sx,this.sy);
        context.lineTo(this.fx,this.fy);
        context.strokeStyle = this.color;
        context.lineWidth=this.size;
        context.stroke();
        context.closePath();
    }
}

class Pencil{
    constructor(x, y, size, color){
        this.x = x;
        this.y = y;
        this.size= size;
        this.color = color;
    }
    draw(){
        if(this.x.length != 0){
            let tmpX = this.x[0], tmpY = this.y[0];
            for(let i = 1; i < this.x.length; i ++){
                context.beginPath();
                context.moveTo(tmpX, tmpY);
                context.lineTo(this.x[i], this.y[i]);
                context.lineWidth = this.size[i];
                context.strokeStyle = this.color;
                context.stroke();
                context.closePath();
                context.beginPath();
            	context.arc(tmpX, tmpY, this.size[i]/2, 0*Math.PI,2*Math.PI);
            	context.fillStyle = this.color;
            	context.fill();
            	context.closePath();
                if(i+2 < this.x.length){
                    tmpX = this.x[i];
                    tmpY = this.y[i];
                }
            }
        }
    }
}

class Eraser{
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
    }
    draw(){
        context.fillStyle = "white";
        if(this.x.length != 0){
            let tmpX = this.x[0], tmpY = this.y[0];
            for(let i = 1; i < this.x.length; i ++){           
                context.beginPath();
                context.moveTo(tmpX, tmpY);
                context.lineTo(this.x[i], this.y[i]);
                context.lineWidth = this.size[i];
                context.strokeStyle = "white";
                context.stroke();
                context.closePath();
                context.beginPath();
            	context.arc(tmpX, tmpY, this.size[i]/2, 0*Math.PI,2*Math.PI);
            	context.fillStyle = this.color;
            	context.fill();
            	context.closePath();
                if(i+2 < this.x.length){
                    tmpX = this.x[i];
                    tmpY = this.y[i];
                }
            }
        }
    }
}

class Rectangle{
    constructor(ux,uy,dx,dy,size,color){
        this.ux = ux;
        this.uy = uy;
        this.dx = dx;
        this.dy = dy;
        this.size=size;
        this.color=color;
    }
    draw(){
        context.strokeStyle=this.color;
        context.lineWidth=this.size;
        context.strokeRect(this.ux,this.uy,this.dx,this.dy);
        
    }
}

var narisuvano=[];
var l = new Line;
var r = new Rectangle;

//color spectrum setup
var a=255, b=0, c=0;
var newColor = [], currColor = "white";

for(let j = -50; j < 50; j ++){
    newColor[j] = [];
    for(let i = 0; i < 1400; i ++){

        if(b<256 && a>254){
            b++;
        }else{
            if(a>0 && b>255){
                a--;
            }else{
                if(b>255 && c < 256){
                    c++;            
                }else{
                    if(c > 255 && b>0){
                        b--;
                    }else{
                        if(c>255 && a<256){
                            a++;
                        }else{
                            if(a>255 && c>0){
                                c--;
                            }
                        }
                    }
                }
            }
            
        }
        let aa = a-(4*j), bb=b-(4*j), cc=c-(4*j); 
        if(aa<0){aa=0;}
        if(bb<0){bb=0;}
        if(cc<0){cc=0;}
       newColor[j][i] = "rgb("+aa+","+bb+","+cc+")"; 
    }
    a=255;
    b=0;
    c=0;
}

function update(){
    if(drawMode && mouseX-currGlobalSize/2 > menuX+80 && mouseY + currGlobalSize/2 < 550){
            pencilX.push(mouseX);
            pencilY.push(mouseY);
            pencilSize.push(currGlobalSize);
    }
    if(clearMode && mouseX-currGlobalSize/2 > menuX+80 && mouseY + currGlobalSize/2 < 550){
            eraserX.push(mouseX);
            eraserY.push(mouseY);
            eraserSize.push(currGlobalSize);
    }
}
function draw() {

    // menu
    drawImage(powerupBlue, menuX, menuY, 
              iconSize, iconSize);
    drawImage(powerupYellow, menuX, menuY+50, 
              iconSize, iconSize);
    drawImage(powerupRed, menuX, menuY+100, 
              iconSize, iconSize);
    drawImage(powerupGreen, menuX, menuY+150, 
              iconSize, iconSize); 
    drawImage(powerupYellow, menuX,menuY+200, 
              iconSize, iconSize);
    context.fillStyle = currGlobalColor;
    context.fillRect(menuX,menuY+250,40,40);
    
    let ruler = tryToLoad("ruler", "black");
    let eraser = tryToLoad("eraser", "black");
    let pencil = tryToLoad("pencil", "black");
    let rectangle = tryToLoad("frame", "blue");
    let spectrum = tryToLoad("spectrum","yellow");
    let bin = tryToLoad("bin","blue");
    drawImage(ruler, menuX+10, menuY+10, 
              iconSize-20, iconSize-20);
    drawImage(eraser, menuX+10, menuY+50+10, 
              iconSize-20, iconSize-20);
    drawImage(pencil, menuX+10, menuY+100+10, 
              iconSize-20, iconSize-20);
    drawImage(rectangle, menuX+3, menuY+150+3, 
              iconSize-7, iconSize-7);
    drawImage(bin, menuX + 10, menuY + 200 + 10, 
              iconSize-20, iconSize-20);

    drawImage(spectrum, 0,550,1400,100);


    //check
    let check = tryToLoad("check","green");
    if(currMode=="lineMode"){
        drawImage(check, menuX+50, menuY+10, 20, 20);
    }
    if(currMode=="eraserMode"){
        drawImage(check, menuX+50, menuY+60, 20, 20);
    }
    if(currMode=="pencilMode"){
        drawImage(check, menuX+50, menuY+110, 20, 20);
    }
    if(currMode=="rectangleMode"){
        drawImage(check, menuX+50, menuY+160, 20, 20);
    }
    for(let i = 0; i < narisuvano.length; i ++){
        narisuvano[i].draw();
    }
    //stroke line
    if(strokeMode){  
        let tx=mouseX, ty=mouseY;
        if(ty>550){
            ty=550;
        }
        context.beginPath();
        context.moveTo(l.sx, l.sy);
        context.lineTo(tx, ty);
        context.strokeStyle = l.color;
        context.lineWidth=l.size;
        context.stroke();
        context.closePath();
    } 
    //stroke rectangle
    if(strokeRectangle){ 
        let tx =mouseX, ty=mouseY;
        if(ty>550){
            ty=550;
        }
        context.strokeStyle = r.color;
        context.lineWidth=r.size;
        context.strokeRect(r.ux,r.uy,tx-r.ux,ty-r.uy);
    }
    //sizes text    
    context.fillStyle = "black";
    context.font="25px Arial";
    context.fillText("Size: "+currGlobalSize,5,25);
    //coordinates
    context.font="10px Arial";
    context.fillText(mouseX+", "+mouseY+"px",10,545);
    
};
function keydown(key){
    if(key == 38 && currGlobalSize < 400){
        currGlobalSize++;
    }
    
    if(key == 40 && currGlobalSize > 1){
        currGlobalSize--;
    }
}
function mousedown(){
    if(currMode=="lineMode"){
        if(mouseY<550){
            l.sx = mouseX;
            l.sy = mouseY;
            l.size=currGlobalSize;
            l.color=currGlobalColor;
            strokeMode = true;
        }
        
    }
    if(currMode=="eraserMode"){
        clearMode = true;
        narisuvano.push(new Eraser(eraserX,eraserY,
                                   eraserSize));
        
    }
    if(currMode=="pencilMode"){
        drawMode = true;
        narisuvano.push(new Pencil(pencilX, pencilY,
                                   pencilSize, currGlobalColor));
    }
    if(currMode=="rectangleMode"){
        if(/*mouseY<550*/mouseX-currGlobalSize/2 > menuX+80 && mouseY + currGlobalSize/2 < 550){
            r.ux = mouseX;
            r.uy = mouseY;
            r.size=currGlobalSize;
            r.color=currGlobalColor;
            strokeRectangle = true;
        }
        
    }
};

function mouseup() {
    // Show coordinates of mouse on click
    //choose curr color
    if( mouseY>550){
        currGlobalColor = newColor[mouseY-600][mouseX];
    }
    
    if(currMode=="lineMode"){
        if(mouseX-currGlobalSize/2 > menuX+80 && mouseY + currGlobalSize/2 < 550){
            l.fx = mouseX;
            l.fy = mouseY;
            strokeMode = false;
            narisuvano.push(l);
            l = new Line;
        }else{
        	strokeMode = false;
        }
        
    }
    
    if(currMode=="eraserMode"){
        clearMode = false;
        eraserX = [];
        eraserY = [];
        eraserSize=[];
    }
    if(currMode=="pencilMode"){
        drawMode = false; 
        pencilX = []; 
        pencilY = []; 
        pencilSize=[];
    }
    
    if(currMode=="rectangleMode"){
        if(mouseX-currGlobalSize/2 > menuX+80 && mouseY + currGlobalSize/2 < 550){
            r.dx = mouseX-r.ux;
            r.dy = mouseY-r.uy;
            strokeRectangle = false;
            narisuvano.push(r);
            r = new Rectangle;
        }else{
        	strokeRectangle = false;
        }   
    }
    //menu
    if(areColliding(menuX,menuY, 40, 40, 
                    mouseX, mouseY, 1, 1)){
        currMode="lineMode";
    }
    if(areColliding(menuX,menuY+50, 40, 40, 
                    mouseX, mouseY, 1, 1)){
        currMode = "eraserMode";
    }
    if(areColliding(menuX,menuY+100, 40, 40, 
                    mouseX, mouseY, 1, 1)){
        currMode = "pencilMode";
    }
    if(areColliding(menuX,menuY+150, 40, 40, 
                    mouseX, mouseY, 1, 1)){
        currMode = "rectangleMode";
    }
    if(areColliding(menuX,menuY+200, 40, 40, 
                    mouseX, mouseY, 1, 1)){
        narisuvano=[];
    }
};