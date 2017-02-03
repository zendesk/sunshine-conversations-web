import React, { Component } from 'react';

export class LoadingComponent extends Component {
    render() {
        const classNames = ['sk-fading-circle'];
        const {color, dark, style} = this.props;
        const innerCircleStyle = { };

        if (dark) {
            classNames.push('dark');
        }

        if (color) {
            innerCircleStyle.backgroundColor = `#${this.props.color}`;
        }

        return (
            <div style={ style }
                 className={ classNames.join(' ') }>
                <div className='sk-circle1 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle2 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle3 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle4 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle5 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle6 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle7 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle8 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle9 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle10 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle11 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
                <div className='sk-circle12 sk-circle'>
                    <div className='sk-inner-circle'
                         style={ innerCircleStyle } />
                </div>
            </div>
            );
    }
}
