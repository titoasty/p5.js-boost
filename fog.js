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
