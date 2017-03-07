import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';

import { uploadImage } from '../services/conversation';
import { preventDefault } from '../utils/events';

export class ImageUploadComponent extends Component {
    state = {
      imageButtonHovered: false
    };

    constructor(...args) {
        super(...args);
        bindAll(this,
            'onImageChange',
            'onMouseOver',
            'onMouseOut'
        );
    }

    onImageChange(e) {
        e.preventDefault();
        const {dispatch} = this.props;
        const files = this._fileInputNode.files;
        // we only allow one file in the input, but let's handle it
        // as if we supported multiple ones
        return Promise.all(Array.from(files).map((file) => {
            // catch it to prevent an unhandled promise exception
            return dispatch(uploadImage(file))
                .catch(() => {
                });
        })).then(() => {
            // if the file input is not reset, a user can't pick the same
            // file twice in a row.
            this._formNode.reset();
        });
    }


    onMouseOver() {
        this.setState({
            imageButtonHovered: true
        });
    }

    onMouseOut() {
        this.setState({
            imageButtonHovered: false
        });
    }

    render() {
        const styles = {
            form: {
                flex: '0 1 34px'
            },
            icon: {}
        };

        if (this.props.color && this.state.imageButtonHovered) {
            styles.icon.color = `#${this.props.color}`;
        }
        return <form ref={ (c) => this._formNode = findDOMNode(c) }
                     onSubmit={ preventDefault }
                     style={ styles.form }>
                   <label className='btn btn-sk-link image-upload'
                          htmlFor='sk-img-upload'
                          onMouseOver={ this.onMouseOver }
                          onMouseOut={ this.onMouseOut }
                          style={ styles.icon }
                          onClick={ (e) => {
                                        e.preventDefault();
                                        this._fileInputNode.click();
                                    } }>
                       <i className='fa fa-camera'></i>
                   </label>
                   <input type='file'
                          id='sk-img-upload'
                          accept='image/*'
                          onChange={ this.onImageChange }
                          ref={ (c) => this._fileInputNode = findDOMNode(c) } />
               </form>;
    }
}

export const ImageUpload = connect(null, null, null, {
    withRef: true
})(ImageUploadComponent);
