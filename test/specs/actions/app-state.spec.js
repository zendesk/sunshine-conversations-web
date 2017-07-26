import sinon from 'sinon';

import { openWidget, closeWidget, toggleWidget, __Rewire__ as RewireAppStateActions } from '../../../src/frame/js/actions/app-state';
import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';
import { observable } from '../../../src/frame/js/utils/events';
import { WIDGET_STATE } from '../../../src/frame/js/constants/app';

describe('App State Actions', () => {
    let mockedStore;
    let sandbox;
    let clock;
    let openSpy;
    let closeSpy;
    let resetUnreadCountStub;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
        openSpy = sandbox.spy();
        closeSpy = sandbox.spy();

        resetUnreadCountStub = sandbox.stub().returnsAsyncThunk();
        RewireAppStateActions('resetUnreadCount', resetUnreadCountStub);

        observable.on('widget:opened', openSpy);
        observable.on('widget:closed', closeSpy);
    });

    afterEach(() => {
        sandbox.restore();
        observable.off();
    });

    // embedded or not
    [true, false].forEach((isEmbedded) => {
        describe(isEmbedded ? 'is embedded' : 'is not embedded', () => {
            beforeEach(() => {
                mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                    appState: {
                        widgetState: isEmbedded ? WIDGET_STATE.EMBEDDED : WIDGET_STATE.INIT
                    },
                    conversation: {}
                }));
            });

            describe('open widget', () => {
                if (isEmbedded) {
                    it('should do nothing', () => {
                        mockedStore.dispatch(openWidget());
                        clock.tick(20);
                        openSpy.should.not.have.been.called;
                        closeSpy.should.not.have.been.called;
                        resetUnreadCountStub.should.not.have.been.called;
                    });
                } else {
                    it('should call dispatch with open action', () => {
                        mockedStore.dispatch(openWidget());
                        clock.tick(20);
                        openSpy.should.have.been.calledOnce;
                        closeSpy.should.not.have.been.called;
                        resetUnreadCountStub.should.have.been.calledOnce;
                    });
                }
            });

            describe('close widget', () => {
                if (isEmbedded) {
                    it('should do nothing', () => {
                        mockedStore.dispatch(closeWidget());
                        clock.tick(20);
                        openSpy.should.not.have.been.called;
                        closeSpy.should.not.have.been.called;
                        resetUnreadCountStub.should.not.have.been.called;
                    });
                } else {
                    it('should call dispatch with close action', () => {
                        mockedStore.dispatch(closeWidget());
                        clock.tick(20);
                        openSpy.should.not.have.been.called;
                        closeSpy.should.have.been.calledOnce;
                        resetUnreadCountStub.should.have.been.calledOnce;
                    });
                }
            });

            describe('toggle widget', () => {
                let openWidgetStub;
                let closeWidgetStub;

                beforeEach(() => {
                    openWidgetStub = sandbox.stub().returnsSyncThunk();
                    closeWidgetStub = sandbox.stub().returnsSyncThunk();

                    RewireAppStateActions('openWidget', openWidgetStub);
                    RewireAppStateActions('closeWidget', closeWidgetStub);
                });

                if (isEmbedded) {
                    it('should do nothing', () => {
                        mockedStore.dispatch(toggleWidget());
                        openWidgetStub.should.not.have.been.called;
                        closeWidgetStub.should.not.have.been.called;
                    });
                } else {
                    [true, false].forEach((isOpened) => {
                        describe(isOpened ? 'is opened' : 'is closed', () => {
                            beforeEach(() => {
                                mockedStore = createMockedStore(sandbox, {
                                    appState: {
                                        widgetState: isOpened ? WIDGET_STATE.OPENED : WIDGET_STATE.CLOSED
                                    },
                                    conversation: {}
                                });
                            });

                            it(`should call dispatch with ${isOpened ? 'closed' : 'opened'} action`, () => {
                                mockedStore.dispatch(toggleWidget());
                                if (isOpened) {
                                    openWidgetStub.should.not.have.been.called;
                                    closeWidgetStub.should.have.been.calledOnce;
                                } else {
                                    openWidgetStub.should.have.been.calledOnce;
                                    closeWidgetStub.should.not.have.been.called;
                                }
                            });
                        });
                    });
                }
            });
        });
    });
});
