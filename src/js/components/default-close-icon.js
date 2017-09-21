import React, { Component, PropTypes } from 'react';

import {SK_DARK_CONTRAST} from '../constants/styles';

export class DefaultCloseIcon extends Component {
    static propTypes = {
        isBrandColorDark: PropTypes.bool
    };

    render() {
        const {isBrandColorDark,} = this.props;

        return (
            <svg
                width='15px'
                height='15px'
                viewBox='0 0 15 15'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
            >
                <defs></defs>
                <g id='Design' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' stroke-linecap='round'
                   stroke-linejoin='round'>
                    <g id='customizable' transform='translate(-580.000000, -4777.000000)' stroke={ isBrandColorDark ? '#fff' : SK_DARK_CONTRAST } stroke-width='2'>
                        <g id='5-1-Whispers' transform='translate(247.000000, 4423.000000)'>
                            <g id='Close' transform='translate(305.000000, 326.000000)'>
                                <g id='close' transform='translate(29.000000, 29.000000)'>
                                    <path d='M13,0 L0,13' id='Shape'></path>
                                    <path d='M13,13 L0,0' id='Shape'></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}
