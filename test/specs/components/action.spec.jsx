import sinon from 'sinon';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { getMockedStore } from 'test/utils/redux';
import { mockComponent, findRenderedDOMComponentsWithId } from 'test/utils/react';

import StripeCheckout from 'react-stripe-checkout';

import { ActionComponent } from 'components/action.jsx';
import { LoadingComponent } from 'components/loading.jsx';

const AppStore = require('stores/app-store');

const store = AppStore.store;

function mockStore(s, state = {}) {
    var mockedStore = getMockedStore(s, state);

    Object.defineProperty(AppStore, 'store', {
        get: () => {
            return mockedStore;
        }
    });

    return mockedStore;
}

const sandbox = sinon.sandbox.create();

describe('Action', () => {
    let component;
    let componentNode;
    let store;

    beforeEach(() => {
        mockComponent(sandbox, StripeCheckout, 'div', {
            className: 'mockedStripe'
        });
        mockComponent(sandbox, LoadingComponent, 'div', {
            className: 'mockedLoading'
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        Object.defineProperty(AppStore, 'store', {
            get: () => {
                return store;
            }
        });
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
            currency: 'USD',
            state: 'offered'
        };

        beforeEach(() => {
            mockStore(sandbox, {
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
            currency: 'USD',
            state: 'processing'
        };

        beforeEach(() => {
            mockStore(sandbox, {
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
            currency: 'USD',
            state: 'paid'
        };

        beforeEach(() => {
            mockStore(sandbox, {
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

    describe('buy action without stripe keys and paid state', () => {
        const props = {
            type: 'buy',
            text: 'action text',
            uri: 'fallback uri',
            currency: 'USD',
            state: 'paid'
        };

        beforeEach(() => {
            mockStore(sandbox, {
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
});
