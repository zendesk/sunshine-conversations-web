import sinon from 'sinon';
import { openWidget, closeWidget, toggleWidget } from 'services/app-service';
import { mockAppStore } from 'test/utils/redux';
import { OPEN_WIDGET, CLOSE_WIDGET } from 'actions/app-state-actions';
import { observable } from 'utils/events';

describe('App Service', () => {
    let mockedStore;
    let sandbox;
    let openSpy;
    let closeSpy;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
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
                mockedStore = mockAppStore(sandbox, {
                    appState: {
                        embedded: isEmbedded
                    },
                    conversation: {}
                });
            });

            describe('open widget', () => {
                if (isEmbedded) {
                    it('should do nothing', () => {
                        openWidget();
                        mockedStore.dispatch.should.not.have.been.called;
                        openSpy.should.not.have.been.called;
                        closeSpy.should.not.have.been.called;
                    });
                } else {
                    it('should call dispatch with open action', () => {
                        openWidget();
                        mockedStore.dispatch.should.have.been.calledWith({
                            type: OPEN_WIDGET
                        });
                        openSpy.should.have.been.calledOnce;
                        closeSpy.should.not.have.been.called;
                    });
                }
            });

            describe('close widget', () => {
                if (isEmbedded) {
                    it('should do nothing', () => {
                        closeWidget();
                        mockedStore.dispatch.should.not.have.been.called;
                        openSpy.should.not.have.been.called;
                        closeSpy.should.not.have.been.called;
                    });
                } else {
                    it('should call dispatch with close action', () => {
                        closeWidget();
                        mockedStore.dispatch.should.have.been.calledWith({
                            type: CLOSE_WIDGET
                        });
                        openSpy.should.not.have.been.called;
                        closeSpy.should.have.been.calledOnce;
                    });
                }
            });

            describe('toggle widget', () => {
                if (isEmbedded) {
                    it('should do nothing', () => {
                        toggleWidget();
                        mockedStore.dispatch.should.not.have.been.called;
                        openSpy.should.not.have.been.called;
                        closeSpy.should.not.have.been.called;
                    });
                } else {
                    [true, false].forEach((isOpened) => {
                        describe(isOpened ? 'is opened' : 'is closed', () => {
                            beforeEach(() => {
                                mockedStore = mockAppStore(sandbox, {
                                    appState: {
                                        embedded: isEmbedded,
                                        widgetOpened: isOpened
                                    },
                                    conversation: {}
                                });
                            });

                            it(`should call dispatch with ${isOpened ? 'closed' : 'opened'} action`, () => {
                                toggleWidget();
                                if (isOpened) {
                                    mockedStore.dispatch.should.have.been.calledWith({
                                        type: CLOSE_WIDGET
                                    });

                                    openSpy.should.not.have.been.called;
                                    closeSpy.should.have.been.calledOnce;
                                } else {
                                    mockedStore.dispatch.should.have.been.calledWith({
                                        type: OPEN_WIDGET
                                    });

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
