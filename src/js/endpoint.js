var ROOT_URL = 'https://sdk.supportkit.io';
module.exports.rootUrl = ROOT_URL;

// State params set by main
module.exports.appToken = undefined;
module.exports.jwt = undefined;
module.exports.appUserId = undefined;
module.exports.userId = undefined;

module.exports.reset = function() {
    delete this.jwt;
    delete this.appUserId;
    delete this.userId;
};
