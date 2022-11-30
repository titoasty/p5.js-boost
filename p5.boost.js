// assets/shaders/phongFog.vert
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

// assets/shaders/phongFog.frag
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
    float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
    float fogAmount = fog_linear(fogDistance, uFogStart, uFogEnd);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, fogAmount*uFogEnabled);
}
`

// thirdparty/p5.Framebuffer.js

const _createFramebuffer = function (options) {
    const fb = new Framebuffer(this, options);

    // Extend the old resize handler to also update the size of the framebuffer
    const oldResize = this._renderer.resize;
    this._renderer.resize = (w, h) => {
        oldResize.call(this._renderer, w, h);
        fb.handleResize();
    };

    return fb;
};
p5.prototype.createFramebuffer = _createFramebuffer;
p5.Graphics.prototype.createFramebuffer = _createFramebuffer;

const parentGetTexture = p5.RendererGL.prototype.getTexture;
p5.RendererGL.prototype.getTexture = function (imgOrTexture) {
    if (imgOrTexture instanceof p5.Texture) {
        return imgOrTexture;
    } else {
        return parentGetTexture.call(this, imgOrTexture);
    }
};

// P5 manages its own WebGL textures normally, so that users don't
// have to worry about manually updating texture data on the GPU.
//
// However, if we're trying to use a framebuffer texture that we've
// drawn to via WebGL, we don't want to ever send data to it, since
// it gets content when we draw to it! So we need to make something
// that looks like a p5 texture but that never tries to update
// data in order to use framebuffer textures inside p5.
class RawTextureWrapper extends p5.Texture {
    constructor(renderer, obj, w, h) {
        super(renderer, obj);
        this.width = w;
        this.height = h;
        return this;
    }

    _getTextureDataFromSource() {
        return this.src;
    }

    init(tex) {
        const gl = this._renderer.GL;
        this.glTex = tex;

        this.glWrapS = this._renderer.textureWrapX;
        this.glWrapT = this._renderer.textureWrapY;

        this.setWrapMode(this.glWrapS, this.glWrapT);
        this.setInterpolation(this.glMinFilter, this.glMagFilter);
    }

    update() {
        return false;
    }
}

class Framebuffer {
    constructor(canvas, options = {}) {
        this._renderer = canvas._renderer;
        const gl = this._renderer.GL;
        if (!gl.getExtension('WEBGL_depth_texture')) {
            throw new Error('Unable to create depth textures in this environment');
        }

        this.colorFormat = this.glColorFormat(options.colorFormat);
        this.depthFormat = this.glDepthFormat(options.depthFormat);
        if ((options.colorFormat === 'float' || options.depthFormat === 'float') && (!gl.getExtension('OES_texture_float') || !gl.getExtension('OES_texture_float_linear') || !gl.getExtension('WEBGL_color_buffer_float'))) {
            // Reset to default
            if (options.colorFormat === 'float') {
                this.colorFormat = this.glColorFormat();
            }
            if (options.depthFormat === 'float') {
                this.depthFormat = this.glDepthFormat();
            }
            console.warn('Warning: Unable to create floating point textures in this environment. Falling back to integers');
        }

        const framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            throw new Error('Unable to create a framebuffer');
        }
        this.framebuffer = framebuffer;
        this.recreateTextures();
    }

    glColorFormat(format) {
        const gl = this._renderer.GL;
        if (format === 'float') {
            return gl.FLOAT;
        }
        return gl.UNSIGNED_BYTE;
    }
    glDepthFormat(format) {
        const gl = this._renderer.GL;
        if (format === 'float') {
            return gl.FLOAT;
        }
        return gl.UNSIGNED_SHORT;
    }

    handleResize() {
        const oldColor = this.colorTexture;
        const oldDepth = this.depthTexture;

        this.recreateTextures();

        this.deleteTexture(oldColor);
        this.deleteTexture(oldDepth);
    }

    recreateTextures() {
        const gl = this._renderer.GL;

        const width = this._renderer.width;
        const height = this._renderer.height;
        const density = this._renderer._pInst._pixelDensity;
        const hasAlpha = this._renderer._pInst._glAttributes.alpha;

        const prevBoundTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
        const prevBoundFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);

        const colorTexture = gl.createTexture();
        if (!colorTexture) {
            throw new Error('Unable to create color texture');
        }
        gl.bindTexture(gl.TEXTURE_2D, colorTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, hasAlpha ? gl.RGBA : gl.RGB, width * density, height * density, 0, hasAlpha ? gl.RGBA : gl.RGB, this.colorFormat, null);

        // Create the depth texture
        const depthTexture = gl.createTexture();
        if (!depthTexture) {
            throw new Error('Unable to create depth texture');
        }
        gl.bindTexture(gl.TEXTURE_2D, depthTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, width * density, height * density, 0, gl.DEPTH_COMPONENT, this.depthFormat, null);

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, colorTexture, 0);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);

        const depthP5Texture = new RawTextureWrapper(this._renderer, depthTexture, width * density, height * density);
        this._renderer.textures.push(depthP5Texture);

        const colorP5Texture = new RawTextureWrapper(this._renderer, colorTexture, width * density, height * density);
        this._renderer.textures.push(colorP5Texture);

        gl.bindTexture(gl.TEXTURE_2D, prevBoundTexture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, prevBoundFramebuffer);

        this.depthTexture = depthTexture;
        this.depth = depthP5Texture;
        this.colorTexture = colorTexture;
        this.color = colorP5Texture;
    }

    deleteTexture(texture) {
        const gl = this._renderer.GL;
        gl.deleteTexture(texture);

        const p5TextureIdx = this._renderer.textures.findIndex((t) => t.src === texture);
        if (p5TextureIdx !== -1) {
            this._renderer.textures.splice(p5TextureIdx, 1);
        }
    }

    draw(cb) {
        const gl = this._renderer.GL;
        const prevFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        cb();
        gl.bindFramebuffer(gl.FRAMEBUFFER, prevFramebuffer);
    }

    remove() {
        const gl = this._renderer.GL;
        this.deleteTexture(this.colorTexture);
        this.deleteTexture(this.depthTexture);
        gl.deleteFramebuffer(this.framebuffer);
    }
}


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


// fog.js

function setupFog(renderer) {
    // create phong shader with fog
    const phongFogShader = createShader(phongVert, phongFrag);
    phongFogShader.isLightShader = () => true;

    // force it as default light shader
    renderer._defaultLightShader = phongFogShader;

    // after update, remove fog
    const oldUpdate = renderer._update;
    renderer._update = function () {
        oldUpdate.apply(renderer, Array.from(arguments));

        // disable fog after rendering
        renderer._boost.fogEnabled = false;
    };

    // udpate fog uniforms
    function setUniforms() {
        phongFogShader.setUniform('uFogEnabled', renderer._boost.fogEnabled ? 1 : 0);
        phongFogShader.setUniform('uFogColor', renderer._boost.fogColor || [0, 0, 0]);
        phongFogShader.setUniform('uFogStart', renderer._boost.fogStart || 0);
        phongFogShader.setUniform('uFogEnd', renderer._boost.fogEnd || 0);
    }

    // override _setFillUniforms to add fog uniforms
    const oldSetFillUniforms = renderer._setFillUniforms;
    renderer._setFillUniforms = function () {
        oldSetFillUniforms.apply(renderer, Array.from(arguments));
        setUniforms();
    };

    // override _setStrokeUniforms to add fog uniforms
    const oldSetStrokeUniforms = renderer._setStrokeUniforms;
    renderer._setStrokeUniforms = function () {
        oldSetStrokeUniforms.apply(renderer, Array.from(arguments));
        setUniforms();
    };
}

function _fog(r = 200, g = 200, b = 200, start = 100, end = 200) {
    this._renderer._boost.fogEnabled = true;
    this._renderer._boost.fogColor = [r / 255, g / 255, b / 255];
    this._renderer._boost.fogStart = start;
    this._renderer._boost.fogEnd = end;
}

p5.prototype.fog = _fog;
p5.RendererGL.prototype.fog = _fog;


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


// setup.js

p5.prototype.setupBoost = function () {
    const renderer = this._renderer;

    // store all data here
    renderer._boost = {};

    // fog
    setupFog(renderer);

    // backface culling
    renderer.drawingContext.enable(renderer.drawingContext.CULL_FACE);
    renderer.drawingContext.cullFace(renderer.drawingContext.FRONT);

    angleMode(DEGREES);
};


