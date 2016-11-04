import sinon from 'sinon';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';
import StripeCheckout from 'react-stripe-checkout';

import { mockAppStore } from '../../utils/redux';
import { mockComponent, wrapComponentWithStore } from '../../utils/react';

import { Action } from '../../../src/js/components/action.jsx';
import { LoadingComponent } from '../../../src/js/components/loading.jsx';

import * as stripeService from '../../../src/js/services/stripe-service';
import * as userService from '../../../src/js/services/user-service';
import * as conversationService from '../../../src/js/services/conversation-service';
import * as appUtils from '../../../src/js/utils/app';

const sandbox = sinon.sandbox.create();

function getNormalProps(props = {}) {
    const defaultProps = {
        _id: 'action id',
        type: 'link',
        text: 'action text',
        uri: 'http://some-uri/'
    };

    return Object.assign(defaultProps, props);
}

function getBuyProps(props = {}) {
    const defaultProps = {
        _id: 'action id',
        type: 'buy',
        text: 'action text',
        uri: 'http://some-uri/',
        currency: 'usd',
        state: 'offered'
    };

    return Object.assign(defaultProps, props);
}

function getPostbackProps(props = {}) {
    const defaultProps = {
        _id: 'postback id',
        type: 'postback',
        text: 'postback text',
        payload: 'postback payload'
    };

    return Object.assign(defaultProps, props);
}

function getStoreState(state = {}) {
    const defaultState = {
        app: {
            integrations: []
        },
        user: {
            email: 'test'
        },
        ui: {
            text: {
                actionPaymentCompleted: 'payment completed text'
            }
        }
    };

    return deepAssign(defaultState, state);
}

