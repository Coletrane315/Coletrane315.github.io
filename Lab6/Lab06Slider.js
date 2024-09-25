//Lab 6, Colten Stamm

"use strict";
var gl;
var points;
var colors;
var sliderElem = document.getElementById("slider");

init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points=[
    vec2(-0.95, 0.95),
    vec2(0, 0.95),
    vec2(0.95, 0.95),
    vec2(-0.95, 0.0),
    vec2(0, 0.0),
    vec2(0.95, 0.0),
    vec2(-0.95, -0.95),
    vec2(0.0, -0.95),
    vec2(0.95, -0.95)
    ];

    colors=[
    vec4(1.0, 0, 0, 1.0),
    vec4(0, 1.0, 0, 1.0 ),
    vec4(0, 0, 1.0, 1.0),
    vec4(1.0, 0, 0, 1.0 ),
    vec4(0, 1.0, 0, 1.0),
    vec4(0, 0, 1.0, 1.0 ),
    vec4(1.0, 0, 0, 1.0),
    vec4(0, 1.0, 0, 1.0 ),
    vec4(0, 0, 1.0, 1.0)
    ];

    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    // a color buffer is created and attached
    var cbufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    var colorLoc = gl.getAttribLocation( program, "aColor" );
    gl.vertexAttribPointer( colorLoc, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( colorLoc );


    render();
};

//Render is called on initial loading, and then is called onChange to the input range slider
function render() {
    gl.clear( gl.COLOR_BUFFER_BIT);

    document.getElementById("sliderLabelVal").innerHTML = sliderElem.value; //Update slider label
    gl.drawArrays(gl.POINTS, 0, sliderElem.value); //Number of points printed based on slider value
}