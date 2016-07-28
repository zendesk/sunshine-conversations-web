import { IntegrationsReducer } from '../../../src/js/reducers/integrations-reducer';
import { SET_TWILIO_INTEGRATION_STATE, RESET_TWILIO_INTEGRATION_STATE } from '../../../src/js/actions/integrations-actions';

const INITIAL_STATE = IntegrationsReducer(undefined, {});
const TWILIO_ATTRIBUTES = {
    linkState: 'linked',
    appUserNumber: '+15145555555',
    appUserNumberValid: true
}

describe('Integrations Reducer', () => {
    describe('SET_TWILIO_INTEGRATION_STATE action', () => {
        it('should update with new twilio attributes', () => {
            const beforeState = INITIAL_STATE;
            const afterState = IntegrationsReducer(beforeState, {
                type: SET_TWILIO_INTEGRATION_STATE,
                attrs: TWILIO_ATTRIBUTES
            });
            afterState.twilio.should.be.defined;
            afterState.twilio.linkState.should.eql(TWILIO_ATTRIBUTES.linkState);
            afterState.twilio.appUserNumber.should.eql(TWILIO_ATTRIBUTES.appUserNumber);
            afterState.twilio.appUserNumberValid.should.eql(TWILIO_ATTRIBUTES.appUserNumberValid);
        });
    });

    describe('RESET_TWILIO_INTEGRATION_STATE action', () => {
        it('should reset the default twilio attributes', () => {
            const beforeState = {
                integrations: {
                    twilio: {
                        ...TWILIO_ATTRIBUTES
                    }
                }
            };
            const afterState = IntegrationsReducer(beforeState, {
                type: RESET_TWILIO_INTEGRATION_STATE
            });
            afterState.should.eql(INITIAL_STATE);
        });
    });
});
