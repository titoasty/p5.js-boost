/**
 * Setup Boost library.
 * Call it once in setup()
 * @function setupBoost
 */
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
