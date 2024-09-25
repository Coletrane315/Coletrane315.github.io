//Lab 7, Colten Stamm

"use strict";

var gl;

var theta = 0.0;
var thetaLoc;

var rotationSpeed = 0.1;

var color = vec4(0.0, 0.0, 1.0, 1.0);
var colorLoc;

var delay = 100;
var rotation = true;

var tmpVal;

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vertices = [
        vec2(-0.5, -0.2),
        vec2(0.5, -0.2),
        vec2(0, Math.tan(Math.PI / 3) * 0.5 - 0.2)
    ];


    // Load the data into the GPU

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation( program, "uTheta" );
    colorLoc = gl.getUniformLocation(program, "aColor");

    //define the uniform variable in the shader, aColor
    gl.uniform4fv(colorLoc, color);

    //button listener in HTML tag
    // keyboard listener here
    // '1' = toggle rotation
    // '2' = triangle is red (use the variable named color), can toggle back to blue
    // '3' = triangle is green (use the variable named color), can toggle back to blue
    // '4' = triangle rotation speed toggle
    document.addEventListener('keydown', function(event) {
        let keyVal = event.key;
        if(keyVal == '1'){
            rotation = !rotation;
        }else if(keyVal == '2'){
            if(color[0] == 1.0){
                color = vec4(0, 0, 1.0, 1.0);
            }else{
                color = vec4(1.0, 0, 0, 1.0);
            }
            gl.uniform4fv(colorLoc, color);
        }else if(keyVal == '3'){
            if(color[1] == 1.0){
                color = vec4(0, 0, 1.0, 1.0);
            }else{
                color = vec4(0, 1.0, 0, 1.0);
            }
            gl.uniform4fv(colorLoc, color);
        }else if(keyVal == '4'){
            if(rotationSpeed == 0.1){
                rotationSpeed = 0.2;
                delay = 50;
            }else{
                rotationSpeed = 0.1;
                delay = 100;
            }
        }
    })


    render();
};

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    theta += (rotation ? rotationSpeed : 0.0);
    gl.uniform1f(thetaLoc, theta);
    gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    setTimeout(function (){requestAnimationFrame(render);}, delay);
}
