var floatsPerVertex = 6;

function makeGroundGrid() {
    var xcount = 100;
    var ycount = 100;
    var xymax = 50.0;

    var gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));

    var xgap = xymax / (xcount-1);
    var ygap = xymax / (ycount-1);

    for (v = 0, j = 0; v < 2*xcount; v++, j+= floatsPerVertex) {
        if(v % 2 == 0) {
            gndVerts[j  ] = -xymax + (v  )*xgap;
            gndVerts[j+1] = -xymax;
            gndVerts[j+2] = 0.0;
        } else {
            gndVerts[j  ] = -xymax + (v-1)*xgap;
            gndVerts[j+1] = xymax;
            gndVerts[j+2] = 0.0;
        }
    }

    for (v = 0; v < 2*ycount; v++, j+= floatsPerVertex) {
        if(v % 2 == 0) {
            gndVerts[j  ] = -xymax;
            gndVerts[j+1] = -xymax + (v  )*ygap;
            gndVerts[j+2] = 0.0;
        } else {
            gndVerts[j  ] = xymax;
            gndVerts[j+1] = -xymax + (v-1)*ygap;
            gndVerts[j+2] = 0.0;
        }
    }

    return gndVerts;
}

function makeArmPart() {
    return new Float32Array([
        0.5, 1.0, 0.5, -0.5, 1.0, 0.5,
        -0.5, 0.0, 0.5,  0.5, 0.0, 0.5,
        0.5, 1.0, 0.5,  0.5, 0.0, 0.5,
        0.5, 0.0,-0.5,  0.5, 1.0,-0.5,
        0.5, 1.0, 0.5,  0.5, 1.0,-0.5,
        -0.5, 1.0,-0.5, -0.5, 1.0, 0.5,
        -0.5, 1.0, 0.5, -0.5, 1.0,-0.5,
        -0.5, 0.0,-0.5, -0.5, 0.0, 0.5,
        -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,
        0.5, 0.0, 0.5, -0.5, 0.0, 0.5,
        0.5, 0.0,-0.5, -0.5, 0.0,-0.5,
        -0.5, 1.0,-0.5,  0.5, 1.0,-0.5
    ]);
}

function makeSphere() {
    var SPHERE_DIV = 50;

    var i, ai, si, ci;
    var j, aj, sj, cj;
    var p1, p2;

    var positions = [];
    var indices = [];

    for (j = 0; j <= SPHERE_DIV; j++) {
        aj = j * Math.PI / SPHERE_DIV;
        sj = Math.sin(aj);
        cj = Math.cos(aj);
        for (i = 0; i <= SPHERE_DIV; i++) {
            ai = i * 2 * Math.PI / SPHERE_DIV;
            si = Math.sin(ai);
            ci = Math.cos(ai);

            positions.push(si * sj);
            positions.push(cj);
            positions.push(ci * sj);
        }
    }

    for (j = 0; j < SPHERE_DIV; j++) {
        for (i = 0; i < SPHERE_DIV; i++) {
            p1 = j * (SPHERE_DIV + 1) + i;
            p2 = p1 + (SPHERE_DIV + 1);

            indices.push(p1);
            indices.push(p2);
            indices.push(p1 + 1);

            indices.push(p1 + 1);
            indices.push(p2);
            indices.push(p2 + 1);
        }
    }
    return {
        position: positions,
        index: indices
    };
}
