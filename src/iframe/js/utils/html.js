export function createMarkup(html) {
    return {
        __html: html
    };
}

export function autolink(text, options) {
    options || (options = {});

    const pattern = /(^|[\s\n\[]|<br\/?>)((?:[a-z]*):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    let linkAttributes = Object.keys(options).map((key) => {
        const value = options[key];
        return key + '="' + value + '"';
    }).join(' ');

    linkAttributes && (linkAttributes += ' ');

    return text.replace(pattern, `$1<a ${linkAttributes}href="$2">$2</a>`);
}

export function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
