export function bindAll(context, ...methodNames) {
    methodNames.forEach((methodName) => context[methodName] = context[methodName].bind(context));
}
