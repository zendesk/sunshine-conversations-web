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
            state: this.props.state
        };
    }

    onStripeToken(token) {
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

    render() {
        if (this.props.type === 'buy') {
            let user = store.getState().user;
            let publicKeys = store.getState().app.publicKeys;
            let actionState = this.state.state;
            if (actionState === 'offered') {
                return (
                    <StripeCheckout token={ this.onStripeToken.bind(this) }
                                    stripeKey={ publicKeys.stripe }
                                    email={ user.email }
                                    amount={ this.props.amount }
                                    currency={ this.props.currency.toUpperCase() }>
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
                    <div className={ `btn btn-sk-action-${actionState}` }>
                        { text }
                    </div>
                    );
            }
        } else {
            return (
                <div className='sk-action'>
                    <a className='btn btn-sk-primary' href={ this.props.uri } target='_blank'>
                        { this.props.text }
                    </a>
                </div>
                );
        }
    }
}
