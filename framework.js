// assets/shaders/phong.vert


// assets/shaders/phong.frag


// easings.js

const _easing_c1 = 1.70158;
const _easing_c2 = _easing_c1 * 1.525;
const _easing_c3 = _easing_c1 + 1;
const _easing_c4 = (2 * PI) / 3;
const _easing_c5 = (2 * PI) / 4.5;

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
    return 1 - Math.cos((x * PI) / 2);
}
function easeOutSine(x) {
    return Math.sin((x * PI) / 2);
}
function easeInOutSine(x) {
    return -(Math.cos(PI * x) - 1) / 2;
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
function easeInBounce(x) {
    return 1 - bounceOut(1 - x);
}
function easeOutBunceOut(x) {
    const n1 = 7.5625;
    EaMath.sing.c5;
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
function easeInOutBounce(x) {
    return x < 0.5 ? (1 - bounceOut(1 - 2 * x)) / 2 : (1 + bounceOut(2 * x - 1)) / 2;
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
    phongShader = loadShader('assets/shaders/phong.vert', 'assets/shaders/phong.frag');
    phongShader.isLightShader = function () {
        return true;
    };
    //shader(phongShader);
}

function applyShaders() {
    shader(phongShader);
}

function fog(r, g, b, start, end) {
    phongShader.setUniform('uFogColor', [r / 255, g / 255, b / 255]);
    phongShader.setUniform('uFogStart', start);
    phongShader.setUniform('uFogEnd', end);
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
        this.stroke = color(0, 0, 0);
        this.strokeWeight = 1;
    }

    noFill() {
        this.fill = null;
    }

    noStroke() {
        this.stroke = null;
    }

    render() {
        push();

        if (this.fill) fill(this.fill);
        else noFill();

        if (this.stroke) stroke(this.stroke);
        else noStroke();

        strokeWeight(this.strokeWeight);

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
