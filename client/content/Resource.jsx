import React, {Component} from 'react';
import { PropTypes } from 'prop-types';
import {Session} from 'meteor/session';

export default class Resource extends Component {

  viewResource(url){
    Session.set('isMounted',false);
    FlowRouter.go(url);
  }

  checkHr() {

    if (this.props.hr) {
      return <hr className="col s12 m12 l12"/>
    } else {
      return <span/>
    }

    if(this.props.hr){
      return <hr className="col s12 m12 l12"/>
    }else {
      return <span />
    }
  }

  getIcon(type) {
    const fileTypesIcon = {
      video: 'fa-file-video-o video',
      pdf: 'fa-file-pdf-o ',
      ppt: 'fa-television',
      docx: 'fa-file-text'
    };
    return fileTypesIcon[type];
  }
    getIcon(type){
      const fileTypesIcon =
      {video:'fa fa-play-circle',pdf:'fa fa-file-text ',ppt:'fa-television',docx:'fa-file-text'};
      return fileTypesIcon[type];
    }
    render(){

      var fileType = this.props.resource.file.type;

      if(fileType === null){
        fileType = '';
      }else{
        let fileTypeData = fileType.split('/');
        fileType =fileTypeData[0];
        fileType =this.getIcon(fileType);
        fileType = fileType === undefined ?
        this.getIcon(fileTypeData[1]) : fileType;
      }

      return(
          <div>
        {this.checkHr()}
          <div className='col m4' ref='resource'>
            <span
                className="link"
                onClick={this.viewResource.bind(
                    this,'/view_resource/'+
                    this.props.resource.topicId+'?rs='+
                    this.props.resource._id+"&scid="+
                    FlowRouter.getParam('_id'))}>
              <span
                className={'resource-item fa ' + fileType} />
                {this.props.resource.name}
          </span>
        </div>
        </div>
    )
  }
}

Resource.propsTypes = {
  resource: PropTypes.object.isRequired,
}