describe('Action Component', () => {
    let component;
    let componentNode;
    let mockedStore;

    beforeEach(() => {
        mockComponent(sandbox, StripeCheckout, 'div', {
            className: 'mockedStripe'
        });
        mockComponent(sandbox, LoadingComponent, 'div', {
            className: 'mockedLoading'
        });

        sandbox.stub(userService, 'immediateUpdate');
        userService.immediateUpdate.resolves();

        sandbox.stub(conversationService, 'postPostback');
        conversationService.postPostback.resolves();

        sandbox.stub(appUtils, 'getIntegration');
        appUtils.getIntegration.returns(
            {
                type: 'stripeConnect',
                publicKey: 'key'
            }
        );
    });

    afterEach(() => {
        sandbox.restore();
        mockedStore.restore();
    });

    describe('normal action link', () => {
        const props = getNormalProps();

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = wrapComponentWithStore(Action, props, mockedStore);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link with target blank', () => {
            const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            link.textContent.should.eq('action text');
            link.href.should.eq('http://some-uri/');
            link.target.should.eq('_blank');
        });
    });

    describe('javascript action link', () => {
        const props = getNormalProps({
            uri: 'javascript:someAction()'
        });

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = wrapComponentWithStore(Action, props, mockedStore);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link with target self', () => {
            const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            link.textContent.should.eq('action text');
            link.href.should.eq('javascript:someAction()');
            link.target.should.eq('_self');
        });
    });

    describe('Stripe', () => {
        const storeState = getStoreState({
            app: {
                integrations: [
                    {
                        type: 'stripeConnect'
                    }
                ],
                stripe: {
                    appName: 'app-name',
                    iconUrl: 'iconUrl'
                }
            }
        });

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, storeState);
        });

        afterEach(() => {
            appUtils.getIntegration.should.have.been.calledWithMatch(storeState.app.integrations, 'stripeConnect');
            mockedStore.restore();
        });

        describe('buy action with stripe keys and offered state', () => {
            const props = getBuyProps({
                uri: 'http://some-fallback-uri/'
            });

            beforeEach(() => {
                component = wrapComponentWithStore(Action, props, mockedStore);
            });

            it('should render a Stripe button', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedStripe').length.should.be.eq(1);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedLoading').length.should.be.eq(0);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-action-paid').length.should.be.eq(0);
                componentNode.textContent.should.eq('action text');
            });
        });

        describe('buy action with stripe keys and processing state', () => {
            const props = getBuyProps({
                state: 'processing'
            });

            beforeEach(() => {
                component = wrapComponentWithStore(Action, props, mockedStore);
                componentNode = ReactDOM.findDOMNode(component);
            });

            it('should render a loading element', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedStripe').length.should.be.eq(0);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedLoading').length.should.be.eq(1);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-action-paid').length.should.be.eq(0);
                componentNode.textContent.should.eq('');
            });
        });

        describe('buy action with stripe keys and paid state', () => {
            const props = getBuyProps({
                state: 'paid'
            });

            beforeEach(() => {
                component = wrapComponentWithStore(Action, props, mockedStore);
                componentNode = ReactDOM.findDOMNode(component);
            });

            it('should show a payment completed button', () => {
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-action-paid').length.should.be.eq(1);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedStripe').length.should.be.eq(0);
                TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedLoading').length.should.be.eq(0);
                componentNode.textContent.should.eq('payment completed text');
            });
        });

        describe('onStripeToken', () => {

            describe('user has no email', () => {
                const props = getBuyProps();

                beforeEach(() => {
                    mockedStore = mockAppStore(sandbox, getStoreState({
                        app: {
                            integrations: [
                                {
                                    type: 'stripeConnect'
                                }
                            ],
                            stripe: {
                                appName: 'app-name',
                                iconUrl: 'iconUrl'
                            }
                        },
                        user: {
                            email: ''
                        }
                    }));

                    component = wrapComponentWithStore(Action, props, mockedStore);

                    sandbox.stub(stripeService, 'createTransaction');
                    stripeService.createTransaction.resolves();
                });

                it('call user update', () => {
                    return component.getWrappedInstance().onStripeToken({
                        email: 'email'
                    }).then(() => {
                        userService.immediateUpdate.should.have.been.calledWith({
                            email: 'email'
                        });
                    });
                });
            });

            describe('user has email', () => {
                const props = getBuyProps();
                beforeEach(() => {
                    component = wrapComponentWithStore(Action, props, mockedStore);
                    sandbox.stub(stripeService, 'createTransaction');
                    stripeService.createTransaction.resolves();
                });

                it('call user update', () => {
                    return component.getWrappedInstance().onStripeToken({
                        email: 'email'
                    }).then(() => {
                        userService.immediateUpdate.should.not.have.been.called;
                    });
                });
            });

            describe('create transaction success', () => {
                const props = getBuyProps({
                    state: 'processing'
                });

                beforeEach(() => {
                    component = wrapComponentWithStore(Action, props, mockedStore).getWrappedInstance();
                    sandbox.stub(stripeService, 'createTransaction');
                    stripeService.createTransaction.resolves();
                });

                it('should set state to paid', () => {
                    component.state.state.should.eq('processing');
                    return component.onStripeToken({
                        email: 'email'
                    }).then(() => {
                        component.state.state.should.eq('paid');
                    });
                });
            });

            describe('create transaction fail', () => {
                const props = getBuyProps({
                    state: 'processing'
                });

                beforeEach(() => {
                    component = wrapComponentWithStore(Action, props, mockedStore).getWrappedInstance();
                    sandbox.stub(stripeService, 'createTransaction');
                    stripeService.createTransaction.rejects();

                });

                it('should set state to paid', () => {
                    component.state.state.should.eq('processing');
                    return component.onStripeToken({
                        email: 'email'
                    }).then(() => {
                        component.state.state.should.eq('offered');
                    });
                });
            });
        });

        describe('onStripeClick', () => {
            const props = getBuyProps();

            beforeEach(() => {
                component = wrapComponentWithStore(Action, props, mockedStore).getWrappedInstance();
            });

            it('set state to processing', () => {
                component.state.state.should.eq('offered');
                component.onStripeClick();
                component.state.state.should.eq('processing');
            });
        });

        describe('onStripeClose', () => {
            const props = getBuyProps({
                state: 'processing'
            });

            beforeEach(() => {
                component = wrapComponentWithStore(Action, props, mockedStore).getWrappedInstance();
            });

            it('should set state to offered if no token', () => {
                component.state.state.should.eq('processing');
                component.state.hasToken = false;
                component.onStripeClose();
                component.state.state.should.eq('offered');
            });

            it('should do nothing if token', () => {
                component.state.state.should.eq('processing');
                component.state.hasToken = true;
                component.onStripeClose();
                component.state.state.should.eq('processing');
            });
        });
    });

    describe('buy action without stripe keys', () => {
        const props = getBuyProps();
        const storeState = getStoreState({
            app: {
                stripe: {
                    appName: 'app-name',
                    iconUrl: 'iconUrl'
                }
            },
            ui: {
                text: {
                    actionPaymentCompleted: 'payment completed text'
                }
            }
        });

        beforeEach(() => {
            appUtils.getIntegration.returns(undefined);
            mockedStore = mockAppStore(sandbox, storeState);
            component = wrapComponentWithStore(Action, props, mockedStore).getWrappedInstance();
        });

        it('should render a link', () => {
            const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            link.textContent.should.eq('action text');
            link.href.should.eq('http://some-uri/');
            link.target.should.eq('_blank');
        });
    });

    describe('postback action', () => {
        const props = getPostbackProps();

        beforeEach(() => {
            component = wrapComponentWithStore(Action, props, mockedStore).getWrappedInstance();
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a postback', () => {
            componentNode.textContent.should.eq('postback text');
        });

        it('should call the postPostback action on button click', (done) => {
            const button = TestUtils.findRenderedDOMComponentWithTag(component, 'button');
            TestUtils.Simulate.click(button);

            // use setTimeout to let the promise chain resolve in onPostbackClick
            setTimeout(() => {
                conversationService.postPostback.should.have.been.calledOnce;
                done();
            });
        });
    });
});
