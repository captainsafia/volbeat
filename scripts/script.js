// Vertex shader
var VSHADER = 
'   uniform mat4 mvp_matrix;\n' +
'   uniform mat4 model_matrix;\n' +
'   uniform mat4 normal_matrix;\n' +
'   attribute vec4  position;\n' +
'   attribute vec4 color;\n' +
'   void main() {\n' +
'   };';

// Fragment shader
var FSHADER = 
'   precision mediump float;\n' +
'   varying vec4 v_Color;\n' +
'   void main() {\n' +
'   };';

$(document).ready(function() {
    var canvas = $("#webgl").get(0);
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    var rendering = getWebGLContext(canvas);

    if (!rendering) {
        throw new Error("Unable to get WebGL context.");
    }

    rendering.clearColor(0.0, 0.0, 0.0, 1.0);
    rendering.enable(rendering.DEPTH_TEST);
    rendering.clear(rendering.COLOR_BUFFER_BIT);
});
