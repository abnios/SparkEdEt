import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {_Institution,_Settings} from '../../../Collections/collections.js';
import Header from '../../layouts/Header.jsx';
import Sidenav from '../Sidenav.jsx';
import {Session} from 'meteor/session'
import UploadFile from '../../content/UploadWrapper';
import {ModalDialog, toggleModal} from '../../Utilities/Modal/Modal.jsx';

export class Institution extends Component {

  handleSubmit(event) {
    event.preventDefault();
    var NewName = $('#Iname').val();
    var subHeader = $('#Tname').val();
    var id = Session.get('id');
    //
    // _Institution.update({
    //   _id: id
    // }, {
    //   $set: {
    //     name: NewName,
    //     tagline: subHeader
    //   }
    // });
    Session.set('name', NewName);
    Session.set('sub', subHeader);
    $('.clear').val('');
    $('#modal-upload').openModal();
  }
  render() {

    return (
      <div>
        <Header/>

        <div id="modal-upload" className="modal">
          <div ref='modal_upload' className="modal-content">
            <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
            <h6></h6>
            <h5>Upload The logo
            </h5>
          </div>
          <UploadFile/>
          <div className="modal-footer">
            <a href="" className=" modal-action modal-close waves-effect waves-green btn-flat">
              Close</a>
          </div>
        </div>

        <div className="row">
          <div className="col m3">
            <Sidenav settings={' dash-active'}/>
          </div>

          <div className="col m9">
            <form className="" onSubmit={this.handleSubmit.bind(this)}>
              <div className="">
                <h5>Change Institution name
                </h5>
                <div className="input-field col s9">
                  <input id="Iname" type="text" required className="validate field clear" placeholder='Add the Name of the Institution'/>
                </div>
                <div className="input-field col s9">
                  <input id="Tname" type="text" required className="validate field clear" placeholder='Add the Tagline of the Institution'/> {/* <input  type="hidden" className="instId"/> */}
                </div>
                <br/>


                <div className="col m8">
                  <button className="btn waves-effect waves-light left fa fa-cloud-upload" role='submit'> Save and Upload Logo</button>
                </div>

              </div>

            </form>
          </div>
        </div>
      </div>

    )
  }
}

export default createContainer(() => {
  Meteor.subscribe('institution');
  return {institution: _Institution.find().fetch()}
}, Institution)
