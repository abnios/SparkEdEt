import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { _Resources } from '../../Collections/collections.js';
// import Topics from './Topics.jsx';
import Header from '../layouts/Header.jsx';
import Footer from '../layouts/Footer.jsx';
import ViewFrame from '../content/ViewFrame.jsx';
import Video from '../content/Video.jsx';
import ResourceRender from '../content/ResourceRender.jsx';
import Sidenav from './Sidenav.jsx';

export class DisplayResource extends Component{


    extractFileType(data){
        let fileTypeData =data.split('/');

        var type = fileTypeData[0];
        if(type == 'application' ){
          type =fileTypeData[1];
        }
        return type;
        }


  fetchResource(){

      var resource =this.props.resource;

      if(resource == undefined){
        resource  = null;
      }
      return resource;
      }

  renderResource(){

  var resource = this.fetchResource();
    if(resource == null){
      return null;
    }else{
      let name =resource.name;
      let typeData = resource.file.type;
      let file = resource.file.name;
    //  let url = resource.file.url;

    let type =this.extractFileType(typeData);

      var resource = {type:type,name:name,file:file};
      return(
        <ResourceRender  resource={resource} />
      )
        }
      }

  render(){
    var resourceName = '';
    var resourceType = '';
    var resource = this.props.resource;
    if(resource){
      resourceName = resource.name;
      resourceType = resource.file.type.split('/')[1];

    }


    return(
      <div>
        <Header />
        <div className="row">
          <div className="col s3">
            <Sidenav active={7}/>

          </div>
          <div className="col s1">

          </div>


          <div className="col s8">
            <h4 className="blue-text text-lighten-1 center">{resourceName} ({resourceType}) </h4><span className="right grey-text"></span>


            <div className="">
              {this.renderResource()}

            </div>

          </div>
        </div>
      </div>

    )
  }

}


export function getResourceId(){
  return FlowRouter.getParam('_id');
}

export default createContainer(()=>{
  Meteor.subscribe('resources');

  return {
    resource: _Resources.findOne({_id:getResourceId()}),
  }
}, DisplayResource)
