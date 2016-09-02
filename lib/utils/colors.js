"use strict";

exports.__esModule = true;
exports.getRGB = getRGB;
exports.isDark = isDark;
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
    var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return yiq < 128;
}