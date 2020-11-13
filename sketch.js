let video;
let poseNet;
let pose;

let meterPosition = 0;
let textTransparencyA = 0;
let textTransparencyB = 0;
let textTransparencyC = 0;
let textTransparencyD = 0;
let textTransparencyE = 0;

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    
    pixelDensity(1);
}

function gotPoses(poses) {
    //console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
    }
}

function modelLoaded() {
    console.log('poseNet ready');
}

function draw() {
    //flip video
    push();
      translate(video.width, 0);
      scale(-1,1);
      image(video,0,0);
    pop();  
        
    //change emotion filters
    if (pose) {
        if (pose.nose.x > 0 && pose.nose.x < width/5) {
            calmFilter();
            calmEffect();
            meterPosition = width/5*2;
            textTransparencyA = 0;
            textTransparencyB = 0;
            textTransparencyC = 0;
            textTransparencyD = 0;
            textTransparencyE = 255;            
        } else if (pose.nose.x > width/5 && pose.nose.x < width/5*2) {
            happyFilter();
            happyEffect();
            meterPosition = width/5;
            textTransparencyA = 0;
            textTransparencyB = 0;
            textTransparencyC = 0;
            textTransparencyD = 255;
            textTransparencyE = 0; 
        } else if (pose.nose.x > width/5*2 && pose.nose.x < width/5*3) {
            okayFilter();
            meterPosition = 0;
            textTransparencyA = 0;
            textTransparencyB = 0;
            textTransparencyC = 255;
            textTransparencyD = 0;
            textTransparencyE = 0; 
        } else if (pose.nose.x > width/5*3 && pose.nose.x < width/5*4) {
            sadFilter();
            sadEffect();
            fill(0,0,0,150);
            rect(width/2, height/2, width, height);
            meterPosition = -width/5;
            textTransparencyA = 0;
            textTransparencyB = 255;
            textTransparencyC = 0;
            textTransparencyD = 0;
            textTransparencyE = 0; 
        } else if (pose.nose.x > width/5*4 && pose.nose.x < width) {
            angryFilter();
            angryEffect();
            meterPosition = -width/5*2;
            textTransparencyA = 255;
            textTransparencyB = 0;
            textTransparencyC = 0;
            textTransparencyD = 0;
            textTransparencyE = 0; 
        }   
        
        drawLayout();
    }
}

function angryFilter() {
    loadPixels();
    for (var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            var index = (x+y*width)*4;
            
            let r = pixels[index+0];
            let g = pixels[index+1];
            let b = pixels[index+2];
            let a = pixels[index+3];
            
            c = color(r,g,b,a);
            
            bright = brightness(c);
          
            if(bright < 35) {
                pixels[index+0] = 0;
            } else {
                pixels[index+0] = r+50;
            }
            
            pixels[index+1] = 0;
            pixels[index+2] = 0;
            pixels[index+3] = 255;
        }
    }
    updatePixels();
}

function sadFilter() {
    loadPixels();
    for (var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            var index = (x+y*width)*4;
            
            let r = pixels[index+0];
            let g = pixels[index+1];
            let b = pixels[index+2];
            let a = pixels[index+3];
            
            c = color(r,g,b,a);
            
            bright = brightness(c);
          
            if(bright < 50) {
                pixels[index+0] = 0;
            } else {
                pixels[index+0] = r;
            }
            
            //pixels[index+0] = r;
            pixels[index+1] = g;
            pixels[index+2] = b-20;
            pixels[index+3] = 225;
        }
    }
    updatePixels();
}

function okayFilter() {
    loadPixels();
    for (var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            var index = (x+y*width)*4;
            
            let r = pixels[index+0];
            let g = pixels[index+1];
            let b = pixels[index+2];
            let a = pixels[index+3];
            
            let avg = (r+g+b)/3; 
            
            pixels[index+0] = avg;
            pixels[index+1] = avg;
            pixels[index+2] = avg;
            pixels[index+3] = 255;
        }
    }
    updatePixels();
}

function happyFilter() {
    loadPixels();
    for (var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            var index = (x+y*width)*4;
            
            let r = pixels[index+0];
            let g = pixels[index+1];
            let b = pixels[index+2];
            let a = pixels[index+3];
            
            pixels[index+0] = 100+r;
            pixels[index+1] = 100-g;
            pixels[index+2] = 300-b;
            pixels[index+3] = 255;
        }
    }
    updatePixels();
}

