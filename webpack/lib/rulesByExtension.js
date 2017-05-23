'use strict';

function extsToRegExp(exts) {
    const extPatterns = exts.map(function(ext) {
        return ext.replace(/\./g, '\\.');
    }).join('|');
    return new RegExp('\\.(' + extPatterns + ')(\\?.*)?$');
}

module.exports = function rulesByExtension(obj) {
    var rules = [];
    Object.keys(obj).forEach(function(key) {
        var exts = key.split('|');
        var value = obj[key];
        var rule = {
            test: extsToRegExp(exts)
        };
        if (Array.isArray(value)) {
            rule.use = value;
        } else if (typeof value === 'string') {
            rule.use = [value];
        } else {
            Object.keys(value).forEach(function(valueKey) {
                rule[valueKey] = value[valueKey];
            });
        }
        rules.push(rule);
    });
    return rules;
};
