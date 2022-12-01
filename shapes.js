/**
 * Shapes
 * @namespace shapes
 */

// PRIMITIVE HELPERS

class Object3D {
    constructor() {
        this.children = [];
        this.position = createVector();
        this.rotation = createVector();
        this.scale = createVector(1, 1, 1);
    }

    draw() {
        push();

        translate(this.position.x, this.position.y, this.position.z);

        rotateZ(this.rotation.z);
        rotateX(this.rotation.x);
        rotateY(this.rotation.y);

        scale(this.scale.x, this.scale.y, this.scale.z);

        this.drawShape();

        for (const child of this.children) {
            child.render();
        }

        pop();
    }

    drawShape() {}
}

// base shape
class Shape3D extends Object3D {
    constructor() {
        super();

        this.fill = color(255, 255, 255);
        this.stroke = null;
        this.ambientArgs = undefined;
        this.emissiveArgs = undefined;
        this.specularArgs = undefined;
        this.shininessArgs = undefined;
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

    shininess() {
        this.shininessArgs = Array.from(arguments);
    }

    draw() {
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
        if (this.ambientArgs) ambientMaterial(...this.ambientArgs);
        if (this.emissiveArgs) emissiveMaterial(...this.emissiveArgs);
        if (this.specularArgs) specularMaterial(...this.specularArgs);
        if (this.shininessArgs) shininess(...this.shininessArgs);

        super.draw();

        pop();
    }

    drawShape() {}
}

function _createShape(drawFn, fields) {
    const shape = new Shape3D();
    shape.drawShape = drawFn.bind(shape);

    // copy fields
    for (const key in fields) {
        shape[key] = fields[key];
    }

    return shape;
}

p5.prototype.createShape = _createShape;

/**
 * Create a sphere
 * @memberof shapes
 * @function createSphere
 * @param {number} radius - radius of the sphere
 * @param {number} detailX - number of subdivisions in the x-dimension
 * @param {number} detailY - number of subdivisions in the y-dimension
 */
p5.prototype.createSphere = function (radius = 100, detailX = 12, detailY = 12) {
    return this.createShape(
        function () {
            sphere(this.radius, this.detailX, this.detailY);
        },
        {
            radius,
            detailX,
            detailY,
        }
    );
};

// box
p5.prototype.createBox = function (sizeX = 100, sizeY = undefined, sizeZ = undefined) {
    return this.createShape(
        function () {
            box(this.size.x, this.size.y, this.size.z);
        },
        {
            size: createVector(sizeX, sizeY || sizeX, sizeZ || sizeX),
        }
    );
};

// plane
p5.prototype.createPlane = function (width = 100, height = 100, detailX = 1, detailY = 1) {
    return this.createShape(
        function () {
            plane(this.width, this.height, this.detailX, this.detailY);
        },
        {
            width,
            height,
            detailX,
            detailY,
        }
    );
};

// cylinder
p5.prototype.createCylinder = function (radius = 100, height = 100, detailX = 24, detailY = 1, bottomCap = true, topCap = true) {
    return this.createShape(
        function () {
            cylinder(this.radius, this.height, this.detailX, this.detailY, this.bottomCap, this.topCap);
        },
        {
            radius,
            height,
            detailX,
            detailY,
            bottomCap,
            topCap,
        }
    );
};

// cone
p5.prototype.createCone = function (radius = 100, height = 100, detailX = 24, detailY = 1, cap = true) {
    return this.createShape(
        function () {
            cone(this.radius, this.height, this.detailX, this.detailY, this.cap);
        },
        {
            radius,
            height,
            detailX,
            detailY,
            cap,
        }
    );
};

// ellipsoid
p5.prototype.createEllipsoid = function (radiusX = 100, radiusY = 100, radiusZ = 100, detailX = 12, detailY = 12) {
    return this.createShape(
        function () {
            ellipsoid(this.radiusX, this.radiusY, this.radiusZ, this.detailX, this.detailY);
        },
        {
            radiusX,
            radiusY,
            radiusZ,
            detailX,
            detailY,
        }
    );
};

// torus
p5.prototype.createTorus = function (radius = 100, tubeRadius = 50, detailX = 12, detailY = 12) {
    return this.createShape(
        function () {
            torus(this.radius, this.tubeRadius, this.detailX, this.detailY);
        },
        {
            radius,
            tubeRadius,
            detailX,
            detailY,
        }
    );
};