function calmFilter() {
    loadPixels();
    for (var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            var index = (x+y*width)*4;
            
            let r = pixels[index+0];
            let g = pixels[index+1];
            let b = pixels[index+2];
            let a = pixels[index+3];
            
            pixels[index+0] = r-10;
            pixels[index+1] = g-10;
            pixels[index+2] = 100;
            pixels[index+3] = 125;
        }
    }
    
    //add blur
    var a = [[1.25,1.25,1.25],
             [1.25,1,1.25],
             [1.25,1.25,1.25]];
        
    var w = width;
    var h = height;
    
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            var ul = ((x-1+w)%w + w*((y-1+h)%h))*4; 
			var uc = ((x-0+w)%w + w*((y-1+h)%h))*4; 
			var ur = ((x+1+w)%w + w*((y-1+h)%h))*4; 
			var ml = ((x-1+w)%w + w*((y+0+h)%h))*4; 
			var mc = ((x-0+w)%w + w*((y+0+h)%h))*4; 
			var mr = ((x+1+w)%w + w*((y+0+h)%h))*4; 
			var ll = ((x-1+w)%w + w*((y+1+h)%h))*4; 
			var lc = ((x-0+w)%w + w*((y+1+h)%h))*4; 
			var lr = ((x+1+w)%w + w*((y+1+h)%h))*4;
            
            var p0 = pixels[ul]*a[0][0]; // upper left
			var p1 = pixels[uc]*a[0][1]; // upper mid
			var p2 = pixels[ur]*a[0][2]; // upper right
			var p3 = pixels[ml]*a[1][0]; // left
			var p4 = pixels[mc]*a[1][1]; // center pixel
			var p5 = pixels[mr]*a[1][2]; // right
			var p6 = pixels[ll]*a[2][0]; // lower left
			var p7 = pixels[lc]*a[2][1]; // lower mid
			var p8 = pixels[lr]*a[2][2]; // lower right
			var red = (p0+p1+p2+p3+p4+p5+p6+p7+p8)/9; 

			var p0 = pixels[ul+1]*a[0][0]; // upper left
			var p1 = pixels[uc+1]*a[0][1]; // upper mid
			var p2 = pixels[ur+1]*a[0][2]; // upper right
			var p3 = pixels[ml+1]*a[1][0]; // left
			var p4 = pixels[mc+1]*a[1][1]; // center pixel
			var p5 = pixels[mr+1]*a[1][2]; // right
			var p6 = pixels[ll+1]*a[2][0]; // lower left
			var p7 = pixels[lc+1]*a[2][1]; // lower mid
			var p8 = pixels[lr+1]*a[2][2]; // lower right
			var green = (p0+p1+p2+p3+p4+p5+p6+p7+p8)/9; 
            
            var p0 = pixels[ul+2]*a[0][0]; // upper left
			var p1 = pixels[uc+2]*a[0][1]; // upper mid
			var p2 = pixels[ur+2]*a[0][2]; // upper right
			var p3 = pixels[ml+2]*a[1][0]; // left
			var p4 = pixels[mc+2]*a[1][1]; // center pixel
			var p5 = pixels[mr+2]*a[1][2]; // right
			var p6 = pixels[ll+2]*a[2][0]; // lower left
			var p7 = pixels[lc+2]*a[2][1]; // lower mid
			var p8 = pixels[lr+2]*a[2][2]; // lower right
			var blue = (p0+p1+p2+p3+p4+p5+p6+p7+p8)/9; 
                        
            pixels[mc] = red; 
			pixels[mc+1] = green; 
			pixels[mc+2] = blue; 
			pixels[mc+3] = 125; 
        }
    }
    updatePixels();
}

function angryEffect() {
    x = width-pose.nose.x;
    y = pose.nose.y;
    
    angleMode(DEGREES);
    noFill();
    strokeWeight(4);
    stroke(255, random(255));
    line(x+30, y-120, x+38, y-110);
    line(x+38, y-110, x+30, y-100);
    line(x+35, y-125, x+45, y-117);
    line(x+45, y-117, x+55, y-125);
    line(x+60, y-120, x+52, y-110);
    line(x+52, y-110, x+60, y-100);
    line(x+35, y-95, x+45, y-103);
    line(x+45, y-103, x+55, y-95);
    
    line(x+80, y-90, x+88, y-80);
    line(x+88, y-80, x+80, y-70);
    line(x+85, y-95, x+95, y-87);
    line(x+95, y-87, x+105, y-95);
    line(x+110, y-90, x+102, y-80);
    line(x+102, y-80, x+110, y-70);
    line(x+85, y-65, x+95, y-73);
    line(x+95, y-73, x+105, y-65);
}

function sadEffect() {
    xl = width-pose.leftEye.x;
    yl = pose.leftEye.y;
    xr = width-pose.rightEye.x;
    yr = pose.rightEye.y;
    
    stroke(255,200);
    fill(255,random(100,175));
    ellipse(xl-12.5, yl+7.5, 10, 7.5);
    circle(xl-17.5, yl+10, 5);
    ellipse(xr+12.5, yr+7.5, 10, 7.5);
    circle(xr+17.5, yr+10, 5);
    ellipse(xl-27.5, yl+65, 7.5, 10);    
    ellipse(xr+27.5, yr+55, 7.5, 10);    
}

