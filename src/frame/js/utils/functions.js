export function bindAll(context, ...methodNames) {
    methodNames.forEach((methodName) => context[methodName] = context[methodName].bind(context));
}

export function deepFreeze(obj) {
    // Taken from : https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
    var propNames = Object.getOwnPropertyNames(obj);

    propNames.forEach(function(name) {
        var prop = obj[name];

        if (typeof prop == 'object' && prop !== null) {
            deepFreeze(prop);
        }
    });

    return Object.freeze(obj);
}
