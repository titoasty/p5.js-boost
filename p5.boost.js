// assets/shaders/phong.vert
const phongVert = `precision highp float;
//precision highp int;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexCoord;

uniform vec3 uAmbientColor[5];

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat3 uNormalMatrix;
uniform int uAmbientLightCount;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;

void main() {
    vec4 viewModelPosition = uModelViewMatrix * vec4(aPosition, 1.0);

    // Pass varyings to fragment shader
    vViewPosition = viewModelPosition.xyz;
    gl_Position = uProjectionMatrix * viewModelPosition;  

    vNormal = uNormalMatrix * aNormal;
    vTexCoord = aTexCoord;

    // TODO: this should be a uniform
    vAmbientColor = vec3(0.0);

    for (int i = 0; i < 5; i++) {
        if (i < uAmbientLightCount) {
            vAmbientColor += uAmbientColor[i];
        }
    }
}
`

// assets/shaders/phong.frag
const phongFrag = `precision highp float;
//precision highp int;

uniform mat4 uViewMatrix;

uniform bool uUseLighting;

uniform int uAmbientLightCount;
uniform vec3 uAmbientColor[5];

uniform int uDirectionalLightCount;
uniform vec3 uLightingDirection[5];
uniform vec3 uDirectionalDiffuseColors[5];
uniform vec3 uDirectionalSpecularColors[5];

uniform int uPointLightCount;
uniform vec3 uPointLightLocation[5];
uniform vec3 uPointLightDiffuseColors[5];	
uniform vec3 uPointLightSpecularColors[5];

uniform int uSpotLightCount;
uniform float uSpotLightAngle[5];
uniform float uSpotLightConc[5];
uniform vec3 uSpotLightDiffuseColors[5];
uniform vec3 uSpotLightSpecularColors[5];
uniform vec3 uSpotLightLocation[5];
uniform vec3 uSpotLightDirection[5];

uniform bool uSpecular;
uniform float uShininess;

uniform float uConstantAttenuation;
uniform float uLinearAttenuation;
uniform float uQuadraticAttenuation;

const float specularFactor = 2.0;
const float diffuseFactor = 0.73;

struct LightResult {
    float specular;
    float diffuse;
};

float _phongSpecular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, float shininess) {
    vec3 R = reflect(lightDirection, surfaceNormal);
    return pow(max(0.0, dot(R, viewDirection)), shininess);
}

float _lambertDiffuse(vec3 lightDirection, vec3 surfaceNormal) {
    return max(0.0, dot(-lightDirection, surfaceNormal));
}

LightResult _light(vec3 viewDirection, vec3 normal, vec3 lightVector) {
    vec3 lightDir = normalize(lightVector);

    //compute our diffuse & specular terms
    LightResult lr;

    if (uSpecular) {
        lr.specular = _phongSpecular(lightDir, viewDirection, normal, uShininess);
    }

    lr.diffuse = _lambertDiffuse(lightDir, normal);

    return lr;
}

void totalLight(
  vec3 modelPosition,
  vec3 normal,
  out vec3 totalDiffuse,
  out vec3 totalSpecular
) {

  totalSpecular = vec3(0.0);

  if (!uUseLighting) {
    totalDiffuse = vec3(1.0);
    return;
  }

  totalDiffuse = vec3(0.0);

  vec3 viewDirection = normalize(-modelPosition);

  for (int j = 0; j < 5; j++) {
    if (j < uDirectionalLightCount) {
      vec3 lightVector = (uViewMatrix * vec4(uLightingDirection[j], 0.0)).xyz;
      vec3 lightColor = uDirectionalDiffuseColors[j];
      vec3 specularColor = uDirectionalSpecularColors[j];
      LightResult result = _light(viewDirection, normal, lightVector);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor * specularColor;
    }

    if (j < uPointLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uPointLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
    
      //calculate attenuation
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);
      vec3 lightColor = lightFalloff * uPointLightDiffuseColors[j];
      vec3 specularColor = lightFalloff * uPointLightSpecularColors[j];

      LightResult result = _light(viewDirection, normal, lightVector);
      totalDiffuse += result.diffuse * lightColor;
      totalSpecular += result.specular * lightColor * specularColor;
    }

    if(j < uSpotLightCount) {
      vec3 lightPosition = (uViewMatrix * vec4(uSpotLightLocation[j], 1.0)).xyz;
      vec3 lightVector = modelPosition - lightPosition;
    
      float lightDistance = length(lightVector);
      float lightFalloff = 1.0 / (uConstantAttenuation + lightDistance * uLinearAttenuation + (lightDistance * lightDistance) * uQuadraticAttenuation);

      vec3 lightDirection = (uViewMatrix * vec4(uSpotLightDirection[j], 0.0)).xyz;
      float spotDot = dot(normalize(lightVector), normalize(lightDirection));
      float spotFalloff;
      if(spotDot < uSpotLightAngle[j]) {
        spotFalloff = 0.0;
      }
      else {
        spotFalloff = pow(spotDot, uSpotLightConc[j]);
      }
      lightFalloff *= spotFalloff;

      vec3 lightColor = uSpotLightDiffuseColors[j];
      vec3 specularColor = uSpotLightSpecularColors[j];
     
      LightResult result = _light(viewDirection, normal, lightVector);
      
      totalDiffuse += result.diffuse * lightColor * lightFalloff;
      totalSpecular += result.specular * lightColor * specularColor * lightFalloff;
    }
  }

  totalDiffuse *= diffuseFactor;
  totalSpecular *= specularFactor;
}

uniform float uFogEnabled;
uniform vec3 uFogColor;
uniform float uFogStart;
uniform float uFogEnd;

float fog_linear(float dist, float start, float end) {
    return 1.0 - clamp((end - dist) / (end - start), 0.0, 1.0);
}

uniform vec4 uSpecularMatColor;
uniform vec4 uAmbientMatColor;
uniform vec4 uEmissiveMatColor;

uniform vec4 uMaterialColor;
uniform vec4 uTint;
uniform sampler2D uSampler;
uniform bool isTexture;

varying vec3 vNormal;
varying vec2 vTexCoord;
varying vec3 vViewPosition;
varying vec3 vAmbientColor;

void main(void) {
    vec3 diffuse;
    vec3 specular;
    totalLight(vViewPosition, normalize(vNormal), diffuse, specular);

    // Calculating final color as result of all lights (plus emissive term).
    gl_FragColor = isTexture ? texture2D(uSampler, vTexCoord) * (uTint / vec4(255, 255, 255, 255)) : uMaterialColor;
    gl_FragColor.rgb = diffuse * gl_FragColor.rgb + 
                    vAmbientColor * uAmbientMatColor.rgb + 
                    specular * uSpecularMatColor.rgb + 
                    uEmissiveMatColor.rgb;

    // fog
    if(uFogEnabled > 0.5) {
      float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
      float fogAmount = fog_linear(fogDistance, uFogStart, uFogEnd);
      gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, fogAmount);
    }
}
`

