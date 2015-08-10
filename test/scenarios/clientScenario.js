var ScenarioBuilder = require('./scenarioBuilder');

module.exports = ScenarioBuilder.extend({
    mocks: {
        faye: require('../mocks/faye.mock'),
        server: require('../mocks/supportKitServer.mock')
    }
});
