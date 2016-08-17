import { IntegrationsReducer } from '../../../src/js/reducers/integrations-reducer';

import { SET_WECHAT_QR_CODE, SET_WECHAT_ERROR, UNSET_WECHAT_ERROR, RESET_INTEGRATIONS, SET_TWILIO_INTEGRATION_STATE, RESET_TWILIO_INTEGRATION_STATE } from '../../../src/js/actions/integrations-actions';

describe('Integrations reducer', () => {

    const INITIAL_STATE = IntegrationsReducer(undefined, {});
    const TWILIO_ATTRIBUTES = {
        linkState: 'linked',
        appUserNumber: '+15145555555',
        appUserNumberValid: true
    };

    it('should set the WeChat QR Code with the actions prop on SET_WECHAT_QR_CODE', () => {
        IntegrationsReducer(undefined, {
            type: SET_WECHAT_QR_CODE,
            code: 'qrCode'
        }).wechat.qrCode.should.eq('qrCode');
    });

    it('should set the WeChat error with the actions prop on SET_WECHAT_ERROR', () => {
        IntegrationsReducer(undefined, {
            type: SET_WECHAT_ERROR,
            wechat: {
                hasError: true
            }
        }).wechat.hasError.should.true;
    });

    it('should unset the WeChat error with the actions prop on UNSET_WECHAT_ERROR', () => {
        IntegrationsReducer({
            wechat: {
                hasError: true
            }
        }, {
            type: UNSET_WECHAT_ERROR
        }).wechat.hasError.should.be.false;
    });

    it('should clear the state on RESET_INTEGRATIONS', () => {
        expect(IntegrationsReducer({
            some: 'prop'
        }, {
            type: RESET_INTEGRATIONS
        }).some).to.not.exist;
    });

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
