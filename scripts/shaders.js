// Vertex shader
var VSHADER = 
'   attribute vec4 a_Position;\n' +
'   attribute vec4 a_Normal;\n' +

'   uniform vec3 u_Kd;\n' +
'   uniform mat4 u_mvpMatrix;\n' +
'   uniform mat4 u_ModelMatrix;\n' +
'   uniform mat4 u_NormalMatrix;\n' +

'   varying vec3 v_Kd;\n' +
'   varying vec4 v_Position;\n' +
'   varying vec3 v_Normal;\n' +

'   void main() {\n' +
'       gl_Position = u_mvpMatrix * a_Position;\n' +
'       v_Position = u_ModelMatrix * a_Position;\n' +
'       v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
'       v_Kd = u_Kd;\n' +
'   }\n';

// Fragment shader
var FSHADER = 
'   #ifdef GL_ES\n' +
'   precision mediump float;\n' +
'   #endif\n' +

'   uniform vec4 u_Lamp0Pos;\n' +
'   uniform vec3 u_Lamp0Amb;\n' +
'   uniform vec3 u_Lamp0Diff;\n' +
'   uniform vec3 u_Lamp0Spec;\n' +

'   uniform vec4 u_Lamp1Pos;\n' +
'   uniform vec3 u_Lamp1Amb;\n' +
'   uniform vec3 u_Lamp1Diff;\n' +
'   uniform vec3 u_Lamp1Spec;\n' +

'   uniform vec3 u_Ke;\n' +
'   uniform vec3 u_Ka;\n' +
'   uniform vec3 u_Ks;\n' +
'   uniform vec4 u_eyePosWorld;\n' +

'   varying vec3 v_Normal;\n' +
'   varying vec4 v_Position;\n' +
'   varying vec3 v_Kd;\n' +

'   void main() {\n' +
'       vec3 normal = normalize(v_Normal);\n' +
'       vec3 lightDirection0 = normalize(u_Lamp0Pos.xyz - v_Position.xyz);\n' +
'       vec3 lightDirection1 = normalize(u_Lamp1Pos.xyz - v_Position.xyz);\n' +

'       float nDotL0 = max(dot(lightDirection0, normal), 0.0);\n' +
'       float nDotL1 = max(dot(lightDirection1, normal), 0.0);\n' +

'       vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz);\n' +

'       vec3 H0 = normalize(lightDirection0 + eyeDirection);\n' +
'       vec3 H1 = normalize(lightDirection1 + eyeDirection);\n' +

'       float nDotH0 = max(dot(H0, normal), 0.0);\n' +
'       float nDotH1 = max(dot(H1, normal), 0.0);\n' +

'       float e020 = nDotH0 * nDotH0;\n' +
'       float e040 = e020 * e020;\n' +
'       float e080 = e040 * e040;\n' +
'       float e160 = e080 * e080;\n' +
'       float e320 = e160 * e160;\n' +
'       float e640 = e320 * e320;\n' +

'       float e021 = nDotH1 * nDotH1;\n' +
'       float e041 = e021 * e021;\n' +
'       float e081 = e041 * e041;\n' +
'       float e161 = e081 * e081;\n' +
'       float e321 = e161 * e161;\n' +
'       float e641 = e321 * e321;\n' +

'       vec3 emissive0 = u_Ke;\n' +
'       vec3 ambient0 = u_Lamp0Amb * u_Ka;\n' +
'       vec3 diffuse0 = u_Lamp0Diff * v_Kd * nDotL0;\n' +
'       vec3 speculr0 = u_Lamp0Spec * u_Ks * e640;\n' +

'       vec3 emissive1 = u_Ke;\n' +
'       vec3 ambient1 = u_Lamp1Amb * u_Ka;\n' +
'       vec3 diffuse1 = u_Lamp1Diff * v_Kd * nDotL1;\n' +
'       vec3 speculr1 = u_Lamp1Spec * u_Ks * e641;\n' +

'       gl_FragColor = vec4(emissive0 + emissive1 + ambient0 + ambient1 + diffuse0 + diffuse1 + speculr0 + speculr1 , 1.0);\n' +
'   }\n';
