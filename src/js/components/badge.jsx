import React, { Component, PropTypes } from 'react';

class DefaultIcon extends Component {
    render() {
        const {badgeColorDark} = this.props;
        const style = {
            filter: `drop-shadow( -5px -5px 5px #${badgeColorDark ? 'fff': '000'} )`,
            fill: badgeColorDark ? '#fff' : '#000'
        };

        return <svg version='1.0'
                    x='0px'
                    y='0px'
                    viewBox='0 0 100 100'
                    className='default-icon'
                    style={ { enableBackground: 'new 0 0 100 100' } }>
                   <path style={ style }
                         d='M50,0C22.4,0,0,22.4,0,50s22.4,50,50,50h30.8l0-10.6C92.5,80.2,100,66,100,50C100,22.4,77.6,0,50,0z M32,54.5 c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5s4.5,2,4.5,4.5C36.5,52.5,34.5,54.5,32,54.5z M50,54.5c-2.5,0-4.5-2-4.5-4.5 c0-2.5,2-4.5,4.5-4.5c2.5,0,4.5,2,4.5,4.5C54.5,52.5,52.5,54.5,50,54.5z M68,54.5c-2.5,0-4.5-2-4.5-4.5c0-2.5,2-4.5,4.5-4.5 s4.5,2,4.5,4.5C72.5,52.5,70.5,54.5,68,54.5z' />
               </svg>;

    }
}

export class Badge extends Component {
    static contextTypes = {
        settings: PropTypes.object.isRequired
    };

    render() {
        const {settings: {badgeColor, badgeColorDark, badgeIconUrl}} = this.context;
        return <div className='sk-badge'>
                   <DefaultIcon badgeColorDark={ badgeColorDark } />
               </div>;
    }
}