// easings.js

const _easing_c1 = 1.70158;
const _easing_c2 = _easing_c1 * 1.525;
const _easing_c3 = _easing_c1 + 1;
const _easing_c4 = (2 * Math.PI) / 3;
const _easing_c5 = (2 * Math.PI) / 4.5;

function linear(x) {
    return x;
}

function easeInQuad(x) {
    return x * x;
}
function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}
function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function easeInCubic(x) {
    return x * x * x;
}
function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}
function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInQuart(x) {
    return x * x * x * x;
}
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}
function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function easeInQuint(x) {
    return x * x * x * x * x;
}
function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}
function easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

function easeInSine(x) {
    return 1 - Math.cos((x * Math.PI) / 2);
}
function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}
function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

function easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
function easeInOutExpo(x) {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

function easeInCirc(x) {
    return 1 - sqrt(1 - Math.pow(x, 2));
}
function easeOutCirc(x) {
    return sqrt(1 - Math.pow(x - 1, 2));
}
function easeInOutCirc(x) {
    return x < 0.5 ? (1 - sqrt(1 - Math.pow(2 * x, 2))) / 2 : (sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

function easeInBack(x) {
    return _easing_c3 * x * x * x - _easing_c1 * x * x;
}
function easeOutBack(x) {
    return 1 + _easing_c3 * Math.pow(x - 1, 3) + _easing_c1 * Math.pow(x - 1, 2);
}
function easeInOutBack(x) {
    return x < 0.5 ? (Math.pow(2 * x, 2) * ((_easing_c2 + 1) * 2 * x - _easing_c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((_easing_c2 + 1) * (x * 2 - 2) + _easing_c2) + 2) / 2;
}

function easeInElastic(x) {
    return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * _easing_c4);
}
function easeOutElastic(x) {
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * _easing_c4) + 1;
}
function easeInOutElastic(x) {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * _easing_c5)) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * _easing_c5)) / 2 + 1;
}

