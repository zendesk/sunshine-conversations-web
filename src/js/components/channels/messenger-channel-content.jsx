import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { hideChannelPage } from '../../services/app';
import { LoadingComponent } from '../../components/loading';
import { resetTransferRequestCode, unsetError } from '../../actions/integrations-actions';
import { fetchTransferRequestCode } from '../../services/integrations';

export class MessengerChannelContentComponent extends Component {

    static propTypes = {
        channelState: PropTypes.object.isRequired,
        pageId: PropTypes.string.isRequired,
		transferRequestCodeError: PropTypes.string
    };

    onLink = () => {
        const {dispatch, type} = this.props;
        dispatch(resetTransferRequestCode(type));
        dispatch(hideChannelPage());
    }

    onTryAgain = () => {
        const {dispatch, type} = this.props;
        dispatch(unsetError(type));
        dispatch(resetTransferRequestCode(type));
        dispatch(fetchTransferRequestCode('messenger'));
    }

    render() {
        const {channelState: {transferRequestCode, hasError}, transferError, pageId} = this.props;

        if (hasError) {
            return <a className={ 'sk-error-link' }
                      onClick={ this.onTryAgain }>
                      { transferError }
                   </a>;
        }

        if (transferRequestCode) {
            const url = `https://m.me/${pageId}?ref=${transferRequestCode}`;
            return <a alt='Connect'
                      target='_blank'
                      onClick={ this.onLink }
                      href={ url }>Connect</a>;
        }

        const loadingStyle = {
            height: 40,
            width: 40,
            margin: 'auto'
        };

        return <LoadingComponent dark={ true }
                                 style={ loadingStyle } />;
    }
}

export const MessengerChannelContent = connect(({ui: {text}}) => {
    return {
        transferError: text.transferError
    };
})(MessengerChannelContentComponent );
