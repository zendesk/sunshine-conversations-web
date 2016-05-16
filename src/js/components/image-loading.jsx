import React from 'react';

export function ImageLoading({color} = {}) {
    const bounceStyle = {};

    if (color) {
        bounceStyle.backgroundColor = `#${color}`;
    }

    return <div className='image-overlay'>
               <div className='three-bounce spinner'>
                   <div className='bounce1'
                        style={ bounceStyle }></div>
                   <div className='bounce2'
                        style={ bounceStyle }></div>
                   <div className='bounce3'
                        style={ bounceStyle }></div>
               </div>
           </div>;
}
