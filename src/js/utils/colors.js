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
