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
