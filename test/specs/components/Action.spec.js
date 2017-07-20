import sinon from 'sinon';
import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';
import { mockComponent, wrapComponentWithStore } from '../../utils/react';

import StripeCheckout from '../../../src/frame/js/lib/react-stripe-checkout';
import Action, { __Rewire__ as ActionRewire } from '../../../src/frame/js/components/Action';
import Loading from '../../../src/frame/js/components/Loading';

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
    return generateBaseStoreProps({
        ...state,
        user: {
            email: 'test',
            ...state.user
        },
        ui: {
            text: {
                actionPaymentCompleted: 'payment completed text'
            },
            ...state.ui
        }
    });
}

describe('Action Component', () => {
    let component;
    let componentNode;
    let mockedStore;
    let immediateUpdateStub;
    let postPostbackStub;
    let getIntegrationStub;
    let createTransactionStub;

    beforeEach(() => {
        mockComponent(sandbox, StripeCheckout, 'div', {
            className: 'mockedStripe'
        });
        mockComponent(sandbox, Loading, 'div', {
            className: 'mockedLoading'
        });


        immediateUpdateStub = sandbox.stub().returnsAsyncThunk();
        ActionRewire('immediateUpdate', immediateUpdateStub);

        postPostbackStub = sandbox.stub().returnsAsyncThunk();
        ActionRewire('postPostback', postPostbackStub);

        createTransactionStub = sandbox.stub().returnsAsyncThunk();
        ActionRewire('createTransaction', createTransactionStub);

        getIntegrationStub = sandbox.stub().returns(
            {
                type: 'stripeConnect',
                publicKey: 'key'
            }
        );
        ActionRewire('getIntegration', getIntegrationStub);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('normal action link', () => {
        const props = getNormalProps();

        beforeEach(() => {
            mockedStore = createMockedStore(sandbox, getStoreState());
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
            mockedStore = createMockedStore(sandbox, getStoreState());
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
            config: {
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
            mockedStore = createMockedStore(sandbox, storeState);
        });

        afterEach(() => {
            getIntegrationStub.should.have.been.calledWithMatch(storeState.config.integrations, 'stripeConnect');
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
                    mockedStore = createMockedStore(sandbox, getStoreState({
                        config: {
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
                });

                it('call user update', () => {
                    return component.getWrappedInstance().onStripeToken({
                        email: 'email'
                    }).then(() => {
                        immediateUpdateStub.should.have.been.calledWith({
                            email: 'email'
                        });
                    });
                });
            });

            describe('user has email', () => {
                const props = getBuyProps();
                beforeEach(() => {
                    component = wrapComponentWithStore(Action, props, mockedStore);
                });

                it('call user update', () => {
                    return component.getWrappedInstance().onStripeToken({
                        email: 'email'
                    }).then(() => {
                        immediateUpdateStub.should.not.have.been.called;
                    });
                });
            });

            describe('create transaction success', () => {
                const props = getBuyProps({
                    state: 'processing'
                });

                beforeEach(() => {
                    component = wrapComponentWithStore(Action, props, mockedStore).getWrappedInstance();
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
                    createTransactionStub.returnsAsyncThunk({
                        rejects: true
                    });
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
                const event = {
                    preventDefault: sandbox.stub()
                };

                component.state.state.should.eq('offered');
                component.onStripeClick(event);
                component.state.state.should.eq('processing');

                event.preventDefault.should.have.been.calledOnce;
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
            getIntegrationStub.returns(undefined);
            mockedStore = createMockedStore(sandbox, storeState);
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
            const button = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            TestUtils.Simulate.click(button);

            // use setTimeout to let the promise chain resolve in onPostbackClick
            setTimeout(() => {
                postPostbackStub.should.have.been.calledOnce;
                done();
            });
        });
    });
});
