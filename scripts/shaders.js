// Vertex shader
var VSHADER = 
'   attribute vec4 a_Position;\n' +
'   attribute vec4 a_Normal;\n' +

'   uniform vec3 u_Kd;\n' +
'   uniform mat4 u_mvpMatrix;\n' +
'   uniform mat4 u_NormalMatrix;\n' +
'   uniform mat4 u_ModelMatrix;\n' +

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

'   uniform vec3 u_Ke;\n' +
'   uniform vec3 u_Ka;\n' +
'   uniform vec3 u_Ks;\n' +
'   uniform vec4 u_eyePosWorld;\n' +

'   varying vec3 v_Normal;\n' +
'   varying vec4 v_Position;\n' +
'   varying vec3 v_Kd;\n' +

'   void main() {\n' +
'       vec3 normal = normalize(v_Normal);\n' +
'       vec3 lightDirection = normalize(u_Lamp0Pos.xyz - v_Position.xyz);\n' +
'       float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
'       vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz);\n' +
'       vec3 H = normalize(lightDirection + eyeDirection);\n' +
'       float nDotH = max(dot(H, normal), 0.0);\n' +
'       float e02 = nDotH*nDotH;\n' +
'       float e04 = e02*e02;\n' +
'       float e08 = e04*e04;\n' +
'       float e16 = e08*e08;\n' +
'       float e32 = e16*e16;\n' +
'       float e64 = e32*e32;\n' +
'       vec3 emissive = u_Ke;\n' +
'       vec3 ambient = u_Lamp0Amb * u_Ka;\n' +
'       vec3 diffuse = u_Lamp0Diff * v_Kd * nDotL;\n' +
'       vec3 speculr = u_Lamp0Spec * u_Ks * e64;\n' +
'       gl_FragColor = vec4(emissive + ambient + diffuse + speculr , 1.0);\n' +
'   }\n';
