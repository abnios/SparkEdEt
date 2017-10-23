import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

export default class Video extends Component{

  render(){
    return(
      <div  className="videoViewerContainer">
        <video controls className="videoViewer">
          <source src={'/uploads/'+this.props.video.file} type="video/mp4"/>
          Your browser does not support the video tag.
        </video>
      </div>

    )
  }

}

Video.propTypes = {
  video: PropTypes.object.isRequired,
}
