var floatsPerVertex = 6;

function makeGroundGrid() {
    var xcount = 100;
    var ycount = 100;
    var xymax = 50.0;
    var xColr = new Float32Array([1.0, 1.0, 0.3]);
    var yColr = new Float32Array([0.5, 1.0, 0.5]);

    var gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));

    var xgap = xymax / (xcount-1);
    var ygap = xymax / (ycount-1);

    for(v = 0, j = 0; v < 2*xcount; v++, j+= floatsPerVertex) {
        if(v % 2 == 0) {
            gndVerts[j  ] = -xymax + (v  )*xgap;
            gndVerts[j+1] = -xymax;
            gndVerts[j+2] = 0.0;
        } else {
            gndVerts[j  ] = -xymax + (v-1)*xgap;
            gndVerts[j+1] = xymax;
            gndVerts[j+2] = 0.0;
        }

        gndVerts[j+3] = xColr[0];
        gndVerts[j+4] = xColr[1];
        gndVerts[j+5] = xColr[2];
        }

    for(v = 0; v < 2*ycount; v++, j+= floatsPerVertex) {
        if(v % 2 == 0) {
            gndVerts[j  ] = -xymax;
            gndVerts[j+1] = -xymax + (v  )*ygap;
            gndVerts[j+2] = 0.0;
        } else {
            gndVerts[j  ] = xymax;
            gndVerts[j+1] = -xymax + (v-1)*ygap;
            gndVerts[j+2] = 0.0;
        }

        gndVerts[j+3] = yColr[0];
        gndVerts[j+4] = yColr[1];
        gndVerts[j+5] = yColr[2];
    }

    return gndVerts;
}

