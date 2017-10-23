import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { _SearchData,_Deleted, _Programs, _School } from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import { handleCheckboxChange,handleCheckAll,getCheckBoxValues } from '../Utilities/CheckBoxHandler.jsx';
import Sidenav from './Sidenav.jsx';
import {  toastMsg } from '../Notifications/SysMsg.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';
import { Session } from 'meteor/session';


export class Program extends Component{

  constructor(){
    super();
    this.modalCallBacks = this.deletePrograms;
    this.modalCallBack = () => {};
    this.modalTitle = 'default title';
    this.modalId = "modal"; //default modal id
    this.modalSelector = "#" + this.modalId;
    this.modalDialogMsg = "My default dialog message";
  }

  deletePrograms(isDelete) {
      var programs = getCheckBoxValues('chk');
      let _program = programs.length > 1
          ? " Programs"
          : " Program";

      if (programs.length < 1) {
          Materialize.toast("Please check alteast one program!", 4000);
          return;
      }


      if (!isDelete) {
          var msg = "Do you really want to delete " + programs.length + _program;
          this.modalTitle = msg;
          this.modalDialogMsg = "";
          this.modalCallBack = this.modalCallBacks;
          this.forceUpdate();
          toggleModal(this.modalSelector, true);
          return;
      }

      toggleModal(this.modalSelector, false);
      var count = 0;
      programs.forEach(function(v, k, arra) {

          Meteor.call('removeProgram', v);
          Meteor.call('removeSearchData', v);
          Meteor.call('insertDeleted', v);
          count++;
      });
      if (count) {
        $('#modal').closeModal();

          Materialize.toast(count + " " + _program + "  successfully deleted", 4000);
      }
  }

    //change route
    handleUrl(id, sId, event){
      event.preventDefault();
      FlowRouter.go(`/dashboard/course/${sId}?cs=${id}`);
      return ;
    }



    //Modal for Editing the Program
    showModal(id, name,code,event){
      event.preventDefault();
      $('.programId').val(id);
      $('#program').val(name);
      $('#pcode').val(code);

      $('#edit-program').openModal();

    }

//Modal for adding a new Program
    displayModal(event){
      event.preventDefault();
      $("#add-program").openModal();
    }

      //Adding New Program
      handleSubmit(event){
        event.preventDefault();
        var program = $("#Newprogram").val();
        var programCode = $("#NewPcode").val();
        var schoolId = FlowRouter.getParam('_id');
        var id = new Meteor.Collection.ObjectID().valueOf();
        var year = $('#year').val();

        var details = {
          'schoolId':schoolId,
          'duration':year
        }
        // schoolId:schoolId,

      Meteor.call('addProgram', id, program, programCode, details, function(err){
        if (err) {
          toastMsg(true, err.reason);
        } else {
          toastMsg(true, 'Program has been added successfully');
        }
      });

        $('.clear').val('');
        $('#add-program').closeModal();
      }

      //Updating the existing Program
      editProgram(event){
        event.preventDefault();
        var program = $('#program').val();
        var pcode = $('#pcode').val();
        var id = $('.programId').val();
        var duration = $('#pyear').val();


          Meteor.call('editProgram',id, program, pcode, duration);
        // $('.clear').val(' ');
        toastMsg(true, 'Program has been updated successfully');

        $('#edit-program').closeModal();

      }

      //change the Url to take back the user to the programs
      changeUrl(event){
        event.preventDefault();
        FlowRouter.go(`/dashboard/school`);
        return;
      }
      //renderPrograms
        renderPrograms(){
          var count = 1;
          var programs = this.props.programs;
          if(programs == undefined){
            return '';
          }
          // console.log(programs);
          return programs.map((program)=>(
            <tr className="link-section" key={program._id}>
              <td>{count++}</td>
              <td onClick={this.handleUrl.bind(this,program._id, program.details.schoolId)}>{program.name}</td>
              <td>{program.createdAt.toDateString()}</td>
              <td><a href="" className="fa fa-pencil" onClick={this.showModal.bind(this, program._id, program.name, program.code)}></a></td>
              <td><a href={'/dashboard/course/' + program.details.schoolId + '?cs='+ program._id } className='fa fa-pencil' ></a></td>
              <td onClick={handleCheckboxChange.bind(this,program._id)}>
                <input type="checkbox" className={"filled-in chk chk"+ program._id } id={program._id}/>
                <label></label>
              </td>
            </tr>

          ));

        }


  render(){

    return(

      <div className="">
        <Header />
          <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/>
        {/* Modal for Adding the Program */}
          <div id="add-program" className="modal">
              <div ref='modal-edit' className="modal-content">
              <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
                <h4>Add Program</h4>
                <div className="row">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                          <div className="row">
                              <div className="input-field">
                                <input placeholder="Name of Program" id="Newprogram" type="text" className="validate clear" required />
                                <input placeholder="Program Code" id="NewPcode" type="text" className="validate clear" required/>
                                <input placeholder="Program Duration" id="year" type="text" pattern='[1-9]' className="validate clear" required/>
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

            {/* Modals for Editing the Program */}

            <div id="edit-program" className="modal">
              <div ref='modal_edit' className="modal-content">
              <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
                <h4>Edit The Program</h4>
                <div className="row">
              <form onSubmit={this.editProgram.bind(this)}>
                    <div className="row">
                      <div className="input-field">
                        <input placeholder="Program" id="program" type="text" className="validate clear" />
                        <input placeholder="Program Code" id="pcode" type="text" className="validate clear" />
                        <input placeholder="Program Duration" id="pyear" type="text" pattern='[1-9]' className="validate clear" required/>

                        <input type="hidden" className="programId" />
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
              <Sidenav active={' dash-active'}/>
            {/* <h4></h4> */}
            </div>

                {/* <div className="col m1">
                </div> */}


          <div className="col m8">
          <div className="">
              <h4>Manage Programs</h4>
          </div>
              <div className="row">

                <div className="col m3">
                  <button className="btn grey darken-3 fa fa-angle-left"
                    onClick={this.changeUrl.bind(this)}> School</button>
                </div>
                <div className="col m3">
                  <button className="btn red darken-3 fa fa-remove"
                    onClick={this.deletePrograms.bind(this, false)}> Delete</button>
                </div>
                <div className="col m3">
                    <a href="" >
                     <button className="btn green darken-4 fa fa-plus" onClick={this.displayModal.bind(this)} > New</button>
                                  </a>
                  </div>
              </div>

          <table className="highlight">
              <thead>
                <tr>
                    <th>#</th>
                    <th>Program</th>
                    <th>Created At</th>
                    <th>Edit Program</th>
                    <th>Course</th>
                    <th onClick={handleCheckAll.bind(this,'chk-all','chk')}>
                    <input type="checkbox" className='filled-in chk-all'  readOnly />
                    <label>Check All</label>
                  </th>
                </tr>
              </thead>
               <tbody>

                 {this.renderPrograms()}


              </tbody>
            </table>
      </div>
    </div>
    </div>

    )
  }
}

export function getSchoolId(){
  return FlowRouter.getParam('_id');
}

export default createContainer(()=>{
  Meteor.subscribe('programs');
  Meteor.subscribe('deleted');
  Meteor.subscribe('searchdata');

  return {
      programs: _Programs.find({"details.schoolId":getSchoolId()}).fetch(),
  }
}, Program)
