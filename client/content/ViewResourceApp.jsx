import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { _Resources } from '../../Collections/collections.js';
import Topics from './Topics.jsx';
import Header from '../layouts/Header.jsx';
import Footer from '../layouts/Footer.jsx';
import ViewFrame from './ViewFrame.jsx';
import Video from './Video.jsx';
import ResourceRender from './ResourceRender.jsx';
import { getCurrentUrl } from './ContentsApp.jsx';
import { insertStatistics } from '../Statistics/Statistics.jsx';
import { getBack, goForward } from '../Utilities/Utilities.jsx';
import { FloatingButton } from '../Utilities/Utilities.jsx';

export  class ViewResourceApp extends Component {
    extractFileType(data){
      let fileTypeData =data.split('/');
      var type = fileTypeData[0];
      if(type == 'application' ){
        type =fileTypeData[1];
      }
      return type;
    }
    componentDidMount(){
    }
    saveUsage(name){
      var id = FlowRouter.getQueryParam('rs');
      var material = name;
      var urlData = FlowRouter.current();
      var url = urlData.path;
      var user = Meteor.userId();
      var date = new Date();
      var page = 'RESOURCE';
      var data = {id:id,material:material,url:url,page:page,date:date,user:user};
      insertStatistics(data);
    }
    displayFeedback(event) {
      event.preventDefault();
      $('#feedback').openModal();
    }
    fetchResource(){
    let resource =this.props.resource;
    if(resource === undefined){
      resource  = null;
    }
    return resource;
  }
    renderResource(){
      let resource = this.fetchResource();
    if(resource === null){
      return null;
    }else{
      let name =resource.name;
      this.saveUsage(name);
      let typeData = resource.file.type;
      let file = resource.file.name;
    //  let url = resource.file.url;

    let type =this.extractFileType(typeData);
        resource = {type:type,name:name,file:file};
      return(
        <ResourceRender  resource={resource} />
      )
        }
      }
    fetchResources(){
    var data = this.props.resources;
    if(data.length == 0){
      data = [{id:0,topicId:0,name:'',
        file:{size:0,type:null,url:'#'}
      }];
    }
      return data;
  }
    getSectionName(){
      return this.props.sectionName;
    }
    getUrl(event){
        var sectionId = FlowRouter.getQueryParam('scid');
        if(!sectionId){
          $('.p-topics').hide();
        }
        var url  = '/contents/'+sectionId+'?rs='+FlowRouter.getParam('_id');
      return url;
    }
    render(){
    var sectionName = this.props.chapters;
      // console.log(sectionName);
    if(sectionName === undefined){
      sectionName = '';
    }
    else {
    sectionName =  sectionName.name;
    }
    return (
    <div className="fileResourceViewer">
        <Header />
            {/* <NavLinks /> */}
        <ViewFrame resources={this.fetchResources()}  />
        <div className="fileViewer" >
            {this.renderResource()}
        </div>
        <div className="">
            <FloatingButton className="left"/>
             {/*<a href=""  className="btn-floating waves-effect waves-light blue fa fa-comments-o fa fa-2x left" onClick={this.displayFeedback.bind(this)}></a>*/}
        </div>
    </div>
    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('resources');

  return {
    resource:_Resources.findOne({ _id:FlowRouter.getQueryParam('rs')}),
    resources:_Resources.
    find({topicId:FlowRouter.getParam('_id')}).fetch()
  }
},ViewResourceApp);
