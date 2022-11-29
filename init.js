function setupBoost(renderer) {
    initShaders(renderer);

    // backface culling
    renderer.drawingContext.enable(renderer.drawingContext.CULL_FACE);
    renderer.drawingContext.cullFace(renderer.drawingContext.FRONT);

    angleMode(DEGREES);

    return renderer;
}
