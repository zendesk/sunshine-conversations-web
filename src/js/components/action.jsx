import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';

import { store } from 'stores/app-store';
import { createTransaction } from 'services/stripe-service';
import { immediateUpdate } from 'services/user-service';

import { LoadingComponent } from 'components/loading';

export class ActionComponent extends Component {
    constructor(...args) {
        super(...args);

        this.state = {
            state: this.props.state,
            hasToken: false
        };
    }

    onStripeToken(token) {
        this.setState({
            hasToken: true
        });

        let user = store.getState().user;
        let promises = [];
        if (!user.email) {
            promises.push(immediateUpdate({
                email: token.email
            }));
        }

        let transactionPromise = createTransaction(this.props._id, token.id).then(() => {
            this.setState({
                state: 'paid'
            });
        }).catch((err) => {
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
        let publicKeys = store.getState().app.publicKeys;

        // the public key is necessary to use with Checkout
        // use the link fallback if this happens
        if (this.props.type === 'buy' && publicKeys.stripe) {
            let user = store.getState().user;

            // let's change this when we support other providers
            let stripeAccount = store.getState().app.stripe;
            let actionState = this.state.state;
            if (actionState === 'offered') {
                return (
                    <StripeCheckout componentClass='div'
                                    className='sk-action'
                                    token={ this.onStripeToken.bind(this) }
                                    stripeKey={ publicKeys.stripe }
                                    email={ user.email }
                                    amount={ this.props.amount }
                                    currency={ this.props.currency.toUpperCase() }
                                    name={ stripeAccount.appName }
                                    image={ stripeAccount.iconUrl }
                                    closed={ this.onStripeClose.bind(this) }>
                        <button className='btn btn-sk-primary' onClick={ this.onStripeClick.bind(this) }>
                            { this.props.text }
                        </button>
                    </StripeCheckout>
                    );
            } else {
                let text = actionState === 'paid' ?
                    store.getState().ui.text.actionPaymentCompleted :
                    <LoadingComponent />;

                return (
                    <div className='sk-action'>
                        <div className={ `btn btn-sk-action-${actionState}` }>
                            { text }
                        </div>
                    </div>
                    );
            }
        } else {
            let isJavascript = this.props.uri.startsWith('javascript:');

            return (
                <div className='sk-action'>
                    <a className='btn btn-sk-primary' href={ this.props.uri } target={ isJavascript ? '_self' : '_blank' }>
                        { this.props.text }
                    </a>
                </div>
                );
        }
    }
}
