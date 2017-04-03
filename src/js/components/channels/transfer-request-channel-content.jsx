import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import { hideChannelPage } from '../../services/app';
import { LoadingComponent } from '../../components/loading';
import { resetTransferRequestCode, unsetError } from '../../actions/integrations-actions';
import { fetchTransferRequestCode } from '../../services/integrations';

export class TransferRequestChannelContentComponent extends Component {

    static propTypes = {
        url: PropTypes.string.isRequired,
        channelState: PropTypes.object.isRequired,
        transferError: PropTypes.string
    };

    onLink = () => {
        const {dispatch, type} = this.props;
        dispatch(resetTransferRequestCode(type));
        dispatch(hideChannelPage());
    }

    onTryAgain = () => {
        const {dispatch, type} = this.props;
        dispatch(batchActions([
            unsetError(type),
            resetTransferRequestCode(type)
        ]));
        dispatch(fetchTransferRequestCode(type));
    }

    render() {
        const {type, channelState, url, transferError} = this.props;
        const {transferRequestCode, hasError} = channelState;

        if (hasError) {
            return <a className={ 'sk-error-link' }
                      onClick={ this.onTryAgain }>
                       { transferError }
                   </a>;
        }

        if (transferRequestCode) {
            return <a alt='Connect'
                      target='_blank'
                      onClick={ this.onLink }
                      href={ url }>Connect</a>;
        }

        const loadingStyle = {
            height: '40px',
            width: '40px',
            margin: 'auto'
        };

        return <LoadingComponent dark={ true }
                                 style={ loadingStyle } />;
    }
}

export const TransferRequestChannelContent = connect(({ui: {text}}) => {
    return {
        transferError: text.transferError
    };
})(TransferRequestChannelContentComponent);
