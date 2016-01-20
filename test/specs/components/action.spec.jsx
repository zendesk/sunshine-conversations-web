import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { mockAppStore } from 'test/utils/redux';
import { mockComponent, findRenderedDOMComponentsWithId } from 'test/utils/react';

import StripeCheckout from 'react-stripe-checkout';

import { ActionComponent } from 'components/action.jsx';
import { LoadingComponent } from 'components/loading.jsx';

const stripeService = require('services/stripe-service');
const userService = require('services/user-service');

const sandbox = sinon.sandbox.create();

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
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        mockedStore.restore();
    });

    describe('normal action link', () => {
        const props = {
            app: {},
            text: 'action text',
            uri: 'action uri'
        };

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
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
        const props = {
            app: {},
            text: 'action text',
            uri: 'javascript:someAction()'
        };

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link with target self', () => {
            const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            link.textContent = 'action text';
            link.href = 'javascript:someAction()';
            link.target = '_self';
        });
    });

    describe('buy action with stripe keys and offered state', () => {
        const props = {
            type: 'buy',
            text: 'action text',
            uri: 'fallback uri',
            currency: 'usd',
            state: 'offered'
        };

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, {
                app: {
                    publicKeys: {
                        stripe: 'stripe key'
                    },
                    stripe: {
                        appName: 'Fake app',
                        iconUrl: 'fakeicon'
                    }
                },
                user: {
                    email: ''
                }
            });

            component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
        });

        it('should render a Stripe button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedStripe').length.should.be.eq(1);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedLoading').length.should.be.eq(0);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-action-paid').length.should.be.eq(0);
            componentNode.textContent.should.eq('action text');
        });
    });

    describe('buy action with stripe keys and processing state', () => {
        const props = {
            type: 'buy',
            text: 'action text',
            uri: 'fallback uri',
            currency: 'usd',
            state: 'processing'
        };

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, {
                app: {
                    publicKeys: {
                        stripe: 'stripe key'
                    },
                    stripe: {
                        appName: 'Fake app',
                        iconUrl: 'fakeicon'
                    }
                },
                user: {
                    email: ''
                }
            });

            component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
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
        const props = {
            type: 'buy',
            text: 'action text',
            uri: 'fallback uri',
            currency: 'usd',
            state: 'paid'
        };

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, {
                app: {
                    publicKeys: {
                        stripe: 'stripe key'
                    },
                    stripe: {
                        appName: 'Fake app',
                        iconUrl: 'fakeicon'
                    }
                },
                user: {
                    email: ''
                },
                ui: {
                    text: {
                        actionPaymentCompleted: 'payment completed text'
                    }
                }
            });

            component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should a payment completed button', () => {
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'btn-sk-action-paid').length.should.be.eq(1);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedStripe').length.should.be.eq(0);
            TestUtils.scryRenderedDOMComponentsWithClass(component, 'mockedLoading').length.should.be.eq(0);
            componentNode.textContent.should.eq('payment completed text');
        });
    });

    describe('buy action without stripe keys', () => {
        const props = {
            type: 'buy',
            text: 'action text',
            uri: 'fallback uri',
            currency: 'usd',
            state: 'paid'
        };

        beforeEach(() => {
            mockedStore = mockAppStore(sandbox, {
                app: {
                    publicKeys: {},
                    stripe: {
                        appName: 'Fake app',
                        iconUrl: 'fakeicon'
                    }
                },
                user: {
                    email: ''
                },
                ui: {
                    text: {
                        actionPaymentCompleted: 'payment completed text'
                    }
                }
            });

            component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
            componentNode = ReactDOM.findDOMNode(component);
        });

        it('should render a link', () => {
            const link = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
            link.textContent = 'action text';
            link.href = 'fallback uri';
            link.target = '_blank';
        });
    });

    describe('onStripeToken', () => {

        describe('user has no email', () => {
            const props = {
                _id: 'action id',
                type: 'buy',
                text: 'action text',
                uri: 'fallback uri',
                currency: 'usd',
                state: 'paid'
            };

            beforeEach(() => {

                mockedStore = mockAppStore(sandbox, {
                    app: {
                        publicKeys: {},
                        stripe: {
                            appName: 'Fake app',
                            iconUrl: 'fakeicon'
                        }
                    },
                    user: {
                        email: ''
                    },
                    ui: {
                        text: {
                            actionPaymentCompleted: 'payment completed text'
                        }
                    }
                });

                component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
                componentNode = ReactDOM.findDOMNode(component);

                sandbox.stub(stripeService, 'createTransaction');
                stripeService.createTransaction.resolves();
            });

            it('call user update', () => {
                return component.onStripeToken({
                    email: 'email'
                }).then(() => {
                    userService.immediateUpdate.should.have.been.calledWith({
                        email: 'email'
                    });
                });
            });
        });

        describe('user has email', () => {
            const props = {
                _id: 'action id',
                type: 'buy',
                text: 'action text',
                uri: 'fallback uri',
                currency: 'usd',
                state: 'paid'
            };

            beforeEach(() => {

                mockedStore = mockAppStore(sandbox, {
                    app: {
                        publicKeys: {},
                        stripe: {
                            appName: 'Fake app',
                            iconUrl: 'fakeicon'
                        }
                    },
                    user: {
                        email: 'test'
                    },
                    ui: {
                        text: {
                            actionPaymentCompleted: 'payment completed text'
                        }
                    }
                });

                component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
                componentNode = ReactDOM.findDOMNode(component);

                sandbox.stub(stripeService, 'createTransaction');
                stripeService.createTransaction.resolves();
            });

            it('call user update', () => {
                return component.onStripeToken({
                    email: 'email'
                }).then(() => {
                    userService.immediateUpdate.should.not.have.been.called;
                });
            });
        });

        describe('create transaction success', () => {
            const props = {
                _id: 'action id',
                type: 'buy',
                text: 'action text',
                uri: 'fallback uri',
                currency: 'usd',
                state: 'processing'
            };

            beforeEach(() => {

                mockedStore = mockAppStore(sandbox, {
                    app: {
                        publicKeys: {},
                        stripe: {
                            appName: 'Fake app',
                            iconUrl: 'fakeicon'
                        }
                    },
                    user: {
                        email: 'test'
                    },
                    ui: {
                        text: {
                            actionPaymentCompleted: 'payment completed text'
                        }
                    }
                });

                component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);

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
            const props = {
                _id: 'action id',
                type: 'buy',
                text: 'action text',
                uri: 'fallback uri',
                currency: 'usd',
                state: 'processing'
            };

            beforeEach(() => {

                mockedStore = mockAppStore(sandbox, {
                    app: {
                        publicKeys: {},
                        stripe: {
                            appName: 'Fake app',
                            iconUrl: 'fakeicon'
                        }
                    },
                    user: {
                        email: 'test'
                    },
                    ui: {
                        text: {
                            actionPaymentCompleted: 'payment completed text'
                        }
                    }
                });

                component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);

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
        const props = {
            _id: 'action id',
            type: 'buy',
            text: 'action text',
            uri: 'fallback uri',
            currency: 'usd',
            state: 'offered'
        };

        beforeEach(() => {

            mockedStore = mockAppStore(sandbox, {
                app: {
                    publicKeys: {},
                    stripe: {
                        appName: 'Fake app',
                        iconUrl: 'fakeicon'
                    }
                },
                user: {
                    email: ''
                },
                ui: {
                    text: {
                        actionPaymentCompleted: 'payment completed text'
                    }
                }
            });

            component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
        });

        it('set state to processing', () => {
            component.state.state.should.eq('offered');
            component.onStripeClick();
            component.state.state.should.eq('processing');
        });
    });



    describe('onStripeClose', () => {
        const props = {
            _id: 'action id',
            type: 'buy',
            text: 'action text',
            uri: 'fallback uri',
            currency: 'usd',
            state: 'processing'
        };

        beforeEach(() => {

            mockedStore = mockAppStore(sandbox, {
                app: {
                    publicKeys: {},
                    stripe: {
                        appName: 'Fake app',
                        iconUrl: 'fakeicon'
                    }
                },
                user: {
                    email: ''
                },
                ui: {
                    text: {
                        actionPaymentCompleted: 'payment completed text'
                    }
                }
            });

            component = TestUtils.renderIntoDocument(<ActionComponent {...props} />);
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
