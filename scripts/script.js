var g_EyeX = 0.20, g_EyeY = 0.25, g_EyeZ = 4.25;
var g_AtX = 0, g_AtY = 0, g_AtZ = 0;
var g_UpX = 0, g_UpY = 1, g_UpZ = 0;
var canvas, rendering;
var gndVerts, armPart, sphereVerts;

var headlight = true;
var lamp = true;

function initArrayBuffer(gl, attribute, data, type, num) {
    var buffer = gl.createBuffer();
    if (!buffer) {
        throw new Error('Failed to create buffer object.');
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    var a_attribute = gl.getAttribLocation(gl.program, attribute);
    if (a_attribute < 0) {
        throw new Error("Failed to get storage location of " + attribute);
    }

    gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
    gl.enableVertexAttribArray(a_attribute);

    return true;
}

function initVertexBuffers(rendering) {
    sphereVerts = makeSphere();
    gndVerts = makeGroundGrid();

    positions = sphereVerts.position;
    indices = sphereVerts.index;

    if(!initArrayBuffer(rendering, 
            'a_Position', 
            new Float32Array(positions), 
            rendering.FLOAT, 3)) {
        return -1;
    }

    if(!initArrayBuffer(rendering, 
            'a_Normal', 
            new Float32Array(positions), 
            rendering.FLOAT, 3)) {
        return -1;
    }

    rendering.bindBuffer(rendering.ARRAY_BUFFER, null);
    
    var indexBuffer = rendering.createBuffer();
    if (!indexBuffer) {
        throw new Error("Failed to create buffer object.");
    }

    rendering.bindBuffer(rendering.ELEMENT_ARRAY_BUFFER, indexBuffer);
    rendering.bufferData(rendering.ELEMENT_ARRAY_BUFFER, 
            new Uint16Array(indices),
            rendering.STATIC_DRAW);
    
    return indices.length;
}

/* Start of jointed arm drawing functions */
function base() {
    var BASE_WIDTH = 5.0;
    var BASE_HEIGHT = 2.0;
    viewMatrix.scale(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    viewMatrix.translate(0.4, 0.5 * BASE_HEIGHT, -0.6);

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
    if (headlight) {
        console.log(headlight);
        rendering.uniform4f(u_Lamp0Pos, 0.0, 0.2, 1.0, 1.0);
        rendering.uniform3f(u_Lamp0Amb,  0.4, 0.4, 0.4);
        rendering.uniform3f(u_Lamp0Diff, 1.0, 1.0, 1.0);
        rendering.uniform3f(u_Lamp0Spec, 1.0, 1.0, 1.0);
    } else {
        rendering.uniform4f(u_Lamp0Pos, 0.0, 0.0, 0.0, 1.0);
    }

    var pearl = new Material(MATL_PEARL);
    rendering.uniform3f(u_Ke, pearl.K_emit[0], pearl.K_emit[1], pearl.K_emit[2]);
    rendering.uniform3f(u_Ka, pearl.K_ambi[0], pearl.K_ambi[1], pearl.K_ambi[2]);
    rendering.uniform3f(u_Kd, pearl.K_diff[0], pearl.K_diff[1], pearl.K_diff[2]);
    rendering.uniform3f(u_Ks, pearl.K_spec[0], pearl.K_spec[1], pearl.K_spec[2]);
    rendering.drawElements(rendering.TRIANGLES,
            n,
            rendering.UNSIGNED_SHORT,
            0);

    viewMatrix.translate(3.0, 0.0, 0.0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    var jade = new Material(MATL_JADE);
    rendering.uniform3f(u_Ke, jade.K_emit[0], jade.K_emit[1], jade.K_emit[2]);
    rendering.uniform3f(u_Ka, jade.K_ambi[0], jade.K_ambi[1], jade.K_ambi[2]);
    rendering.uniform3f(u_Kd, jade.K_diff[0], jade.K_diff[1], jade.K_diff[2]);
    rendering.uniform3f(u_Ks, jade.K_spec[0], jade.K_spec[1], jade.K_spec[2]);
    rendering.drawElements(rendering.TRIANGLES,
            n,
            rendering.UNSIGNED_SHORT,
            0);

    viewMatrix.translate(6.0, 0.0, 0.0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    var gold = new Material(MATL_GOLD_SHINY);
    rendering.uniform3f(u_Ke, gold.K_emit[0], gold.K_emit[1], gold.K_emit[2]);
    rendering.uniform3f(u_Ka, gold.K_ambi[0], gold.K_ambi[1], gold.K_ambi[2]);
    rendering.uniform3f(u_Kd, gold.K_diff[0], gold.K_diff[1], gold.K_diff[2]);
    rendering.uniform3f(u_Ks, gold.K_spec[0], gold.K_spec[1], gold.K_spec[2]);
    rendering.drawElements(rendering.TRIANGLES,
            n,
            rendering.UNSIGNED_SHORT,
            0);

    viewMatrix.translate(-3.0, 0.0, 0.0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    var brass = new Material(MATL_BRASS);
    rendering.uniform3f(u_Ke, brass.K_emit[0], brass.K_emit[1], brass.K_emit[2]);
    rendering.uniform3f(u_Ka, brass.K_ambi[0], brass.K_ambi[1], brass.K_ambi[2]);
    rendering.uniform3f(u_Kd, brass.K_diff[0], brass.K_diff[1], brass.K_diff[2]);
    rendering.uniform3f(u_Ks, brass.K_spec[0], brass.K_spec[1], brass.K_spec[2]);
    rendering.drawElements(rendering.TRIANGLES,
            n,
            rendering.UNSIGNED_SHORT,
            0);

    viewMatrix.translate(-6.0, 0.0, 0.0);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    rendering.uniform3f(u_Ke, 0.0, 0.0, 0.0);
    rendering.uniform3f(u_Ka, 0.6, 0.0, 0.0);
    rendering.uniform3f(u_Kd, 0.8, 0.0, 0.0);
    rendering.uniform3f(u_Ks, 0.8, 0.8, 0.8);
    rendering.drawElements(rendering.TRIANGLES,
            n,
            rendering.UNSIGNED_SHORT,
            0);
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

$("#headlight-status").click(function() {
    headlight = !headlight; 
    $(this).text(headlight ? "Turn Headlight Off" : "Turn Headlight On"); 
    draw(rendering);
});

$("#lamp-status").click(function() {
    lamp = !lamp;
    $(this).text(lamp ? "Turn Lamp Off" : "Turn Lamp On"); 
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

    n = initVertexBuffers(rendering);
    if (n < 0) {
        throw new Error("Failed to specify vertex information.");
        return;
    }

    rendering.clearColor(0.0, 0.0, 0.0, 1.0);
    
    // Get the uniform variables associated with the scene
    u_eyePosWorld = rendering.getUniformLocation(rendering.program,
            "u_eyePosWorld");
    u_ModelMatrix = rendering.getUniformLocation(rendering.program,
            "u_ModelMatrix");
    u_mvpMatrix = rendering.getUniformLocation(rendering.program, 
            "u_mvpMatrix");
    u_NormalMatrix = rendering.getUniformLocation(rendering.program, 
            "u_NormalMatrix");
    if (!u_mvpMatrix || !u_NormalMatrix || !u_ModelMatrix) {
        throw new Error("Failed to get mvp_matrix or normal_matrix.");
        return;
    }

    // Get the uniform variables associated with the light source
    u_Lamp0Pos = rendering.getUniformLocation(rendering.program,
            "u_Lamp0Pos");
    u_Lamp0Amb = rendering.getUniformLocation(rendering.program,
            "u_Lamp0Amb");
    u_Lamp0Diff = rendering.getUniformLocation(rendering.program,
            "u_Lamp0Diff");
    u_Lamp0Spec = rendering.getUniformLocation(rendering.program,
            "u_Lamp0Spec");
    if (!u_Lamp0Pos || !u_Lamp0Amb || !u_Lamp0Diff || !u_Lamp0Spec) {
        throw new Error("Failed to get Lamp0 storage locations.");
    }

    // Get the material reflectance variables
    u_Ke = rendering.getUniformLocation(rendering.program, "u_Ke");
    u_Ka = rendering.getUniformLocation(rendering.program, "u_Ka");
    u_Kd = rendering.getUniformLocation(rendering.program, "u_Kd");
    u_Ks = rendering.getUniformLocation(rendering.program, "u_Ks");
    if (!u_Ke || !u_Ka || !u_Kd || !u_Ks) {
        throw new Error("Failed to get reflections storage locations");
    }

    viewMatrix = new Matrix4();
    modelMatrix = new Matrix4();
    projMatrix = new Matrix4();
    mvpMatrix = new Matrix4();
    normalMatrix = new Matrix4();

    /* Calculate the model matrix. */
    modelMatrix.setRotate(90, 0, 1, 0);

    /* Configure the perspective and set the MVP matrix */
    projMatrix.setPerspective(40, canvas.width / canvas.height, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    /* Calculate the inverse and tranpose of the model matrix */
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();

    /* Calculate the MVP matrix. */
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);

    /* Pass back the set variables to the shaders */
    rendering.uniform4f(u_eyePosWorld, g_EyeX, g_EyeY, g_EyeZ, 1);
    rendering.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    rendering.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    rendering.uniformMatrix4fv(u_NormalMatrix,false, normalMatrix.elements);

    draw(rendering);
});
