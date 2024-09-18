//Homework 2, Colten Stamm
//Koch Mountains

"use strict";
var canvas = document.getElementById("gl-canvas");
var gl = canvas.getContext('webgl2');
var points = [vec2(-1, 0), vec2(1, 0)];
var sliderElem = document.getElementById("slider");
var sliderDisplayVal = document.getElementById("sliderLabelVal");
var recursiveSteps = sliderElem.value;

init(points, gl.LINES);

function init(pointsArr, mode){
    if (!gl) {alert("WebGL isn't available");}
    
    //Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //Load shaders and initialize attribute buffers
    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //Load the data into the GPU
    let bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArr), gl.STATIC_DRAW);

    //Associate out shader variables with our data buffer
    let positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc , 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    render(mode);
};

function render(renderMode){
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(renderMode, 0, points.length);
}

function refresh(){
    sliderDisplayVal.innerHTML = sliderElem.value;
    kochRecursive(points[0], points[1], sliderElem.value);
}

function kochRecursive(start, end, recSteps){
    if(recSteps == 0){
        let tmpPts = [vec2(start.x, start.y), vec2(start.x + (end.x - start.x) / 3, start.y), 
            vec2(start.x + (end.x - start.x) / 2, start.y + (end.x - start.x) * Math.sqrt(3) / 3),
            vec2(start.x + (end.x - start.x) * 2 / 3, start.y), vec2(end.x, end.y)];
        init(tmpPts, gl.LINE_STRIP);
        return;
    }

    kochRecursive(start, (start.x + end.x) / 3, recSteps - 1);
    kochRecursive((start.x + end.x) * 2 / 3, end.x, recSteps - 1);




}