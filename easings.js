/**
 * Easings
 * @namespace easings
 */

const _easing_c1 = 1.70158;
const _easing_c2 = _easing_c1 * 1.525;
const _easing_c3 = _easing_c1 + 1;
const _easing_c4 = (2 * Math.PI) / 3;
const _easing_c5 = (2 * Math.PI) / 4.5;

/**
 * Linear ease
 * @memberof easings
 * @param {number} x - between 0 and 1
 * @returns {number} a value between 0 and 1
 */
function easeLinear(x) {
    return x;
}

/**
 * Quad ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInQuad(x) {
    return x * x;
}
/**
 * Quad ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}
/**
 * Quad ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

/**
 * Cubic ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInCubic(x) {
    return x * x * x;
}
/**
 * Cubic ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}
/**
 * Cubic ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Quart ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInQuart(x) {
    return x * x * x * x;
}
/**
 * Quart ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}
/**
 * Quart ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

/**
 * Quint ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInQuint(x) {
    return x * x * x * x * x;
}
/**
 * Quint ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}
/**
 * Quint ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutQuint(x) {
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}

/**
 * Sine ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInSine(x) {
    return 1 - Math.cos((x * Math.PI) / 2);
}
/**
 * Sine ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}
/**
 * Sine ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}

/**
 * Expo ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInExpo(x) {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
/**
 * Expo ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
/**
 * Expo ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutExpo(x) {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

/**
 * Circ ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInCirc(x) {
    return 1 - sqrt(1 - Math.pow(x, 2));
}
/**
 * Circ ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutCirc(x) {
    return sqrt(1 - Math.pow(x - 1, 2));
}
/**
 * Circ ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutCirc(x) {
    return x < 0.5 ? (1 - sqrt(1 - Math.pow(2 * x, 2))) / 2 : (sqrt(1 - Math.pow(-2 * x + 2, 2)) + 1) / 2;
}

/**
 * Back ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInBack(x) {
    return _easing_c3 * x * x * x - _easing_c1 * x * x;
}
/**
 * Back ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutBack(x) {
    return 1 + _easing_c3 * Math.pow(x - 1, 3) + _easing_c1 * Math.pow(x - 1, 2);
}
/**
 * Back ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutBack(x) {
    return x < 0.5 ? (Math.pow(2 * x, 2) * ((_easing_c2 + 1) * 2 * x - _easing_c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((_easing_c2 + 1) * (x * 2 - 2) + _easing_c2) + 2) / 2;
}

/**
 * Elastic ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInElastic(x) {
    return x === 0 ? 0 : x === 1 ? 1 : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * _easing_c4);
}
/**
 * Elastic ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeOutElastic(x) {
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * _easing_c4) + 1;
}
/**
 * Elastic ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutElastic(x) {
    return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * _easing_c5)) / 2 : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * _easing_c5)) / 2 + 1;
}

/**
 * Bounce ease in
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
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
/**
 * Bounce ease out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInBounce(x) {
    return 1 - easeOutBounce(1 - x);
}
/**
 * Bounce ease in and out
 * @memberof easings
 * @param {number} x
 * @returns {number} a value between 0 and 1
 */
function easeInOutBounce(x) {
    return x < 0.5 ? (1 - easeOutBounce(1 - 2 * x)) / 2 : (1 + easeOutBounce(2 * x - 1)) / 2;
}
