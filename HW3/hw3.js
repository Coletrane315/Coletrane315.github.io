//Homework 3, Colten Stamm
//I'm not sure I created exactly what you had in mind, but I think the concept is there
//There is a button that starts a morphing animation, repeats forwards and backwards until pressed again.
//When the animation is not running, the slider can also be adjusted to look at any specific frame in the morph

"use strict";

var canvas = document.getElementById("gl-canvas"); //canvas element
var gl = canvas.getContext("webgl2"); //gl context
if(!gl){alert("WebGL 2.0 is not available")};
var morphButton = document.getElementById("morphB"); //button element
var morphSlider = document.getElementById("slider"); //slider element
var morphSliderLabel = document.getElementById("sliderLabelVal");
var morphLoc; //morph location in vertex shader
var morphParameter = 0.0; //initial value of 0
var morphButtonClicked = false; //changes on button click
var forward = true; //boolean to decide if we are going from initial shape to end or from end back to initial
var morphCounter = 0; //animation frame counter
var delay = 50; //millisecond delay

//initial shape
var object1 = [
    vec2(-0.5, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5),
    vec2(0.5, 0.5),
    vec2(0.3, 0.5),
    vec2(0.3, -0.3),
    vec2(-0.3, -0.3),
    vec2(-0.3, 0.5)
];

//shape to morph towards
var object2 = [
    vec2(-0.5, 0.5),
    vec2(-0.5, 0.3),
    vec2(-0.12, 0.3),
    vec2(-0.12, -0.5),
    vec2(0.12, -0.5),
    vec2(0.12, 0.3),
    vec2(0.5, 0.3),
    vec2(0.5, 0.5)
]

init();

function init() {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    //Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //object 1 
    var bufferId1 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId1);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(object1), gl.STATIC_DRAW);
    var positionLoc1 = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc1, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc1);

    //object 2
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(object2), gl.STATIC_DRAW);
    var positionLoc2 = gl.getAttribLocation(program, "bPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    //get the location of morph in vertex shader, set its initial value of 0 here
    morphLoc = gl.getUniformLocation(program, "t");
    gl.uniform1f(morphLoc, morphParameter);

    render();
}

function render() {
    //Replace the points data in the GPU
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_LOOP, 0, object2.length);
}

//called when the morph button is clicked
//if this is starting the morph, disable the slider and start the animation
//if this is ending the morph, reset back to the start and enable the slider again
function morphButtonClick(){
    if(morphButtonClicked){
        morphButtonClicked = false;
        morphSlider.disabled = false;
        morphParameter = 0.0;
        morphSliderLabel.innerHTML = morphParameter.toFixed(2);
        gl.uniform1f(morphLoc, morphParameter);
        render();
    }else{
        morphButtonClicked = true;
        morphParameter = 0.00;
        morphSlider.value = 0.00;
        morphSliderLabel.innerHTML = 0.00;
        morphSlider.disabled = !morphSlider.disabled;
        morphCounter = 0;
        forward = true;
        morph();
    }
}

//increments or decrements the morph parameter by 0.05, called repeatedly until button is pressed again
function morph(){
    if(morphButtonClicked){
        morphSlider.disabled = true;
        //Check if the final state of morphing has been reached, and change direction
        //also designed to have a little extra pause time at the endpoints
        if(morphCounter == 20){
            forward = !forward;
            morphCounter = 0;
            delay = 300;
        }else{
            delay = 50;
            //alter parameter by 0.05 in either direction depending on value of forward
            if(forward){
                morphParameter += 0.05;
            }else{
                morphParameter -= 0.05;
            }
            morphCounter++;
            morphSliderLabel.innerHTML = morphParameter.toFixed(2); //Update slider label
            gl.uniform1f(morphLoc, morphParameter);
            render();
        }
        setTimeout(function (){requestAnimationFrame(morph);}, delay);
    }
}

//called on change to slider
function sliderChange(){
    morphParameter = morphSlider.value; //get new slider value on change
    morphSliderLabel.innerHTML = morphParameter; //Update slider label
    gl.uniform1f(morphLoc, morphParameter); //pass new value to vertex shader
    render();
}