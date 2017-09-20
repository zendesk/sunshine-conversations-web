import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {SK_DARK_CONTRAST} from '../constants/styles';

export class DefaultCloseIconComponent extends Component {
    static propTypes = {
        isBrandColorDark: PropTypes.bool.isRequired,
        location: PropTypes.object.isRequired
    };

    render() {
        const {isBrandColorDark, location} = this.props;

        const {protocol, host, pathname, search} = location;

        return (
            <svg
                width='15px'
                height='15px'
                viewBox='0 0 15 15'
                version='1.1'
                xmlns='http://www.w3.org/2000/svg'
            >
                <defs></defs>
                <g id='Desing' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' stroke-linecap='round'
                   stroke-linejoin='round'>
                    <g id='Chat-2' transform='translate(-580.000000, -4777.000000)' stroke='#FFFFFF' stroke-width='2'>
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
                   <path fill={ isBrandColorDark ? '#fff' : SK_DARK_CONTRAST }
                         filter={ `url(${protocol}//${host}${pathname}${search}#33c9df204aeec9aa096f1fd360bd4160)` }
                         d='M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50h30.8l0-10.6C92.5,80.2,100,66,100,50C100,22.4,77.6,0,50,0z M32,54.5 c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5C36.5,52.5,34.5,54.5,32,54.5z M50,54.5c-2.5,0-4.5-2-4.5-4.5 c0-2.5,2-4.5,4.5-4.5c2.5,0,4.5,2,4.5,4.5C54.5,52.5,52.5,54.5,50,54.5z M68,54.5c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5 s4.5,2,4.5,4.5C72.5,52.5,70.5,54.5,68,54.5z' />
            </svg>
        );
    }
}

export const DefaultCloseIcon = connect(({browser: {currentLocation}}) => {
    return {
        location: currentLocation
    };
})(DefaultCloseIconComponent);
