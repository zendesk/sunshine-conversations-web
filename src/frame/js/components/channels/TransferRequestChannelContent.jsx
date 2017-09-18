import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

import Loading from '../Loading';
import { resetTransferRequestCode, unsetError } from '../../actions/integrations';
import { hideChannelPage } from '../../actions/app-state';
import { fetchTransferRequestCode } from '../../actions/integrations';

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
        const {channelState, url, transferError} = this.props;
        const {transferRequestCode, hasError} = channelState;

        if (hasError) {
            return <a className='error-link'
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

        return <Loading dark={ true }
                        style={ loadingStyle } />;
    }
}

export default connect(({ui: {text}}) => {
    return {
        transferError: text.transferError
    };
})(TransferRequestChannelContentComponent);
