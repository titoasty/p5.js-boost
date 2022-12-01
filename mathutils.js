/**
 * Math utils
 * @namespace mathutils
 */

/**
 * Generate a random vector lerped between baseDir and a random unit sphere vector
 * @memberof mathutils
 * @param {number} [power=1] - power of the lerp, between 0 and 1
 * @param {p5.Vector} [baseDir=(0,-1,0)] - base direction
 * @returns {p5.Vector}
 */
function randomDir(power = 1, baseDir) {
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

    return createVector(lerp(baseDir.x, x, power), lerp(baseDir.y, y, power), lerp(baseDir.z, z, power)).normalize();
}
