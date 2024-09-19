//Homework 2, Colten Stamm
//Koch Mountains

"use strict";
var points = []; //global points array, could also just pass the values back up recursively
var canvas = document.getElementById("gl-canvas");
var gl = canvas.getContext('webgl2');
var sliderElem = document.getElementById("slider");
var sliderDisplayVal = document.getElementById("sliderLabelVal");
var recursiveSteps = sliderElem.value; //how many recursive steps to take, reads value from slider, defaults to 0

init();

function init(){
    if (!gl) {alert("WebGL isn't available");}
    
    //Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //Load shaders and initialize attribute buffers
    let program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);
        
    kochRecursive(vec2(-1, 0), vec2(1, 0), sliderElem.value); //starts recursive loop with initial endpoints

    //Load the data into the GPU
    let bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
        
    //Associate out shader variables with our data buffer
    let positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc , 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);
        
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINES, 0, points.length);
    points = []; //clears points array
};

//called onChange to the slider, updates the display label, then renders again
function refresh(){
    sliderDisplayVal.innerHTML = sliderElem.value;
    init();
}

function kochRecursive(start, end, recSteps){
    //If at the bottom of recursion, just draw horizontal line
    if(recSteps == 0){
        points.push(start);
        points.push(end);
        return;
    }

    kochRecursive(start, vec2(start[0] + (end[0] - start[0]) / 3, start[1]), recSteps - 1); //Left-side recursion

    points.push(vec2(start[0] + (end[0] - start[0]) / 3, start[1])); //endpoint of bottom left of triangle
    points.push(vec2(start[0] + (end[0] - start[0]) / 2, start[1] + (end[0] - start[0]) * Math.sqrt(3) / 6)); //endpoint of top of triangle
    //Since I am using the LINES primitive instead of LINE_STRIP, we need a second copy of this point
    points.push(vec2(start[0] + (end[0] - start[0]) / 2, start[1] + (end[0] - start[0]) * Math.sqrt(3) / 6)); //endpoint of top of triangle
    points.push(vec2(start[0] + (end[0] - start[0]) * 2 / 3, start[1])); //endpoint of bottom right of triangle

    kochRecursive(vec2(start[0] + (end[0] - start[0]) * 2 / 3, start[1]), vec2(end[0], end[1]),recSteps - 1); //Right-side recursion
}