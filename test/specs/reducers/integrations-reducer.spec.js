import { IntegrationsReducer } from '../../../src/js/reducers/integrations-reducer';
import { SET_WECHAT_QR_CODE, SET_WECHAT_ERROR, UNSET_WECHAT_ERROR, RESET_INTEGRATIONS } from '../../../src/js/actions/integrations-actions';

describe('Integrations reducer', () => {
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
});
