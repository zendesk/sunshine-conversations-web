import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import deepAssign from 'deep-assign';
import StripeCheckout from 'react-stripe-checkout';

import { mockAppStore } from '../../utils/redux';
import { mockComponent, getContext } from '../../utils/react';

import { ActionComponent } from '../../../src/js/components/action.jsx';
import { LoadingComponent } from '../../../src/js/components/loading.jsx';

const stripeService = require('../../../src/js/services/stripe-service');
const userService = require('../../../src/js/services/user-service');
const conversationService = require('../../../src/js/services/conversation-service');
import * as appUtils from '../../../src/js/utils/app';
import { ParentComponentWithContext } from '../../utils/parent-component';

const sandbox = sinon.sandbox.create();

function getNormalProps(props = {}) {
    const defaultProps = {
        _id: 'action id',
        type: 'link',
        text: 'action text',
        uri: 'action uri'
    };

    return Object.assign(defaultProps, props);
}

function getBuyProps(props = {}) {
    const defaultProps = {
        _id: 'action id',
        type: 'buy',
        text: 'action text',
        uri: 'action uri',
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

describe('Action', () => {
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
        appUtils.getIntegration.returns({});
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        mockedStore.restore();
    });

    describe('normal action link', () => {
        const props = getNormalProps();
        const context = getContext();

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                 store={ mockedStore }>
                                                         <ActionComponent {...props} />
                                                     </ParentComponentWithContext>);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link with target blank', () => {
            const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            link.textContent = 'action text';
            link.href = 'action uri';
            link.target = '_blank';
        });
    });

    describe('javascript action link', () => {
        const props = getNormalProps({
            uri: 'javascript:someAction()'
        });
        const context = getContext();

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                 store={ mockedStore }>
                                                         <ActionComponent {...props} />
                                                     </ParentComponentWithContext>);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link with target self', () => {
            const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            link.textContent = 'action text';
            link.href = 'javascript:someAction()';
            link.target = '_self';
        });
    });

    describe('Stripe', () => {
        const context = getContext({
            app: {
                stripe: {
                    appName: 'app-name',
                    iconUrl: 'iconUrl'
                }
            }
        });

        afterEach(() => {
            appUtils.getIntegration.should.have.been.calledWithMatch(context.app.integrations, 'stripeConnect');
        });

        describe('buy action with stripe keys and offered state', () => {
            const props = getBuyProps({
                uri: 'fallback uri'
            });

            beforeEach(() => {
                appUtils.getIntegration.returns(
                    {
                        type: 'stripeConnect',
                        publicKey: 'key'
                    }
                );
                mockedStore = mockAppStore(sandbox, getStoreState());
                component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                     store={ mockedStore }>
                                                             <ActionComponent {...props} />
                                                         </ParentComponentWithContext>);
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
                mockedStore = mockAppStore(sandbox, getStoreState());
                component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                     store={ mockedStore }>
                                                             <ActionComponent {...props} />
                                                         </ParentComponentWithContext>);
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
                appUtils.getIntegration.returns(
                    {
                        type: 'stripeConnect',
                        publicKey: 'key'
                    }
                );
                mockedStore = mockAppStore(sandbox, getStoreState());
                component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                     store={ mockedStore }>
                                                             <ActionComponent {...props} />
                                                         </ParentComponentWithContext>);
                componentNode = ReactDOM.findDOMNode(component);
            });

            it('should a payment completed button', () => {
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
                    appUtils.getIntegration.returns(
                        {
                            type: 'stripeConnect',
                            publicKey: 'key'
                        }
                    );
                    mockedStore = mockAppStore(sandbox, getStoreState({
                        user: {
                            email: ''
                        }
                    }));
                    component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                         store={ mockedStore }
                                                                                         withRef={ true }>
                                                                 <ActionComponent {...props} />
                                                             </ParentComponentWithContext>);
                    sandbox.stub(stripeService, 'createTransaction');
                    stripeService.createTransaction.resolves();
                });

                it('call user update', () => {
                    const stripeComponent = component.refs.childElement;
                    return stripeComponent.onStripeToken({
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
                    mockedStore = mockAppStore(sandbox, getStoreState());
                    component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                         store={ mockedStore }
                                                                                         withRef={ true }>
                                                                 <ActionComponent {...props} />
                                                             </ParentComponentWithContext>);
                    sandbox.stub(stripeService, 'createTransaction');
                    stripeService.createTransaction.resolves();
                });

                it('call user update', () => {
                    const stripeComponent = component.refs.childElement;
                    return stripeComponent.onStripeToken({
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
                    mockedStore = mockAppStore(sandbox, getStoreState());
                    component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                         store={ mockedStore }
                                                                                         withRef={ true }>
                                                                 <ActionComponent {...props} />
                                                             </ParentComponentWithContext>);
                    sandbox.stub(stripeService, 'createTransaction');
                    stripeService.createTransaction.resolves();
                });

                it('should set state to paid', () => {
                    const stripeComponent = component.refs.childElement;
                    stripeComponent.state.state.should.eq('processing');
                    return stripeComponent.onStripeToken({
                        email: 'email'
                    }).then(() => {
                        stripeComponent.state.state.should.eq('paid');
                    });
                });
            });

            describe('create transaction fail', () => {
                const props = getBuyProps({
                    state: 'processing'
                });

                beforeEach(() => {
                    mockedStore = mockAppStore(sandbox, getStoreState());
                    component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                         store={ mockedStore }
                                                                                         withRef={ true }>
                                                                 <ActionComponent {...props} />
                                                             </ParentComponentWithContext>);
                    sandbox.stub(stripeService, 'createTransaction');
                    stripeService.createTransaction.rejects();

                });

                it('should set state to paid', () => {
                    const stripeComponent = component.refs.childElement;
                    stripeComponent.state.state.should.eq('processing');
                    return stripeComponent.onStripeToken({
                        email: 'email'
                    }).then(() => {
                        stripeComponent.state.state.should.eq('offered');
                    });
                });
            });
        });

        describe('onStripeClick', () => {
            const props = getBuyProps();

            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, getStoreState());
                component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                     store={ mockedStore }
                                                                                     withRef={ true }>
                                                             <ActionComponent {...props} />
                                                         </ParentComponentWithContext>);
            });

            it('set state to processing', () => {
                const stripeComponent = component.refs.childElement;
                stripeComponent.state.state.should.eq('offered');
                stripeComponent.onStripeClick();
                stripeComponent.state.state.should.eq('processing');
            });
        });



        describe('onStripeClose', () => {
            const props = getBuyProps({
                state: 'processing'
            });

            beforeEach(() => {
                mockedStore = mockAppStore(sandbox, getStoreState());
                component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                     store={ mockedStore }
                                                                                     withRef={ true }>
                                                             <ActionComponent {...props} />
                                                         </ParentComponentWithContext>);
            });

            it('should set state to offered if no token', () => {
                const stripeComponent = component.refs.childElement;
                stripeComponent.state.state.should.eq('processing');
                stripeComponent.state.hasToken = false;
                stripeComponent.onStripeClose();
                stripeComponent.state.state.should.eq('offered');
            });

            it('should do nothing if token', () => {
                const stripeComponent = component.refs.childElement;
                stripeComponent.state.state.should.eq('processing');
                stripeComponent.state.hasToken = true;
                stripeComponent.onStripeClose();
                stripeComponent.state.state.should.eq('processing');
            });
        });
    });

    // Re-visit this test after fixing link fallback
    xdescribe('buy action without stripe keys', () => {
        const props = getBuyProps();
        const context = getContext({
            app: {
                stripe: {
                    appName: 'app-name',
                    iconUrl: 'iconUrl'
                }
            }
        });

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                 store={ mockedStore }>
                                                         <ActionComponent {...props} />
                                                     </ParentComponentWithContext>);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link', () => {
            const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            link.textContent = 'action text';
            link.href = 'fallback uri';
            link.target = '_blank';
        });
    });

    describe('postback action', () => {
        const props = getPostbackProps();
        const context = getContext();

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, getStoreState());
            component = TestUtils.renderIntoDocument(<ParentComponentWithContext context={ context }
                                                                                 store={ mockedStore }>
                                                         <ActionComponent {...props} />
                                                     </ParentComponentWithContext>);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a postback', () => {
            componentNode.textContent.should.eq('postback text');
        });

        it('should call the postPostback action on button click', () => {
            const button = TestUtils.findRenderedDOMComponentWithTag(component, 'button');
            TestUtils.Simulate.click(button);
            conversationService.postPostback.should.have.been.calledOnce;
        });
    });
});
