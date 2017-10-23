import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {_SearchData, _Deleted, _Sliding} from '../../../Collections/collections.js';
import Header from '../../layouts/Header.jsx';
import {handleCheckboxChange, handleCheckAll, getCheckBoxValues} from '../../Utilities/CheckBoxHandler.jsx';
import Sidenav from '../Sidenav.jsx';
import {toastMsg} from '../../Notifications/SysMsg.jsx';
import {ModalDialog, toggleModal} from '../../Utilities/Modal/Modal.jsx';
import {Session} from 'meteor/session';
import UploadFile from '../../content/UploadWrapper.jsx';

export class Sliding extends Component {

  constructor() {
    super();
    // this.state = {data:''}

    this.modalCallBacks = this.deleteSlidings;
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

  renderSlidings() {
    var count = 1;
    // var rcrd = this.props.slidings[].length;

    if (this.props.slidings == undefined) {
      return null;
    }

    return this.props.slidings.map((sliding) => (

      <tr className="link-section" key={sliding._id}>
        <td>{count++}</td>
        <td onClick={this.handleUrl.bind(this, sliding._id)}>{sliding.name}</td>
        <td>
          <a href="" className="fa fa-pencil" onClick={this.showModal.bind(this, sliding._id, sliding.name)}></a>
        </td>
        {/* <td onClick={this.handleUrl.bind(this, sliding._id)}>{sliding.file.name}</td> */}
        <td>{sliding.createdAt.toDateString()}</td>
        <td>
            <img width="150px" height="100px" src={`/uploads/${sliding.file.name}`} />
        </td>
        <td>
          <a href="" className="fa fa-pencil" onClick={this.showModal.bind(this, sliding._id, sliding.name)}></a>
        </td>

        <td onClick={handleCheckboxChange.bind(this, sliding._id)}>
          <input type="checkbox" className={" filled-in chk chk" + sliding._id} id={sliding._id}/>
          <label></label>
        </td>
      </tr>
    ));

  }

  //Modal to add the sliding
  displayModal() {
    $("#modal-sliding").openModal();
  }

  handleModal(event) {
      event.preventDefault();

      let sl = this.props.slidings;
      let cnt = sl.length;
      if (cnt < 3){
      $('#modal-upload').openModal();
      }
      else {
        toastMsg(true, 'Only three Sliding Images can be added,Sorry You can\'t add more sliding image');
      }

  }

  //display Modal for editing the sliding
  showModal(id, name, event) {
    event.preventDefault();
    // $('#sliding').val(name);
    // $('#stag').val(tag);
    // $(".slidingId").val(id);
    //
    // // this.setState({data:name})
    // $("#model-sliding").openModal();

    $('#modal-edit').openModal();
    //$('#sliding-id').val(id);
    $('.resourceId').val(id);
    $('#resource-name').val(name);

  }

  handleSubmit(event) {
    event.preventDefault();

    var sku = $('#NewSliding').val();
    // var skuCode = $('#NewStag').val();
    var id = new Meteor.Collection.ObjectID().valueOf();
    Session.set('sliding', id);

    // TODO: //add a callback same on other meteor methods
    Meteor.call('addSliding', id, sku);

    toastMsg(true, 'Sliding has been successfully added');
    $('#modal-sliding').closeModal();
  }

  deleteSlidings(isDelete) {
    var slidings = getCheckBoxValues('chk');
    let _sliding = slidings.length > 1
      ? " Slidings"
      : " Sliding";

    if (slidings.length < 1) {
      Materialize.toast("Please check alteast one sliding!", 4000);
      return;
    }

    if (!isDelete) {
      var msg = "Do you really want to delete " + slidings.length + _sliding;
      this.modalTitle = msg;
      this.modalDialogMsg = "";
      this.modalCallBack = this.modalCallBacks;
      this.forceUpdate();
      toggleModal(this.modalSelector, true);
      return;
    }

    toggleModal(this.modalSelector, false);
    var count = 0;
    slidings.forEach(function(v, k, arra) {

      // _Sliding.remove(v);
      Meteor.call('removeSliding', v);
      Meteor.call('removeSearchData', v);
      Meteor.call('insertDeleted', v);
      count++;
    });
    if (count) {
      $('#modal').closeModal();
      Materialize.toast(count + " " + _sliding + "  successfully deleted", 4000);
    }
  }

  //Update the name of the sliding
  editSliding(event) {
    event.preventDefault();

    var slidingName = $('#resource-name').val();
    // var stag = $('#stag').val();
    // var slidingId = $('#sliding-id').val();
    var slidingId = $(".resourceId").val();

    Meteor.call('editSliding', slidingId, slidingName) ;

        toastMsg(true, 'The Sliding has been successfully updated');
        $("#modal-edit").closeModal();
      // }

  }

  render() {
    return (
      <div className="">
        <Header/> {/* <div className="col m3">
          <Sidenav active={2}/>

        </div> */}
        {/* Modals for Deleting  */}
        <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/> {/* Modal for adding the sliding */}

        <div id="modal-upload" className="modal">
          <div ref='modal_upload' className="modal-content">
            <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
            <h6></h6>
            <h5>Upload Image for </h5>
          </div>
          <UploadFile/>
          <div className="modal-footer">
            <a href="" className=" modal-action modal-close waves-effect waves-green btn-flat">
              Close</a>
          </div>
        </div>

        <div id="modal-sliding" className="modal">
          <div ref='modal_edit' className="modal-content">
            <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
            <h4>Add Sliding</h4>
            <div className="row">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="row">
                  <div className="input-field">
                    <input placeholder="Name of Sliding" id="NewSliding" type="text" className="validate clear" required/>
                    <input placeholder="Sliding Code" id="NewStag" type="text" className="validate clear" required/> {/* <input type="hidden" className="sliding-id" /> */}
                  </div>
                </div>
                <div className="row"></div>
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

        {/* Modal for Editing the Sliding */}

                        <div id="modal-edit" className="modal">
                            <div ref='modal_edit' className="modal-content">
                                <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
                                <h4>Edit The Sliding</h4>
                                <div className="row">
                                    <form onSubmit={this.editSliding.bind(this)}>
                                        <div className="row">
                                            <div className="input-field">
                                                <input placeholder="Sliding" id="resource-name" type="text" className="validate clear"/>
                                                <input type="hidden" className="resourceId"/>
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
            <Sidenav sliding={' dash-active'}/>
            <h4></h4>
          </div>

          <div className="col m1"></div>

          <div className="col m8">
            <div className="">
              <h4>Manage Sliding</h4>
            </div>
            <div className="row">
              <div className="col m3">
                <button className="btn red darken-3 fa fa-remove" onClick={this.deleteSlidings.bind(this, false)}>
                  Delete</button>
              </div>
              {/* <div className="col m3">
                <a href="">
                  <button className="btn green darken-4 fa fa-plus" onClick={this.displayModal.bind(this)}>
                    New</button>
                </a>
              </div> */}
              <div className="col s4 m4">
                  <button className="btn fa fa-cloud-upload green darken-4 " onClick={this.handleModal.bind(this)}> Upload New Slider
                  </button>
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
                  <th>Sliding moto</th>
                  <th>Edit Moto</th>
                  {/* <th>Image Name</th> */}
                  <th>Created At</th>
                  <th>Sliding Image</th>
                  <th>Change Image</th>

                  <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                    <input type="checkbox" className='filled-in chk-all' readOnly/>
                    <label>Check All</label>
                  </th>
                </tr>
              </thead>
              <tbody>

                {this.renderSlidings()}

              </tbody>
            </table>
          </div>
        </div>
      </div>

    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('slidings');
  Meteor.subscribe('deleted');
  Meteor.subscribe('searchdata');
  return {slidings: _Sliding.find().fetch()}
}, Sliding)
