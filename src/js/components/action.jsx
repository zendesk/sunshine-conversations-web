import React, { Component, PropTypes } from 'react';
import StripeCheckout from 'react-stripe-checkout';

import { store } from '../stores/app-store';
import { createTransaction } from '../services/stripe-service';
import { immediateUpdate } from '../services/user-service';
import { postPostback } from '../services/conversation-service';

import { getIntegration } from '../utils/app';

import { LoadingComponent } from './loading';

export class ActionComponent extends Component {
    static contextTypes = {
        app: PropTypes.object
    };

    constructor(...args) {
        super(...args);

        this.state = {
            state: this.props.state,
            hasToken: false
        };
    }

    onPostbackClick = () => {
        this.setState({
            state: 'processing'
        });

        postPostback(this.props._id).then(() => {
            this.setState({
                state: ''
            });
        })
        .catch(() => {
            this.setState({
                state: ''
            });
        });
    };

    onStripeToken(token) {
        this.setState({
            hasToken: true
        });

        const user = store.getState().user;
        const promises = [];
        if (!user.email) {
            promises.push(immediateUpdate({
                email: token.email
            }));
        }

        const transactionPromise = createTransaction(this.props._id, token.id).then(() => {
            this.setState({
                state: 'paid'
            });
        }).catch(() => {
            this.setState({
                state: 'offered'
            });
        });

        promises.push(transactionPromise);

        return Promise.all(promises);
    }

    onStripeClick() {
        this.setState({
            state: 'processing'
        });
    }

    onStripeClose() {
        if (!this.state.hasToken) {
            this.setState({
                state: 'offered'
            });
        }
    }

    render() {
        const {app} = this.context;
        const stripeIntegration = getIntegration(app.integrations, 'stripe');

        let style = {};
        if (this.props.buttonColor) {
            style.backgroundColor = style.borderColor = `#${this.props.buttonColor}`;
        }

        // the public key is necessary to use with Checkout
        // use the link fallback if this happens
        if (this.props.type === 'buy' && stripeIntegration) {
            const user = store.getState().user;

            // let's change this when we support other providers
            const stripeAccount = app.stripe;
            const actionState = this.state.state;
            if (actionState === 'offered') {
                return (
                    <StripeCheckout componentClass='div'
                                    className='sk-action'
                                    token={ this.onStripeToken.bind(this) }
                                    stripeKey={ stripeIntegration.publicKey }
                                    email={ user.email }
                                    amount={ this.props.amount }
                                    currency={ this.props.currency.toUpperCase() }
                                    name={ stripeAccount.appName }
                                    image={ stripeAccount.iconUrl }
                                    closed={ this.onStripeClose.bind(this) }>
                        <button className='btn btn-sk-primary'
                                onClick={ this.onStripeClick.bind(this) }
                                style={ style }>
                            { this.props.text }
                        </button>
                    </StripeCheckout>
                    );
            } else {
                const text = actionState === 'paid' ?
                    store.getState().ui.text.actionPaymentCompleted :
                    <LoadingComponent />;

                if (actionState === 'paid') {
                    style = {};
                }

                return (
                    <div className='sk-action'>
                        <div className={ `btn btn-sk-action-${actionState}` }
                             style={ style }>
                            { text }
                        </div>
                    </div>
                    );
            }
        } else if (this.props.type === 'postback') {
            const isProcessing = this.state.state === 'processing';
            const text = isProcessing ?
                <LoadingComponent /> :
                this.props.text;

            return (
                <div className='sk-action'>
                    <button className='btn btn-sk-primary'
                            style={ style }
                            onClick={ !isProcessing && this.onPostbackClick }>
                            { text }
                    </button>
                </div>
                );
        } else {
            const isJavascript = this.props.uri.startsWith('javascript:');

            return (
                <div className='sk-action'>
                    <a className='btn btn-sk-primary'
                       href={ this.props.uri }
                       target={ isJavascript ? '_self' : '_blank' }
                       style={ style }>
                        { this.props.text }
                    </a>
                </div>
                );
        }
    }
}
