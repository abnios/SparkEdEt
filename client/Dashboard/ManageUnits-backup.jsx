import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { _Units,_SearchData,_Deleted, _Courses } from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import { handleCheckboxChange,handleCheckAll,getCheckBoxValues } from '../Utilities/CheckBoxHandler.jsx';
import Sidenav from './Sidenav.jsx';
import { toastMsg } from '../Notifications/SysMsg.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';
import Pagination, { getPageNumber, validatePageNum, getQuery } from '../Utilities/Pagination/Pagination.jsx';
import {initInput, SearchView,filterUrl} from '../Utilities/Utilities.jsx';
import { Unit } from './Unit';

export  class ManageSections extends Component {
        constructor(){
          super();

          this.modalCallBacks = this.deleteSections;
          this.modalCallBack = () => {};
          this.modalTitle = 'default title';
          this.modalId = "modal"; //default modal id
          this.modalSelector = "#" + this.modalId;
          this.modalDialogMsg = "My default dialog message";
        }



renderSections(){

    var count = 1;
    return this.props.units.map((unit) => (

      <UnitRender key={unit._id} href={'/dashboard/editunit/'+ unit._id} count={count++} unit={{_id:unit._id,name:unit.name,createdBy:unit.createdBy,createdAt:unit.createdAt}}/>

    )
    );
  }

      handleSubmit(event){
        event.preventDefault();

        var unit = $("#unit").val();
        var id = $(".unit-id").val();


        Meteor.call('updateUnit', id, unit);
          //update search index

        Meteor.call('updateSearch', id, unit);


            toastMsg(true, "Unit Updated!");

            $("#modal-unit").closeModal();


          }


deleteSections(isDelete) {
    var units = getCheckBoxValues('chk');
    let _unit = units.length > 1
        ? " Units"
        : " Unit";

    if (units.length < 1) {
        Materialize.toast("Please check alteast one unit!", 4000);
        return;
    }


    if (!isDelete) {
        var msg = "Do you really want to delete " + units.length + _unit;
        this.modalTitle = msg;
        this.modalDialogMsg = "";
        this.modalCallBack = this.modalCallBacks;
        this.forceUpdate();
        toggleModal(this.modalSelector, true);
        return;
    }

    toggleModal(this.modalSelector, false);
    var count = 0;
    units.forEach(function(v, k, arra) {

         Meteor.call('removeUnit', v);
        Meteor.call('removeSearchData', v);
        Meteor.call('insertDeleted', v);
        count++;
    });
    if (count) {
      $('#modal').closeModal();

        Materialize.toast(count + " " + _unit + "  successfully deleted", 4000);
    }
}


  addUnits(event){
    event.preventDefault();
    $('#add-unit').openModal();


  }

    getDetails(){
      let course = this.props.course;
      let programId = null
      let courseId = null
      if (course) {
        programId = course.details.programId
        courseId = course._id;
      } else {
        return null;
      }

    }

  render() {
    // get the schoolId for routing back to the list of courses
    var course = this.props.course;
    var schoolId = '';
    let programId = null
    let courseId = null
    if(course){
      programId = course.details.programId
      courseId = course._id;
      schoolId = course.details.schoolId;
    }

    return(
    <div>
        <Header />

          <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/>

          <div id="modal-unit" className="modal">
              <div ref='modal_edit' className="modal-content">
              <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
                <h4>Edit The Unit</h4>
                <div className="row">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                          <div className="row">
                              <div className="input-field">
                                <input placeholder="Unit" id="unit" type="text" className="validate clear" />
                                <input type="hidden" className="unit-id" />
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
          <div id="add-unit" className="modal">
            <div ref="add-unit" className="modal-content">
              <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
                <h4>Add Unit and Topics</h4>
                <Unit/>
                <div className="modal-footer">
                    {/* <button className="btn waves-effect waves-light left fa fa-save" role='submit'> Save</button> */}
                    <a href="" className=" modal-action modal-close waves-effect waves-green btn grey darken-3 right"> Close</a>
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


           <div className="col m8">
                    <div className="">
                        <h4>Manage Units</h4>
                    </div>


                    <div className="col m8 offset-m2">
                        <SearchView action={"/dashboard/units"} name={"accounts"} placeholder={"search user by name,email"} query={"q"}/>
                    </div>

                        <div className="row">
                          <div className="col m3">
                          <button className="btn grey darken-3 fa fa-angle-left">
                              <a href={'/dashboard/course/'+ schoolId +"?cs=" + programId} className="white-text"> Courses
                            </a>
                            </button>
                          </div>
                          <div className="col m3">
                            <button className="btn red darken-3 fa fa-remove"
                              onClick={this.deleteSections.bind(this, false)}> Delete</button>
                          </div>
                          <div className="col m3">
                              <a href={""} >
                               <button className="btn green darken-4 fa fa-plus" onClick={this.addUnits.bind(this)}> New</button>
                                            </a>
                            </div>
                        </div>
                              <table className="highlight striped">
                                      <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Unit</th>
                                            <th>Created At</th>
                                            <th>Edit Unit</th>
                                            <th>Edit Topics</th>
                                            <th onClick={handleCheckAll.bind(this,'chk-all','chk')}>
                                            <input type="checkbox" className='filled-in chk-all'  readOnly />
                                            <label>Check All</label>
                                          </th>
                                        </tr>
                                      </thead>
                                       <tbody>

                                        {this.renderSections()}

                                      </tbody>
                              </table>
                </div>
            </div>
          </div>

    )
  }
}



export class UnitRender extends Component {

  displayModal(id, name, event){
    event.preventDefault();

    $("#unit").val(name);
    $(".unit-id").val(id);
    $("#modal-unit").openModal();
  }

handleUrl(id){
  FlowRouter.go(`/dashboard/edit_unit/${id}`);
  return;

}

  render(){
    var createdDate = this.props.unit.createdAt;
    var date = createdDate.toDateString();
    var UnitID = this.props.unit._id;
    var userId = this.props.unit.createdBy;
    // var CreatedBy = this.props.user.profile.fname;
    var unitName = this.props.unit.name;

    // var programId = this.
    // var count = 1;

    return(


        <tr key={ UnitID } className="link-section">
        <td>{this.props.count}</td>
         <td onClick={this.handleUrl.bind(this, UnitID)}>{unitName}</td>
         <td>{date}</td>
         <td><a href="" className="fa fa-pencil" onClick={this.displayModal.bind(this, UnitID, unitName)}></a></td>
         <td><a href={'/dashboard/edit_unit/'+UnitID} className='fa fa-pencil'></a></td>
         <td onClick={handleCheckboxChange.bind(this,UnitID)} >
                            <input type="checkbox" className={" filled-in chk chk"+UnitID} id={UnitID}  />
                              <label></label>
                              </td>

        </tr>
    )
}

}

export function getCourseId(){
  return FlowRouter.getQueryParam('cs');

}

export default createContainer(() => {
  Meteor.subscribe('units');
  Meteor.subscribe('courses');
  return {
    units: _Units.find({'details.courseId':getCourseId()}).fetch(),
    course: _Courses.findOne({_id:getCourseId()}),
  }
},ManageSections);
