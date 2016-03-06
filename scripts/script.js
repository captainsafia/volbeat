// Vertex shader
var VSHADER = 
'   attribute vec4 a_Position;\n' +
'   attribute vec4 a_Color;\n' +
'   attribute vec4 a_Normal;\n' +
'   uniform mat4 u_mvpMatrix;\n' +
'   uniform mat4 u_NormalMatrix;\n' +
'   varying vec4 v_Color;\n' +
'   void main() {\n' +
'       gl_Position = u_mvpMatrix * a_Position;\n' +
'       vec3 lightDirection = normalize(vec3(0.0, 0.5, 0.7));\n' +
'       vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n' +
'       vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
'       float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
'       v_Color = a_Color;\n' +
'   }\n';

// Fragment shader
var FSHADER = 
'   #ifdef GL_ES\n' +
'   precision mediump float;\n' +
'   #endif\n' +
'   varying vec4 v_Color;\n' +
'   void main() {\n' +
'       gl_FragColor = v_Color;\n' +
'   }\n';

var g_EyeX = 0.20, g_EyeY = 0.25, g_EyeZ = 4.25;
var g_AtX = 0, g_AtY = 0, g_AtZ = 0;
var g_UpX = 0, g_UpY = 1, g_UpZ = 0;
var canvas, rendering;
var gndVerts, armPartVerts;

