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
