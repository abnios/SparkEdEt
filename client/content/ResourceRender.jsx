import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Video from './Video.jsx';
import PDF from './Pdf.jsx';


export default class ResourceRender extends Component{

  render(){
  var resource = this.props.resource;
  if(resource.type === 'video'){
    return(
      <Video  video={resource} />
    )
  }else if(resource.type === 'pdf' || resource.type === 'docx'){

  return(
      <PDF  pdf={resource} />
  )
  }
  }
}

ResourceRender.propTypes = {
  resource: PropTypes.object.isRequired,
}
