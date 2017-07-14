import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export class LocationIconComponent extends Component {
    static propTypes = {
        settings: PropTypes.object.isRequired
    };

    render() {
        const {settings: {accentColor}} = this.props;
        const backgroundFill = `#${accentColor}`;

        return <svg className='sk-location-icon'
                    fill={ backgroundFill }
                    viewBox='0 0 127.9 127.9'>
                   <g>
                       <ellipse cx='64'
                                cy='58.9'
                                rx='12'
                                ry='11.9' />
                       <path d='M64,0.5C28.9,0.5,0.5,28.9,0.5,64c0,35,28.4,63.5,63.5,63.5c35,0,63.5-28.4,63.5-63.5 C127.4,28.9,99,0.5,64,0.5z M67.9,99.9c-2.2,2.4-5.9,2.4-8.1,0.2C48.1,88.2,35.2,73.5,35.2,59.5c0-15.8,12.9-28.6,28.8-28.6 c15.9,0,28.8,12.8,28.8,28.6C92.9,73.4,78.6,88.2,67.9,99.9z' />
                   </g>
               </svg>;
    }
}

export default connect(({app}) => {
    return {
        settings: app.settings.web
    };
})(LocationIconComponent);
