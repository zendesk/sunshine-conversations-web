'use strict';

exports.__esModule = true;
exports.getRGB = getRGB;
exports.isDark = isDark;
exports.rgbToHsl = rgbToHsl;
// most utils were extract from https://github.com/Qix-/color

function getRGB(string) {
    var abbr = /^#([a-fA-F0-9]{3})$/;
    var hex = /^#([a-fA-F0-9]{6})$/;
    var rgb = [0, 0, 0, 1];

    var match = string.match(abbr);

    if (match) {
        match = match[1];

        for (var i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i] + match[i], 16);
        }
    } else {
        match = string.match(hex);
        if (match) {

            match = match[1];

            for (var _i = 0; _i < 3; _i++) {
                // https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
                var i2 = _i * 2;
                rgb[_i] = parseInt(match.slice(i2, i2 + 2), 16);
            }
        }
    }

    return rgb;
}

function isDark(colorCode) {
    var rgb = getRGB(colorCode);
    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    var yiq = (rgb[0] * 239 + rgb[1] * 500 + rgb[2] * 40) / 1000;
    return yiq < 128;
}

// extracted from https://bgrins.github.io/TinyColor/docs/tinycolor.html, MIT LICENSE
function rgbToHsl(r, g, b) {
    var isPercentage = function isPercentage(n) {
        return typeof n === 'string' && n.indexOf('%') != -1;
    };

    var isOnePointZero = function isOnePointZero(n) {
        return typeof n == 'string' && n.indexOf('.') != -1 && parseFloat(n) === 1;
    };

    var bound01 = function bound01(n, max) {
        if (isOnePointZero(n)) {
            n = '100%';
        }

        var processPercent = isPercentage(n);
        n = Math.min(max, Math.max(0, parseFloat(n)));
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        if (Math.abs(n - max) < 0.000001) {
            return 1;
        }

        return n % max / parseFloat(max);
    };

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return {
        h: h * 360,
        s: s * 100,
        l: l * 100
    };
}