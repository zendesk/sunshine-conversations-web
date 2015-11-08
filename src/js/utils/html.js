
export function createMarkup(html) {
    return {
        __html: html
    };
}


export function autolink(text, options) {
    options || (options = {});

    let pattern = /(^|[\s\n]|<br\/?>)((?:[a-z]*):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    let linkAttributes = Object.keys(options).map((key) => {
        let value = options[key];
        return key + '="' + value + '"';
    }).join(' ');

    return text.replace(pattern, '$1<a '+ linkAttributes +' href=\'$2\'>$2</a>');

}
