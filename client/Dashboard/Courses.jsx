// TODO:  properly route back to the programs, can do this by setting the id in session 

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { _SearchData,_Deleted, _Courses } from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import { handleCheckboxChange,handleCheckAll,getCheckBoxValues } from '../Utilities/CheckBoxHandler.jsx';
import Sidenav from './Sidenav.jsx';
import { toastMsg } from '../Notifications/SysMsg.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';

export class Courses extends Component {
  constructor(){
    super();
    this.modalCallBacks = this.deleteCourses;
    this.modalCallBack = () => {};
    this.modalTitle = 'default title';
    this.modalId = "modal"; //default modal id
    this.modalSelector = "#" + this.modalId;
    this.modalDialogMsg = "My default dialog message";

  }



  deleteCourses(isDelete) {
      var courses = getCheckBoxValues('chk');
      let _course = courses.length > 1
          ? " Courses"
          : " Course";

      if (courses.length < 1) {
          Materialize.toast("Please check alteast one course!", 4000);
          return;
      }


      if (!isDelete) {
          var msg = "Do you really want to delete " + courses.length + _course;
          this.modalTitle = msg;
          this.modalDialogMsg = "";
          this.modalCallBack = this.modalCallBacks;
          this.forceUpdate();
          toggleModal(this.modalSelector, true);
          return;
      }

      toggleModal(this.modalSelector, false);
      var count = 0;
      courses.forEach(function(v, k, arra) {

          Meteor.call('removeCourse', v);
          Meteor.call('removeSearchData', v);
          Meteor.call('insertDeleted', v);
          count++;
      });
      if (count) {
        $('#modal').closeModal();
          Materialize.toast(count + " " + _course + "  successfully deleted", 4000);
      }
  }



//display the Modal for adding the Course

  displayModal(event){
    event.preventDefault();
    $('#add-course').openModal();


  }
//route to whats contained in the course
  handleUrl(id, pId, year,event){
    event.preventDefault();
    FlowRouter.go(`/dashboard/units/${pId}?cs=${id}&y=${year}`);
    return;
  }

//show the edit Modal for editing the course
showModal(id,name,code, event){
  event.preventDefault();
  $('.courseId').val(id);
  $('#new-course').val(name);
  $('#new-Ccode').val(code);
  // console.log(id, name, code);
  $('#edit-course').openModal();

}

//Editing the Course
  editCourse(event){
      event.preventDefault();
      var year = $('#edit-year').val();
      var courseId = $('.courseId').val();
      var courseName = $('#new-course').val();
      var courseCode = $('#new-Ccode').val();

      //update

      Meteor.call('editCourse', courseId,courseName, courseCode, year);
      toastMsg(true, 'Course has been successfully updated');

      $('.clear').val('');
      $('#edit-course').closeModal();


  }

//Adding new Course
handleSubmit(event){
    event.preventDefault();
    var id = new Meteor.Collection.ObjectID().valueOf();
    var course = $('#NewCourse').val();
    var courseCode = $('#NewCcode').val();
    var programId = FlowRouter.getQueryParam('cs');
    var schoolId = FlowRouter.getParam('_id');
    var year = $('#year').val();

      var details = {
        'schoolId':schoolId,
        'programId':programId,
        'year':year
    }

  // insert
    Meteor.call('addCourse', id, course, courseCode, details);

    $('.clear').val('');
    toastMsg(true, 'Course has been successfully added');
    $('#add-course').closeModal();
  }
      //take back to Programs
      changeUrl(event){
        event.preventDefault();
        id = FlowRouter.getParam('_id');
        FlowRouter.go(`/dashboard/program/${id}`);
        return;
      }



renderCourses(){
  var count = 1;
  var courses = this.props.courses;
  if(courses == undefined){
    return '';
  }
  return courses.map((course)=>(
    <tr key={course._id} className="link-section">

        <td>{count++}</td>
        <td onClick={this.handleUrl.bind(this, course._id, course.details.programId, course.details.year)}>{course.name}</td>
        <td>{course.createdAt.toDateString()}</td>
        <td><a href="" className="fa fa-pencil" onClick={this.showModal.bind(this, course._id,course.name, course.code)}></a></td>
        <td><a href={'/dashboard/units/'+ course.details.programId + '?cs=' + course._id + "&y=" +course.details.year} className="fa fa-pencil" ></a></td>
        <td onClick={handleCheckboxChange.bind(this, course._id)}><input type="checkbox" className={"filled-in chk chk"+course._id} id={course._id}/><label></label></td>
    </tr>
  ))
}


  render(){

    return(
    <div>
      <Header />

        <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/>
      {/* Modal for Adding the Program */}
        <div id="add-course" className="modal">
            <div ref='modal-edit' className="modal-content">
            <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
              <h4>Add Course</h4>
              <div className="row">
                  <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="row">
                            <div className="input-field">
                              <input placeholder="Course Name" id="NewCourse" type="text" className="validate clear" required />
                              <input placeholder="Course Code" id="NewCcode" type="text" className="validate clear" required/>
                              <input placeholder="Course Year" id="year" type="text" pattern="[1-9]" title="Please Enter 1 - 9" defaultValue="" className="validate clear" required/>
                              {/* <input type="hidden" className="section-id" /> */}
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


        {/* Modals for Editing the Course */}

        <div id="edit-course" className="modal">
          <div ref='modal_edit' className="modal-content">
          <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
            <h4>Edit The Course</h4>
            <div className="row">
          <form onSubmit={this.editCourse.bind(this)}>
                <div className="row">
                  <div className="input-field">
                    <input placeholder="Course Name" id="new-course" type="text" className="validate clear" />
                    <input placeholder="Course Code" id="new-Ccode" type="text" className="validate clear" />
                    <input placeholder="Course Year" id="edit-year" type="text" pattern="[1-9]" title="Please Enter 1 - 9" defaultValue="" className="validate clear" required/>
                    <input type="hidden" className="courseId" />
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

      <div className="row">
        <div className="col m3">
          <Sidenav active={2}/>
        <h4></h4>
        </div>

            <div className="col m1">
            </div>


      <div className="col m8 s">
        <div className="">
            <h4>Manage Courses</h4>
        </div>
            <div className="row">
              <div className="col m3">
                <button className="btn grey darken-3 fa fa-angle-left"
                  onClick={this.changeUrl.bind(this)}> Programs</button>
              </div>
              <div className="col m3">
                <button className="btn red darken-3 fa fa-remove"
                  onClick={this.deleteCourses.bind(this, false)}> Delete</button>
              </div>
              <div className="col m3">
                  <a href="">
                   <button className="btn green darken-4 fa fa-plus" onClick={this.displayModal.bind(this)} > New</button>
                  </a>
                </div>
            </div>


          <table className="highlight">
              <thead>
                <tr>
                    <th>#</th>
                    <th>Course</th>
                    <th>Created At</th>
                    <th>Edit Course</th>
                    <th>Unit</th>
                    <th onClick={handleCheckAll.bind(this,'chk-all','chk')}>
                    <input type="checkbox" className='filled-in chk-all'  readOnly />
                    <label>Check All</label>
                  </th>
                </tr>
              </thead>
               <tbody>

                 {this.renderCourses()}

              </tbody>
            </table>
            </div>
          </div>
        </div>
    )
  }
}

    export function getProgramId(){
      return FlowRouter.getQueryParam('cs');
    }

export default createContainer(()=>{
  Meteor.subscribe('courses');
  Meteor.subscribe('searchdata');
  Meteor.subscribe('deleted');

  return {
      courses:_Courses.find({"details.programId":getProgramId()}).fetch(),
  }
}, Courses)
