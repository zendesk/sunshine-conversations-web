import React, { Component } from 'react';
import { SK_PURPLE } from '../constants/styles';

export class DefaultAppIcon extends Component {
    static defaultProps = {
        style: {
            fill: SK_PURPLE
        }
    };

    render() {
        const {color, style} = this.props;

        if (color) {
            style.fill = `#${color}`;
        }

        return <svg className='app-icon'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 80 80'>
                   <title>
                       defaultBusiness
                   </title>
                   <rect x='31.27'
                         y='39.48'
                         width='4.36'
                         height='4.36'
                         style={ style } />
                   <rect x='31.27'
                         y='30.75'
                         width='4.36'
                         height='5.82'
                         style={ style } />
                   <path d='M48.73,52.57V46.75H44.36v33a39.75,39.75,0,0,0,8.73-2V52.57H48.73Z'
                         style={ style } />
                   <path d='M56,64.2V76.66a39.92,39.92,0,0,0,5.82-3.14V64.2H56Z'
                         style={ style } />
                   <path d='M18.18,64.2v9.31A39.88,39.88,0,0,0,24,76.66V64.2H18.18Z'
                         style={ style } />
                   <path d='M38.55,46.75V80c0.48,0,1,0,1.45,0s1,0,1.45,0V46.75H38.55Z'
                         style={ style } />
                   <path d='M31.27,46.75v5.82H26.91V77.8a39.76,39.76,0,0,0,8.73,2v-33H31.27Z'
                         style={ style } />
                   <rect x='44.36'
                         y='30.75'
                         width='4.36'
                         height='5.82'
                         style={ style } />
                   <rect x='38.55'
                         y='39.48'
                         width='2.91'
                         height='4.36'
                         style={ style } />
                   <path d='M80,40A40,40,0,1,0,15.27,71.43V59.71a1.33,1.33,0,0,1,1.33-1.33h4.48V51a1.33,1.33,0,0,1,1.33-1.32h4.49V26.26a1.33,1.33,0,0,1,1.33-1.33h7.4V19A1.33,1.33,0,0,1,37,17.66h1.58V7.48a1.45,1.45,0,1,1,2.91,0V17.66H43A1.33,1.33,0,0,1,44.36,19v5.95h7.4a1.33,1.33,0,0,1,1.33,1.33v23.4h4.84A1.33,1.33,0,0,1,59.25,51l0,7.64H63.4a1.33,1.33,0,0,1,1.33,1.33V71.43A39.92,39.92,0,0,0,80,40Z'
                         style={ style } />
                   <rect x='38.55'
                         y='30.75'
                         width='2.91'
                         height='5.82'
                         style={ style } />
                   <rect x='44.36'
                         y='39.48'
                         width='4.36'
                         height='4.36'
                         style={ style } />
               </svg>;
    }
}
