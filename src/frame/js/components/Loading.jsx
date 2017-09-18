import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Loading extends Component {
    static propTypes = {
        color: PropTypes.string,
        dark: PropTypes.bool,
        style: PropTypes.object
    };

    render() {
        const classNames = ['fading-circle'];
        const {color, dark, style} = this.props;
        const innerCircleStyle = { };

        if (dark) {
            classNames.push('dark');
        }

        if (color) {
            innerCircleStyle.backgroundColor = `#${this.props.color}`;
        }

        const circles = [];

        for (let i = 1; i < 13; i++) {
            circles.push(<div className={ `circle${i} circle` }
                              key={ i }>
                             <div className='inner-circle'
                                  style={ innerCircleStyle } />
                         </div>);
        }

        return <div style={ style }
                    className={ classNames.join(' ') }>
                   { circles }
               </div>;
    }
}
