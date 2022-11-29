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