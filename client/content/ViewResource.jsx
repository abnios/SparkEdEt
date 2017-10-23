import React, {  Component } from 'react';
import { PropTypes } from 'prop-types';


export default  class  ViewResource extends Component {

    setActiveItem(resourceId){

      var id = FlowRouter.getQueryParam('rs');

      if(id == resourceId){
        // console.log(id);
        return 'active-item';
      }else{
        return 'cardListItem';
      }

    }
    static changeTextColor(resourceId){

      var id = FlowRouter.getQueryParam('rs');

      if(id == resourceId){
        // console.log(id);
        return 'active-item-color';
      }else{
        return 'cardListItem';
      }

    }


    getIcon(type){
      const fileTypesIcon =
      {video:'fa fa-play-circle',pdf:'fa fa-file-text',ppt:'fa-television',docx:'fa-file-text'};
      return fileTypesIcon[type];
    }


    render(){
        let fileType = this.props.resource.file.type;
        if(fileType === null){
        fileType = '';
      }
      else{
        let fileTypeData = fileType.split('/');
        fileType =fileTypeData[0];
        fileType =this.getIcon(fileType);
        fileType = fileType === undefined ?
        this.getIcon(fileTypeData[1]) : fileType;
      }

      return(
          <li className={this.setActiveItem(this.props.resource._id)+" item"+this.props.resource._id}>
          <a target={'_top'}  href={'/view_resource/'+this.props.resource.topicId+
          '?rs='+this.props.resource._id+"&scid="+FlowRouter.getQueryParam('scid')}
          className={'customAtag '+ViewResource.changeTextColor(this.props.resource._id)}>
              <span className={fileType}/>
              <span className={'resourceName '}>{this.props.resource.name}</span>
          </a>
          </li>
      )
    }

}






// target={'_top'}
ViewResource.propsTypes = {

  resource: PropTypes.object.isRequired,

}
