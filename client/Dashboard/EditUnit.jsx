import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { _Topics, _Units,_SearchData,_Deleted } from '../../Collections/collections.js';
import { createContainer } from 'meteor/react-meteor-data';
import Header from '../layouts/Header.jsx';
import {  toastMsg } from '../Notifications/SysMsg.jsx';
import Sidenav from './Sidenav.jsx';
import { handleCheckboxChange,handleCheckAll,getCheckBoxValues } from '../Utilities/CheckBoxHandler.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';
// import Topic from './TopicEdit.jsx';
import { Session } from 'meteor/session';


export  class EditUnits extends Component {
    constructor(){
      super();
      this.modalCallBacks = this.deleteTopics;
      this.modalCallBack = () => {};
      this.modalTitle = 'default title';
      this.modalId = "modal"; //default modal id
      this.modalSelector = "#" + this.modalId;
      this.modalDialogMsg = "My default dialog message";

    }



  displayModal(id,name,event){
    event.getPrevented;
    $('#topic').val(name);
    // $('h4').val(name);
    $('.topic-id').val(id);
  $("#modal-edit").openModal();
  }

  handleUrl(id){
    Session.set('topicId', id);
    FlowRouter.go(`/dashboard/edit_resources/${id}`)
    return;
  }

  renderTopics(){
        var count = 1;
        var topics = this.props.topics;
        var unitId = FlowRouter.getParam('_id');
        if(topics == undefined){
          return null
        }




  return topics.map((topic)=>(
    <tr key={topic._id} className="link-section">
       <td>{count++}</td>

       <td onClick={this.handleUrl.bind(this, topic._id)}>{topic.name}</td>
       <td>{topic.createdAt.toDateString()}</td>
       <td><a href="" onClick={this.displayModal.bind(this,topic._id,topic.name)} className="fa fa-pencil" ></a></td>
       <td><a className="fa fa-pencil" href={'/dashboard/edit_resources/'+topic._id}></a></td>
       <td onClick={handleCheckboxChange.bind(this,topic._id)} >
                          <input type="checkbox" className={" filled-in chk chk"+topic._id} id={topic._id}  />
                            <label></label>
                            </td>
   </tr>
  ))

}

handleSubmit(event){
  event.preventDefault();

    var newTopic = $("#topic").val();
    var id = $(".topic-id").val();
    // console.log(id);


  Meteor.call('updateTopic', id, newTopic);

    //index for search purposes
    _SearchData.update(
      {_id:id},
      {$set: {name:name }}
    );



    var topics = [{name:name,_id:id}];
    //write to a topic sync file
      Meteor.call('generateSyncTopics',topics,function(err,data){
      })



      toastMsg(true,"Topic updated!");

      // $('.clear').val('');
      $("#modal-edit").closeModal();
}

deleteTopics(isDelete) {
    var topics = getCheckBoxValues('chk');
    let _topic = topics.length > 1
        ? " Topics"
        : " Topic";

    if (topics.length < 1) {
        Materialize.toast("Please check alteast one topic!", 4000);
        return;
    }


    if (!isDelete) {
        var msg = "Do you really want to delete " + topics.length + _topic;
        this.modalTitle = msg;
        this.modalDialogMsg = "";
        this.modalCallBack = this.modalCallBacks;
        this.forceUpdate();
        toggleModal(this.modalSelector, true);
        return;
    }

    toggleModal(this.modalSelector, false);
    var count = 0;
    topics.forEach(function(v, k, arra) {
        Meteor.call('removeTopic',v);
        _SearchData.remove(v);
        _Deleted.insert({_id:v,col:'topic',sync:{kijabe:false,kisumu:false}});
        count++;
    });
    if (count) {
      $("#modal").closeModal();
        Materialize.toast(count + " " + _topic + " successfully deleted", 4000);
    }

}

addNewTopic(event){
    event.preventDefault();
    $("#modal-add").openModal();

}
addNew(event){
  event.preventDefault();
  var newTopic = $("#newTopic").val();
  var user = Meteor.userId();
  var unitId =  FlowRouter.getParam('_id');
  var _id = new Meteor.Collection.ObjectID().valueOf();
  var unitName = this.props.unit.name;

// TODO: To be looked at further

  Meteor.call('insertTopic', _id, unitId,newTopic,unitName);

  //insert search index

  _SearchData.insert(
    {
      _id:_id,_ids:{unitId:unitId},name:newTopic,category:'topic',createdAt:new Date()
    }
  );


  //write to a topic sync file
  var topics = [{name:newTopic,_id:_id,unit:unitName,unitId:unitId,createdBy:user}];

        //write to a topic sync file
          Meteor.call('generateSyncTopics',topics,function(err,data){
          })


    toastMsg(true,"Topic Added!");

    // $('.clear').val('');
    $("#modal-add").closeModal();

}