function happyEffect() {
    xl = width-pose.nose.x-60;
    xr = width-pose.nose.x+60;
    y = pose.nose.y;
    size = 25;
    
    beginShape();
    fill(255, 150);
    vertex(xl, y);
    bezierVertex(xl-size/2, y-size/2, xl-size, y+size/3, xl, y+size);
    bezierVertex(xl+size, y+size/3, xl+size/2, y-size/2, xl, y);
    vertex(xr, y);
    bezierVertex(xr-size/2, y-size/2, xr-size, y+size/3, xr, y+size);
    bezierVertex(xr+size, y+size/3, xr+size/2, y-size/2, xr, y);
    endShape(CLOSE);
}

function calmEffect() {
    x = width-pose.nose.x;
    y = pose.nose.y;
    
    noStroke();
    fill(255, random(255,0));
    
    triangle(x-100, y-70, x-105, y-50, x-95, y-50);
    triangle(x-100, y-30, x-105, y-50, x-95, y-50);
    triangle(x-110, y-50, x-100, y-55, x-100, y-45);
    triangle(x-90, y-50, x-100, y-55, x-100, y-45);
    
    triangle(x-80, y-100, x-82.5, y-90, x-77.5, y-90);
    triangle(x-80, y-80, x-82.5, y-90, x-77.5, y-90);
    triangle(x-85, y-90, x-80, y-92.5, x-80, y-87.5);
    triangle(x-75, y-90, x-80, y-92.5, x-80, y-87.5);
    
    triangle(x-35, y-125, x-37.5, y-115, x-32.5, y-115);
    triangle(x-35, y-105, x-37.5, y-115, x-32.5, y-115);
    triangle(x-40, y-115, x-35, y-117.5, x-35, y-112.5);
    triangle(x-30, y-115, x-35, y-117.5, x-35, y-112.5);
    
    triangle(x-15, y-130, x-17.5, y-120, x-12.5, y-120);
    triangle(x-15, y-110, x-17.5, y-120, x-12.5, y-120);
    triangle(x-20, y-120, x-15, y-122.5, x-15, y-117.5);
    triangle(x-10, y-120, x-15, y-122.5, x-15, y-117.5);
    
    triangle(x+25, y-115, x+22.5, y-105, x+27.5, y-105);
    triangle(x+25, y-95, x+22.5, y-105, x+27.5, y-105);
    triangle(x+20, y-105, x+25, y-107.5, x+25, y-102.5);
    triangle(x+30, y-105, x+25, y-107.5, x+25, y-102.5);
    
    triangle(x+50, y-90, x+47.5, y-80, x+52.5, y-80);
    triangle(x+50, y-70, x+47.5, y-80, x+52.5, y-80);
    triangle(x+45, y-80, x+50, y-82.5, x+50, y-77.5);
    triangle(x+55, y-80, x+50, y-82.5, x+50, y-77.5);
    
    triangle(x+60, y-70, x+55, y-50, x+65, y-50);
    triangle(x+60, y-30, x+55, y-50, x+65, y-50);
    triangle(x+50, y-50, x+60, y-55, x+60, y-45);
    triangle(x+70, y-50, x+60, y-55, x+60, y-45);
    
}
    
function drawLayout() {
    //draw separate blocks
    rectMode(CENTER);
    fill(255,255,255,50);
    strokeWeight(1);
    stroke(255,25);
    rect(width/10*1, height/2, width/5, height);
    rect(width/10*3, height/2, width/5, height);
    rect(width/10*5, height/2, width/5, height);
    rect(width/10*7, height/2, width/5, height);
    rect(width/10*9, height/2, width/5, height);
    
    //draw meter
    fill(255,255,255,100);
    stroke(255);
    rect(width/2, height-50, width-width/5, 5, 2.5, 2.5, 2.5, 2.5);
    
    fill(255,255,255);
    circle(width/2+meterPosition, height-50, 20);
    
    //draw text
    noStroke();
    fill(255, 255, 255);
    textSize(40);
    textFont('Overpass');
    textAlign(CENTER);
    textStyle(NORMAL);
    text('EMOTION METER', width/2, 75);
    textSize(15);
    textStyle(ITALIC);
    text('Tilt Your Head To See How You Are Feeling', width/2, 100);
    textSize(10);
    fill(255, textTransparencyA);
    text('Angry', width/10, height-70);
    fill(255, textTransparencyB);
    text('Sad', width/10*3, height-70);
    fill(255, textTransparencyC);
    text('Okay', width/10*5, height-70);
    fill(255, textTransparencyD);
    text('Happy', width/10*7, height-70);
    fill(255, textTransparencyE);
    text('Calm', width/10*9, height-70);
}