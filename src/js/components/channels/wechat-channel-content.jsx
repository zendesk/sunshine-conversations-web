import React, { Component, PropTypes } from 'react';
import { getQRCode } from '../../services/wechat-service';
import { LoadingComponent } from '../../components/loading';

export class WeChatChannelContent extends Component {
    static contextTypes = {
        ui: PropTypes.object
    };

    state = {
        hasError: false,
        qrcode: ''
    };

    fetchQRCode = () => {
        this.setState({
            hasError: false
        });

        getQRCode()
            .then(({url}) => {
                this.setState({
                    qrcode: url
                });
            })
            .catch(() => {
                this.setState({
                    hasError: true
                });
            });
    };

    componentDidMount() {
        this.fetchQRCode();
    }

    render() {
        if (this.state.hasError) {
            return <a className= { 'sk-error-link' }
                        onClick={ this.fetchQRCode }>
                       { this.context.ui.text.wechatQRCodeError }
                   </a>;
        }

        if (this.state.qrcode) {
            return <img style={ { width: '40%' } }
                        src={ this.state.qrcode } />;
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
