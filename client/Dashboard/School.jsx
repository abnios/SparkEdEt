import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {_SearchData, _Deleted, _School} from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import {handleCheckboxChange, handleCheckAll, getCheckBoxValues} from '../Utilities/CheckBoxHandler.jsx';
import Sidenav from './Sidenav.jsx';
import {toastMsg} from '../Notifications/SysMsg.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';
import {Session} from 'meteor/session';

export class School extends Component {

  constructor() {
    super();
    // this.state = {data:''}

    this.modalCallBacks = this.deleteSchools;
    this.modalCallBack = () => {};
    this.modalTitle = 'default title';
    this.modalId = "modal"; //default modal id
    this.modalSelector = "#" + this.modalId;
    this.modalDialogMsg = "My default dialog message";

  }

  handleUrl(id, event) {
    FlowRouter.go(`/dashboard/program/${id}`);
    return;
  }

  renderSchools() {
    var count = 1;

    if (this.props.schools == undefined) {
      return null;
    }
    return this.props.schools.map((school) => (

      <tr className="link-section" key={school._id}>
        <td>{count++}</td>
        <td onClick={this.handleUrl.bind(this, school._id)}>{school.name}</td>
        <td>{school.createdAt.toDateString()}</td>
        <td>
          <a href="" className="fa fa-pencil" onClick={this.showModal.bind(this, school._id, school.name, school.code)}></a>
        </td>
        <td>
          <a href={'/dashboard/program/' + school._id} className='fa fa-pencil'></a>
        </td>
        <td onClick={handleCheckboxChange.bind(this, school._id)}>
          <input type="checkbox" className={" filled-in chk chk" + school._id} id={school._id}/>
          <label></label>
        </td>
      </tr>
    ));

  }

  //Modal to add the school
  displayModal() {
    $("#modal-school").openModal();
  }

  //display Modal for editing the school
  showModal(id, name, code, event) {
    event.preventDefault();
    $('#school').val(name);
    $('#scode').val(code);
    $(".schoolId").val(id);

    // this.setState({data:name})
    $("#edit-school").openModal();
  }

  handleSubmit(event) {
    event.preventDefault();

    var sku = $('#NewSchool').val();
    var skuCode = $('#NewScode').val();
    var id = new Meteor.Collection.ObjectID().valueOf();
    Session.set('school', id);

    // TODO: //add a callback same on other meteor methods
    Meteor.call('addSchool', id, sku, skuCode);

    toastMsg(true, 'School has been successfully added');
    $('#modal-school').closeModal();
  }

  deleteSchools(isDelete) {
    var schools = getCheckBoxValues('chk');
    let _school = schools.length > 1
      ? " Schools"
      : " School";

    if (schools.length < 1) {
      Materialize.toast("Please check alteast one school!", 4000);
      return;
    }

    if (!isDelete) {
      var msg = "Do you really want to delete " + schools.length + _school;
      this.modalTitle = msg;
      this.modalDialogMsg = "";
      this.modalCallBack = this.modalCallBacks;
      this.forceUpdate();
      toggleModal(this.modalSelector, true);
      return;
    }

    toggleModal(this.modalSelector, false);
    var count = 0;
    schools.forEach(function(v, k, arra) {

      // _School.remove(v);
      Meteor.call('removeSchool', v);
      Meteor.call('removeSearchData', v);
      Meteor.call('insertDeleted', v);
      count++;
    });
    if (count) {
      $('#modal').closeModal();
      Materialize.toast(count + " " + _school + "  successfully deleted", 4000);
    }
  }

  //Update the name of the school
  editSchool(event) {
    event.preventDefault();
    var schoolName = $('#school').val();
    var scode = $('#scode').val();
    var schoolId = $('.schoolId').val();

    Meteor.call('editSchool', schoolId, schoolName, scode, function(err) {
      if (err) {
        toastMsg(true, err.reason);
      } else {
        toastMsg(true, 'The School has been successfully updated');
        $("#edit-school").closeModal();
      }
    });

  }

  render() {
    return (
      <div className="">
        <Header/> {/* <div className="col m3">
          <Sidenav active={2}/>

        </div> */}
        {/* Modals for Deleting  */}
        <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/> {/* Modal for adding the school */}
        <div id="modal-school" className="modal">
          <div ref='modal_edit' className="modal-content">
            <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
            <h4>Add School</h4>
            <div className="row">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="row">
                  <div className="input-field">
                    <input placeholder="Name of School" id="NewSchool" type="text" className="validate clear" required/>
                    <input placeholder="School Code" id="NewScode" type="text" className="validate clear" required/> {/* <input type="hidden" className="school-id" /> */}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn waves-effect waves-light left fa fa-save" role='submit'>
                    Save</button>
                  <a href="" className=" modal-action modal-close waves-effect waves-green btn grey darken-3 right">
                    Close</a>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Modal for Editing the School */}

        <div id="edit-school" className="modal">
          <div ref='modal_edit' className="modal-content">
            <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
            <h4>Edit The School</h4>
            <div className="row">
              <form onSubmit={this.editSchool.bind(this)}>
                <div className="row">
                  <div className="input-field">
                    <input placeholder="School" id="school" type="text" className="validate clear"/>
                    <input placeholder="School Code" id="scode" type="text" className="validate clear"/>
                    <input type="hidden" className="schoolId"/>
                  </div>
                </div>
                <div className="modal-footer">

                  <button className="btn waves-effect waves-light left fa fa-save" role='submit'>
                    Save</button>
                  <a href="" className=" modal-action modal-close waves-effect waves-green btn grey darken-3 right">
                    Close</a>

                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col m3">
            <Sidenav school={' dash-active'}/>
            <h4></h4>
          </div>

          <div className="col m1"></div>

          <div className="col m8">
            <div className="">
              <h4>Manage School</h4>
            </div>
            <div className="row">
              <div className="col m3">
                <button className="btn red darken-3 fa fa-remove" onClick={this.deleteSchools.bind(this, false)}>
                  Delete</button>
              </div>
              <div className="col m3">
                <a href="">
                  <button className="btn green darken-4 fa fa-plus" onClick={this.displayModal.bind(this)}>
                    New</button>
                </a>
              </div>
              {/* <div className="col m3">
                    <a href="/dashboard/institution" >
                     <button className="btn green darken-4 fa fa-plus" > Institution</button>
                                  </a>
                  </div> */}

            </div>

            <table className="highlight">
              <thead>
                <tr>
                  <th>#</th>
                  <th>School</th>
                  <th>Created At</th>
                  <th>Edit School</th>
                  <th>Programs</th>
                  <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                    <input type="checkbox" className='filled-in chk-all' readOnly/>
                    <label>Check All</label>
                  </th>
                </tr>
              </thead>
              <tbody>

                {this.renderSchools()}

              </tbody>
            </table>
          </div>
        </div>
      </div>

    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('schools');
  Meteor.subscribe('deleted');
  Meteor.subscribe('searchdata');
  return {schools: _School.find().fetch()}
}, School)
