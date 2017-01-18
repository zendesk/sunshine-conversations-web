import sinon from 'sinon';

import { openWidget, closeWidget, toggleWidget } from '../../../src/js/services/app';
import { createMockedStore } from '../../utils/redux';
import { observable } from '../../../src/js/utils/events';
import { WIDGET_STATE } from '../../../src/js/constants/app';

describe('App Service', () => {
    let mockedStore;
    let sandbox;
    let clock;
    let openSpy;
    let closeSpy;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        clock = sandbox.useFakeTimers();
        openSpy = sandbox.spy();
        closeSpy = sandbox.spy();

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
                mockedStore = createMockedStore(sandbox, {
                    appState: {
                        embedded: isEmbedded
                    },
                    conversation: {}
                });
            });

            describe('open widget', () => {
                if (isEmbedded) {
                    it('should do nothing', () => {
                        mockedStore.dispatch(openWidget());
                        clock.tick(20);
                        openSpy.should.not.have.been.called;
                        closeSpy.should.not.have.been.called;
                    });
                } else {
                    it('should call dispatch with open action', () => {
                        mockedStore.dispatch(openWidget());
                        clock.tick(20);
                        openSpy.should.have.been.calledOnce;
                        closeSpy.should.not.have.been.called;
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
                    });
                } else {
                    it('should call dispatch with close action', () => {
                        mockedStore.dispatch(closeWidget());
                        clock.tick(20);
                        openSpy.should.not.have.been.called;
                        closeSpy.should.have.been.calledOnce;
                    });
                }
            });

            describe('toggle widget', () => {
                if (isEmbedded) {
                    it('should do nothing', () => {
                        mockedStore.dispatch(toggleWidget());
                        clock.tick(20);
                        openSpy.should.not.have.been.called;
                        closeSpy.should.not.have.been.called;
                    });
                } else {
                    [true, false].forEach((isOpened) => {
                        describe(isOpened ? 'is opened' : 'is closed', () => {
                            beforeEach(() => {
                                mockedStore = createMockedStore(sandbox, {
                                    appState: {
                                        embedded: isEmbedded,
                                        widgetState: isOpened ? WIDGET_STATE.OPENED : WIDGET_STATE.CLOSED
                                    },
                                    conversation: {}
                                });
                            });

                            it(`should call dispatch with ${isOpened ? 'closed' : 'opened'} action`, () => {
                                mockedStore.dispatch(toggleWidget());
                                clock.tick(20);
                                if (isOpened) {
                                    openSpy.should.not.have.been.called;
                                    closeSpy.should.have.been.calledOnce;
                                } else {
                                    openSpy.should.have.been.calledOnce;
                                    closeSpy.should.not.have.been.called;
                                }
                            });
                        });
                    });
                }
            });
        });
    });
});