function easeOutBounce(x) {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}
function easeInBounce(x) {
    return 1 - easeOutBounce(1 - x);
}
function easeInOutBounce(x) {
    return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2;
}


// mathutils.js

function randomDir(power = 0, baseDir) {
    if (!baseDir) {
        baseDir = createVector(0, -1, 0);
    }
    baseDir.normalize();

    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);

    return createVector(lerp(baseDir.x, x, power), lerp(baseDir.y, y, power), lerp(baseDir.z, z, power));
}


// particlesystem.js

class Particle {
    constructor(maxLife = 5) {
        this.maxLife = maxLife;
        this.life = maxLife;
    }

    update(delta) {
        this.life -= delta;
    }

    render() {
        if (this.shape) {
            this.shape.render();
        }
    }

    isDead() {
        return this.life <= 0;
    }

    get lifeRatio() {
        return 1 - Math.max(0, Math.min(1, this.life / this.maxLife));
    }
}

class ParticleSystem {
    constructor(delayMin, delayMax) {
        this.particles = [];
        this.delayMin = delayMin;
        this.delayMax = delayMax;
        this.time = 0;
        this.delayBeforeSpawn = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
    }

    addParticle() {
        const particle = this.onCreate();
        this.particles.push(particle);
    }

    update(delta) {
        let nbSpawned = 0;
        this.time += delta;
        while (this.time >= this.delayBeforeSpawn) {
            this.addParticle();

            this.time -= this.delayBeforeSpawn;
            this.delayBeforeSpawn = this.delayMin + Math.random() * (this.delayMax - this.delayMin);
            nbSpawned++;

            if (nbSpawned > 1000) {
                console.error('more than 1000 particles spawned, is there an infinite loop?');
                break;
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(delta);
            this.onUpdate(particle, delta);

            if (particle.isDead()) {
                this.particles.splice(i, 1);
            } else {
                particle.render();
            }
        }
    }

    onCreate() {
        return createParticle();
    }

    onUpdate(particle) {}

    render() {
        this.update(deltaTime / 1000);
    }
}

function createParticle(maxLife) {
    return new Particle(maxLife);
}

function createParticleSystem(delayMin, delayMax) {
    return new ParticleSystem(delayMin, delayMax);
}


// shaders.js

let phongShader;

function initShaders(renderer) {
    phongShader = createShader(phongVert, phongFrag);
    phongShader.isLightShader = function () {
        return true;
    };
    
    renderer._defaultLightShader = phongShader;
}

function fog(r, g, b, start, end) {
    phongShader.setUniform('uFogEnabled', 1.0);
    phongShader.setUniform('uFogColor', [r / 255, g / 255, b / 255]);
    phongShader.setUniform('uFogStart', start);
    phongShader.setUniform('uFogEnd', end);
}

function disableFog() {
    phongShader.setUniform('uFogEnabled', 0.0);
}


// shapes.js

// PRIMITIVE HELPERS

// base shape
class Shape3D {
    constructor() {
        this.position = createVector();
        this.rotation = createVector();
        this.scale = createVector(1, 1, 1);
        this.fill = color(255, 255, 255);
        this.stroke = null;
        this.ambientArgs = undefined;
        this.emissiveArgs = undefined;
        this.specularArgs = undefined;
        this.shininessValue = 0;
        this.strokeWeight = 1;
    }