function initVertexBuffers(rendering) {
    gndVerts = makeGroundGrid();
    armPart = makeArmPart();

    vertSize = gndVerts.length + armPart.length;
    var vertNum = vertSize / floatsPerVertex;

    var verticesColors = new Float32Array(vertSize);

    gndStart = 0;
    for (i = 0, j = 0; j < gndVerts.length; i++, j++) {
        verticesColors[i] = gndVerts[j];
    }

    armPartStart = i;
    for (j = 0; i < armPartVerts; i++, j++) {
        verticesColors[i] = armPart[j];
    }

    var vertexColorBuffer = rendering.createBuffer();
    if (!vertexColorBuffer) {
        throw new ("Failed to create buffer object.");
    }

    rendering.bindBuffer(rendering.ARRAY_BUFFER, vertexColorBuffer);
    rendering.bufferData(rendering.ARRAY_BUFFER, verticesColors, 
        rendering.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    var a_Position = rendering.getAttribLocation(rendering.program, 
        "a_Position");
    if (a_Position < 0) {
        throw new Error("Failed to get storage location of a_Position");
    }

    rendering.vertexAttribPointer(a_Position, 3, rendering.FLOAT, 
        false, FSIZE * 6, 0);
    rendering.enableVertexAttribArray(a_Position);

    var a_Color = rendering.getAttribLocation(rendering.program, 'a_Color');
    if (a_Color < 0) {
        throw new Error("Failed to get storage location of a_Color");
    }

    rendering.vertexAttribPointer(a_Color, 3, rendering.FLOAT, 
            false, FSIZE * 6, FSIZE * 3);
    rendering.enableVertexAttribArray(a_Color);

    return vertSize / floatsPerVertex;
}

/* Start of jointed arm drawing functions */
function base() {
    var BASE_WIDTH = 5.0;
    var BASE_HEIGHT = 2.0;
    viewMatrix.scale(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    viewMatrix.translate(0.0, 0.5 * BASE_HEIGHT, 0.0);

    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    
    rendering.drawArrays(rendering.TRIANGLES, 
                        armPartStart / floatsPerVertex, 
                        armPart.length / floatsPerVertex);
}

function upperArm() {
    var UPPER_ARM_WIDTH = 0.5;
    var UPPER_ARM_HEIGHT = 5.0;
    viewMatrix.scale(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, UPPER_ARM_WIDTH);
    viewMatrix.translate(0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0);

    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    rendering.drawArrays(rendering.TRIANGLES,
                        armPartStart / floatsPerVertex,
                        armPart.length / floatsPerVertex);
}

function lowerArm() {
    var LOWER_ARM_WIDTH = 0.5;
    var LOWER_ARM_HEIGHT = 5.0;
    viewMatrix.scale(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, LOWER_ARM_WIDTH);
    viewMatrix.translate(0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0);

    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    rendering.drawArrays(rendering.TRIANGLES,
                        armPartStart / floatsPerVertex,
                        armPart.length / floatsPerVertex);
}
/* End of jointed arm drawing functions */

function draw(rendering) {
    rendering.clear(rendering.COLOR_BUFFER_BIT | rendering.DEPTH_BUFFER_BIT);
    rendering.viewport(0, 0, rendering.drawingBufferWidth, 
            rendering.drawingBufferHeight);

    viewMatrix.setLookAt(g_EyeX, g_EyeY, g_EyeZ,
                        g_AtX, g_AtY, g_AtZ,
                        g_UpX, g_UpY, g_UpZ);

    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    drawScene(rendering);
}

function drawScene(rendering) {
    // Draw the ground plane 
    viewMatrix.rotate(-90.0, 1, 0, 0);
    viewMatrix.translate(0.0, 0.0, -0.6);
    viewMatrix.scale(0.4, 0.4, 0.4);

    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    rendering.drawArrays(rendering.LINES, 
            gndStart / floatsPerVertex, 
            gndVerts.length / floatsPerVertex);

    // Then rotate back the view matrix
    viewMatrix.rotate(90.0, 1, 0, 0);
   
    // Then draw the robot parts
    base();
    lowerArm();
    upperArm();
}

function resize() {
    var canvas = $("#webgl").get(0);
    var rendering = getWebGLContext(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw(rendering);
}

$(document).keydown(function(event) {
    switch (event.which) {
        // Up arrow
        case 38:
            g_EyeZ += 0.1;
            g_AtZ += 0.1;
            break;
        // Down arrow
        case 40:
            g_EyeZ -= 0.1;
            g_AtZ -= 0.1;
            break;
        // Right arrow
        case 39:
            g_EyeX += 0.1;
            g_AtX += 0.1;
            break;
        // Left arrow
        case 37:
            g_EyeX -= 0.1;
            g_AtX -= 0.1;
            break;
        // 'A' key
        case 65:
            g_AtX += g_EyeX + Math.cos(0.01);
        // 'S' key
        case 83:
            g_AtX -= g_EyeX + Math.cos(0.01);
            break;
        // 'Z' key
        case 90:
            g_AtY += 0.01;
            break;
        // 'X' key
        case 88:
            g_AtY -= 0.01;
            break;
    }
    draw(rendering);
});

$(document).ready(function() {
    canvas = $("#webgl").get(0);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    rendering = getWebGLContext(canvas);

    if (!rendering) {
        throw new Error("Unable to get WebGL context.");
    }

    if (!initShaders(rendering, VSHADER, FSHADER)) {
        throw new Error("Failed to initialize shaders.");
        return;
    }

    rendering.enable(rendering.DEPTH_TEST);

    var n = initVertexBuffers(rendering);
    if (n < 0) {
        throw new Error("Failed to specify vertex information.");
        return;
    }

    rendering.clearColor(0.0, 0.0, 0.0, 1.0);

    u_mvpMatrix = rendering.getUniformLocation(rendering.program, 
            "u_mvpMatrix");
    u_NormalMatrix = rendering.getUniformLocation(rendering.program, 
            "u_NormalMatrix");
    if (!u_mvpMatrix || !u_NormalMatrix) {
        throw new Error("Failed to get mvp_matrix or normal_matrix.");
        return;
    }

    viewMatrix = new Matrix4();
    modelMatrix = new Matrix4();
    projMatrix = new Matrix4();
    mvpMatrix = new Matrix4();

    projMatrix.setPerspective(40, canvas.width / canvas.height, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    draw(rendering);
});
