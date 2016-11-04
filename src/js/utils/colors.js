// most utils were extract from https://github.com/Qix-/color

export function getRGB(string) {
    const abbr = /^#([a-fA-F0-9]{3})$/;
    const hex = /^#([a-fA-F0-9]{6})$/;
    const rgb = [0, 0, 0, 1];

    let match = string.match(abbr);


    if (match) {
        match = match[1];

        for (let i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i] + match[i], 16);
        }
    } else {
        match = string.match(hex);
        if (match) {

            match = match[1];

            for (let i = 0; i < 3; i++) {
                // https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
                var i2 = i * 2;
                rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
            }
        }
    }

    return rgb;
}

export function isDark(colorCode) {
    const rgb = getRGB(colorCode);
    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return yiq < 128;
}

// extracted from https://bgrins.github.io/TinyColor/docs/tinycolor.html, MIT LICENSE
export function rgbToHsl(r, g, b) {
    const isPercentage = (n) => {
        return typeof n === 'string' && n.indexOf('%') != -1;
    };

    const isOnePointZero = (n) => {
        return typeof n == 'string' && n.indexOf('.') != -1 && parseFloat(n) === 1;
    };

    const bound01 = (n, max) => {
        if (isOnePointZero(n)) {
            n = '100%';
        }

        var processPercent = isPercentage(n);
        n = Math.min(max, Math.max(0, parseFloat(n)));
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        if ( (Math.abs(n - max) < 0.000001) ) {
            return 1;
        }

        return (n % max) / parseFloat(max);
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