    noFill() {
        this.fill = null;
    }

    noStroke() {
        this.stroke = null;
    }

    ambientMaterial() {
        this.ambientArgs = Array.from(arguments);
    }

    emissiveMaterial() {
        this.emissiveArgs = Array.from(arguments);
    }

    specularMaterial() {
        this.specularArgs = Array.from(arguments);
    }

    shininess(value) {
        this.shininessValue = value;
    }

    render() {
        push();

        if (this.fill) {
            fill(this.fill);
        } else {
            noFill();
        }

        if (this.stroke) {
            stroke(this.stroke);
            strokeWeight(this.strokeWeight);
        } else {
            noStroke();
        }

        // material
        if (this.ambientArgs) ambientMaterial.apply(ambientMaterial, this.ambientArgs);
        if (this.emissiveArgs) emissiveMaterial.apply(emissiveMaterial, this.emissiveArgs);
        if (this.specularArgs) specularMaterial.apply(specularMaterial, this.specularArgs);
        shininess(this.shininessValue);

        translate(this.position.x, this.position.y, this.position.z);

        rotateZ(this.rotation.z);
        rotateX(this.rotation.x);
        rotateZ(this.rotation.y);

        scale(this.scale.x, this.scale.y, this.scale.z);

        this.renderShape();

        pop();
    }

    renderShape() {}
}

function createShape() {
    return new Shape3D();
}

// sphere
class Sphere extends Shape3D {
    constructor(radius = 100, detailX = 12, detailY = 12) {
        super();
        this.radius = radius;
        this.detailX = detailX;
        this.detailY = detailY;
    }

    renderShape() {
        sphere(this.radius, this.detailX, this.detailY);
    }
}

function createSphere(radius, detailX, detailY) {
    return new Sphere(radius, detailX, detailY);
}

// box
class Box extends Shape3D {
    constructor(sizeX = 100, sizeY = undefined, sizeZ = undefined) {
        super();
        if (!sizeY) sizeY = sizeX;
        if (!sizeZ) sizeZ = sizeX;
        this.size = createVector(sizeX, sizeY, sizeZ);
    }

    renderShape() {
        box(this.size.x, this.size.y, this.size.z);
    }
}

function createBox(sizeX = 100, sizeY = undefined, sizeZ = undefined) {
    return new Box(sizeX, sizeY, sizeZ);
}

// plane
class Plane extends Shape3D {
    constructor(width = 100, height = 100, detailX = 1, detailY = 1) {
        super();
        this.width = width;
        this.height = height;
        this.detailX = detailX;
        this.detailY = detailY;
    }

    renderShape() {
        plane(this.width, this.height, this.detailX, this.detailY);
    }
}

function createPlane(width = 100, height = 100, detailX = 1, detailY = 1) {
    return new Plane(width, height, detailX, detailY);
}

// cylinder
class Cylinder extends Shape3D {
    constructor(radius = 100, height = 100, detailX = 24, detailY = 1, bottomCap = true, topCap = true) {
        super();
        this.radius = radius;
        this.height = height;
        this.detailX = detailX;
        this.detailY = detailY;
        this.bottomCap = bottomCap;
        this.topCap = topCap;
    }

    renderShape() {
        cylinder(this.radius, this.height, this.detailX, this.detailY, this.bottomCap, this.topCap);
    }
}

function createCylinder(radius = 100, height = 100, detailX = 24, detailY = 1, bottomCap = true, topCap = true) {
    return new Cylinder(radius, height, detailX, detailY, bottomCap, topCap);
}


// init.js

function setupBoost(renderer) {
    initShaders(renderer);

    // backface culling
    renderer.drawingContext.enable(renderer.drawingContext.CULL_FACE);
    renderer.drawingContext.cullFace(renderer.drawingContext.FRONT);

    angleMode(DEGREES);

    return renderer;
}


