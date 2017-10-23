import React , { Component } from 'react';
import { _Resources } from '../../Collections/collections.js';
import {createContainer} from 'meteor/react-meteor-data';


export  class ExtraResource extends Component {

  getIcon(resource){

    if(resource == undefined){
      return '';
    }



    const fileTypesIcon =
    {video:'fa-file-video-o video',pdf:'fa-file-pdf-o pdf',ppt:'fa-television',docx:'fa-file-text'};

    var fileType = resource.file.type;

    if(fileType == null){
      fileType = '';
    }else{
    let fileTypeData = fileType.split('/');
      fileType =fileTypeData[0];
      fileType =fileTypesIcon[fileType];
      fileType = fileType == undefined ?
      fileTypesIcon[fileTypeData[1]] : fileType;
    }

    return fileType;
  }

renderResources(){
  var resources = this.props.resources;

  return resources.map((resource)=>(
    <ul key={resource._id} className="extraList col ">
      <li>

      <a href={'view_resource/'+getTopicId()+'?rs='+resource._id}>
      <span  className={' fa '+this.getIcon(resource)} >
        {' '+resource.name}</span>
      </a>
      </li>

    </ul>
  ))
}


  render(){

    return(
      <div>
      <div className="col m6 l6 Extra ">
        <div className="">
          <h4>Extra Resources</h4>
      </div>

        {this.renderResources()}
      {/* <table className="bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Resources</th>
          </tr>
        </thead>
        <tbody>



        </tbody>

      </table> */}


      </div>
      </div>


    )
  }

}
export function getTopicId(){
  return '551020b36b38d8cf05e383b1';
}


export default createContainer(()=>{
  return {
    resources:_Resources.find({topicId:'551020b36b38d8cf05e383b1'}).fetch(),
  }
}, ExtraResource)
