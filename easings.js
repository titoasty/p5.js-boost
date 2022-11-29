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
