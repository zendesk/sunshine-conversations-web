import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uploadImage } from '../services/conversation';

import { preventDefault } from '../utils/events';

export class ImageUploadComponent extends Component {
    state = {
      imageButtonHovered: false
    };

    onImageChange = (e) => {
        e.preventDefault();
        const {dispatch} = this.props;
        const files = this.refs.fileInput.files;
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
            this.refs.imageUploadForm.reset();
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
        const style = {};

        if (this.props.color && this.state.imageButtonHovered) {
            style.color = `#${this.props.color}`;
        }
        return <label className='btn btn-sk-link image-upload'
                      onMouseOver={ () => this.onMouseOver() }
                      onMouseOut={ () => this.onMouseOut() }
                      style={ style }>
                   <form ref='imageUploadForm'
                         onSubmit={ preventDefault }>
                       <input type='file'
                              accept='image/*'
                              onChange={ this.onImageChange }
                              ref='fileInput' />
                   </form>
                   <i className='fa fa-camera'></i>
               </label>;
    }
}

export const ImageUpload = connect()(ImageUploadComponent);
