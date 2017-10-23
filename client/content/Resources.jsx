import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Resource from './Resource.jsx';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { _Resources } from '../../Collections/collections.js';


//display Resources based in the topic clicked
export  class Resources extends Component {

  constructor(){
    super();

  }

renderResources(){

    if(this.props.resources === undefined){
      return null;
    }

    var fileType = null;
    var hr = false;
    var index =0;

    return this.props.resources.map((resource)=>{

      if(fileType === null){
        fileType = resource.file.type;
      }else if (fileType !== resource.file.type) {
        fileType = resource.file.type;
        hr = true;

      }else{
        fileType = resource.file.type;
        hr = false;
      }

    return (
        <div key={index++}>
            <Resource hr={hr}  resource={resource} />
      </div>
    )
    })
  }

render() {
return(
    <div>
    <h2>{this.props.topic}</h2>
        <div className='row'>
        		{this.renderResources()}
        </div>
    </div>
);
}
}

Resources.propTypes = {
//	topic: PropTypes.string.isRequired,
	topicId: PropTypes.string.isRequired,
};

export default createContainer((params) => {
Meteor.subscribe('resources');
  return {
    resources:_Resources.find({topicId:params.topicId},{sort:{'file.type':1}}).fetch(),
  }
},Resources);
