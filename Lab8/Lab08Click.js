//Lab 8, Colten Stamm
//This one took me forever to figure out because my CSS styling was messing with the math. Fetching the mouse coordinates with event.client
//gives you the coordinates relative to the current viewport (or whatever chunk of the screen is visible at the time),
//despite the event listener being applied to the canvas and not the document or body. So I realized I had to translate those coordinates
//to be in line with the canvas by subtracting the x-y of the canvas.

"use strict";

var canvas = document.getElementById("gl-canvas");
var canvasCoords = canvas.getBoundingClientRect();
var gl = canvas.getContext("webgl2");
if(!gl){alert("WebGL 2.0 is not available")};
var saveClearButton = document.getElementById("saveClearB");
var saveOrClear = true;

var maxNumPositions = 200;

var t;
var points=[vec2(0.00, 0.00)];

init();

function init() {
    //by default, points are saved and will not be deleted if clicking another spot
    //if this button is clicked, canvas is reset and future points will not be saved until clicking the button again
    saveClearButton.addEventListener("click", function(){
        saveOrClear = !saveOrClear;
        points = [vec2(0.00, 0.00)];
        render();
    })

    // gets mouse coordinates on click, translates to canvas coordinates, then to clipping coordinates for GL
    canvas.addEventListener("mousedown", function(event){
        if(!saveOrClear){
            points = [vec2(0.00, 0.00)];
        }
        let x = 2 * (event.clientX - canvasCoords.left) / canvas.width - 1;
        let y = 2 * (canvas.height - (event.clientY - canvasCoords.top)) / canvas.height - 1;
        t = vec2(x, y);
        points.push(t);
        render();
    });

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * Math.pow(3, 6), gl.STATIC_DRAW);
    var postionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(postionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(postionLoc);

    render();
}

function render() {
    // replace the points data in the GPU
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));

    gl.clear(gl.COLOR_BUFFER_BIT);

    // don't render the first point, (0,0)
    gl.drawArrays(gl.POINTS, 1, points.length - 1);
}