 render(){
   let unit = this.props.unit;
   let courseId = null;
   let programId = null;
   if(!unit){
     return null;
   }else {
     unit = unit;
     courseId = unit.details.courseId;
     programId = unit.details.programId;
   }
    return(
        <div className="">

          {/* Modal to edit the existing topic */}


        <div id="modal-edit" className="modal">
          <div ref='modal_edit' className="modal-content">
          <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
            <h4>Edit The Topic</h4>
            <div className="row">
          <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="row">
                  <div className="input-field">
                    <input placeholder="Topic" id="topic" type="text" className="validate clear" />
                    <input type="hidden" className="topic-id" />
                  </div>
                  </div>
                  <div className="modal-footer">

                      <button className="btn waves-effect waves-light left fa fa-save" role='submit'> Save</button>
                      <a href="" className=" modal-action modal-close waves-effect waves-green btn grey darken-3 right"> Close</a>

                  </div>
              </form>
          </div>

        </div>
        </div>


        {/* Modal to Add a new topic */}


  <div id="modal-add" className="modal">
      <div ref='modal_edit' className="modal-content">
              <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
              <h4>Add a New Topic </h4>
        <div className="row">
          <form onSubmit={this.addNew.bind(this)}>
                <div className="row">
                    <div className="input-field">
                      <input placeholder="New Topic" id="newTopic" type="text" className="validate clear" />
                    </div>
                  </div>
                  <div className="modal-footer">

                      <button className="btn waves-effect waves-light left fa fa-send-o" role='submit'> Add</button>
                      <a href="" className=" modal-action modal-close waves-effect waves-green btn grey darken-3 right"> Close</a>

                  </div>
              </form>
          </div>

        </div>
        </div>







    <Header />

    <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/>



    <div className="row">
    <div className="col m3">
    <Sidenav active={2}/>
    <h4></h4>
    </div>

    <div className="col m1">
    </div>


    <div className="col m8">


        <div className="">

          <h4>  {unit.name} </h4>

        </div>
            <div className="row ">

                <div className="col m3 ">
                  <button className="btn grey darken-3 fa fa-angle-left">
                    <a href={'/dashboard/units/'+ programId +"?cs=" + courseId} className="white-text"> Units
                  </a>
                  </button>
                </div>
                  <div className="col m3 ">
                    <button className="btn red darken-3 fa fa-remove " onClick={this.deleteTopics.bind(this, false)}> Delete</button>
                  </div>
                  <div className="col m3">
                      <a href="">
                       <button className="btn green darken-4 fa fa-plus " onClick={this.addNewTopic.bind(this)}> Add</button>
                                    </a>
                    </div>

            </div>




        <table className="highlight">
                <thead>
                  <tr>
                      <th>#</th>
                      <th>Topics</th>
                      <th>Uploaded At</th>
                      <th>Edit Topics</th>
                      <th>Resources</th>
                      <th onClick={handleCheckAll.bind(this,'chk-all','chk')}>
                      <input type="checkbox" className='filled-in chk-all'  readOnly />
                      <label>Check All</label>
                    </th>
                  </tr>
                </thead>
                 <tbody>

                  {this.renderTopics()}

                </tbody>
              </table>
              </div>
              </div>
    </div>
    )};
}




export function getUnitId(){
    var unitId = FlowRouter.getParam('_id');
    //  console.log(IdSection);
    return unitId;
}


export default createContainer(() => {
  Meteor.subscribe('units');
  Meteor.subscribe('topics');

    return {
        topics:_Topics.find({unitId:getUnitId()}).fetch(),
        // number:_Topics.find({sectionId:getSectionId()}).count(),
        unit:_Units.findOne({_id:getUnitId()}),

    }
},EditUnits)
