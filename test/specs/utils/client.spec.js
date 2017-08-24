import sinon from 'sinon';
import hat from 'hat';

import * as storage from '../../../src/frame/js/utils/storage';
import * as clientUtils from '../../../src/frame/js/utils/client';
import { __Rewire__ as ClientRewire } from '../../../src/frame/js/utils/client';

describe('Client Utils', () => {
    const sandbox = sinon.sandbox.create();
    let appId;
    let getItemStub;
    let setItemStub;
    let removeItemStub;

    beforeEach(() => {
        appId = hat();

        getItemStub = sandbox.stub();
        setItemStub = sandbox.stub();
        removeItemStub = sandbox.stub();
        ClientRewire('storage', {
            ...storage,
            getItem: getItemStub,
            setItem: setItemStub,
            removeItem: removeItemStub
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getClientId', () => {
        it('should return legacy client id', () => {
            const legacyId = hat();
            getItemStub.withArgs('sk_deviceid').returns(legacyId);

            const id = clientUtils.getClientId(appId);

            id.should.eql(legacyId);

            getItemStub.should.have.been.calledOnce;
            getItemStub.should.have.been.calledWith('sk_deviceid');

            setItemStub.should.not.have.been.called;
        });

        it('should return stored client id', () => {
            const storedId = hat();
            getItemStub.withArgs(`${appId}.clientId`).returns(storedId);

            const id = clientUtils.getClientId(appId);

            id.should.eql(storedId);

            getItemStub.should.have.been.calledTwice;
            getItemStub.should.have.been.calledWith('sk_deviceid');
            getItemStub.should.have.been.calledWith(`${appId}.clientId`);

            setItemStub.should.have.been.calledOnce;
            setItemStub.should.have.been.calledWith(`${appId}.clientId`, storedId);
        });

        it('should generate a new client id', () => {
            const id = clientUtils.getClientId(appId);

            id.should.exist;

            getItemStub.should.have.been.calledTwice;
            getItemStub.should.have.been.calledWith('sk_deviceid');
            getItemStub.should.have.been.calledWith(`${appId}.clientId`);

            setItemStub.should.have.been.calledOnce;
            setItemStub.should.have.been.calledWith(`${appId}.clientId`, id);
        });
    });

    describe('getLegacyClientId', () => {
        it('should return the legacy id', () => {
            const legacyId = hat();
            getItemStub.withArgs('sk_deviceid').returns(legacyId);

            const id = clientUtils.getLegacyClientId();

            id.should.eql(legacyId);

            getItemStub.should.have.been.calledOnce;
            getItemStub.should.have.been.calledWith('sk_deviceid');
        });
    });

    describe('upgradeLegacyClientId', () => {
        it('should upgrade a legacy id', () => {
            const legacyId = hat();
            getItemStub.withArgs('sk_deviceid').returns(legacyId);

            clientUtils.upgradeLegacyClientId(appId);

            getItemStub.should.have.been.calledOnce;
            getItemStub.should.have.been.calledWith('sk_deviceid');

            removeItemStub.should.have.been.calledOnce;
            removeItemStub.should.have.been.calledWith('sk_deviceid');

            setItemStub.should.have.been.calledOnce;
            setItemStub.should.have.been.calledWith(`${appId}.clientId`, legacyId);
        });

        it('should not upgrade if there is no legacy id', () => {
            clientUtils.upgradeLegacyClientId(appId);

            getItemStub.should.have.been.calledOnce;
            getItemStub.should.have.been.calledWith('sk_deviceid');

            removeItemStub.should.not.have.been.called;
            setItemStub.should.not.have.been.called;
        });
    });
});
