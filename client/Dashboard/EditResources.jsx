import React, {Component} from 'react';
import {_Resources, _Topics, _SearchData, _Deleted} from '../../Collections/collections.js';
import {createContainer} from 'meteor/react-meteor-data';
import Header from '../layouts/Header.jsx';
import {toastMsg} from '../Notifications/SysMsg.jsx';
import Sidenav from './Sidenav.jsx';
import {handleCheckboxChange, handleCheckAll, getCheckBoxValues} from '../Utilities/CheckBoxHandler.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';
import Resources from '../content/Resources.jsx';
import UploadFile from '../content/UploadWrapper.jsx';
import {Session} from 'meteor/session';

export class EditResources extends Component {

    constructor() {
        super();
        this.modalCallBacks = this.deleteResource;
        this.modalCallBack = () => {};
        this.modalTitle = 'default title';
        this.modalId = "modal"; //default modal id
        this.modalSelector = "#" + this.modalId;
        this.modalDialogMsg = "My default dialog message";

    }

    getBack(event) {
      event.preventDefault();
        var unitId = Session.get('unitId');
        FlowRouter.go(`/dashboard/edit_unit/${unitId}`);
      return;
    }

    deleteResource(isDelete) {
        var resource = getCheckBoxValues('chk');
        let mResource = resource.length > 1
            ? " Resources"
            : " Resource";

        if (resource.length < 1) {
            Materialize.toast("Please check atleast one resource!", 4000);
            return;
        }

        if (!isDelete) {
            var msg = "Do you really want to delete " + resource.length + mResource;
            this.modalTitle = msg;
            this.modalDialogMsg = "";
            this.modalCallBack = this.modalCallBacks;
            this.forceUpdate();
            toggleModal(this.modalSelector, true);
            return;
        }

        toggleModal(this.modalSelector, false);
        var count = 0;
        resource.forEach(function(v, k, arra) {
          Meteor.call('removeResource', v);
            _SearchData.remove(v);
            var file = $('#' + v).val();
            _Deleted.insert({
                _id: v,
                col: 'resource',
                file: file,
                sync: {
                    kijabe: false,
                    kisumu: false
                }
            });
            Meteor.call('deleteFile', file, function(err, data) {})
            count++;
        });
        if (count) {
            $('#modal').closeModal();

            Materialize.toast(count + " " + mResource + "  successfully deleted", 4000);
        }

    }

    editResource(id, name, event) {
        event.getPrevented;
        $('#modal-edit').openModal();
        $('.resourceId').val(id);
        $('#resource-name').val(name);
    }

    handleSubmit(event) {
        event.preventDefault();
        var resourceName = $('#resource-name').val();
        var id = $(".resourceId").val();

        Meteor.call('updateResource', id, resourceName);

        //update search index

        _SearchData.update({
            _id: id
        }, {
            $set: {
                name: resourceName
            }
        });

        //generateSyncResource update
        Meteor.call('generateSyncResource', {
            _id: id,
            name: resourceName
        }, function(err, data) {})

        toastMsg(true, " Resource updated!");
        $('#modal-edit').closeModal();
    }

    renderResources() {
        var count = 1;
        var resources = this.props.resources;
        if (resources == undefined) {
            return null
        }

        return this.props.resources.map((resource) => (
            <tr key={resource._id}>
                <td>{count++}</td>
                <td>{resource.name}</td>
                <td>
                    <a href="" className="fa fa-pencil" onClick={this.editResource.bind(this, resource._id, resource.name)}></a>
                </td>
                <td>{resource.file.type.split('/')[1]}</td>
                <td onClick={handleCheckboxChange.bind(this, resource._id)}>
                    <input type="checkbox" value={resource.file.name} className={" filled-in chk chk" + resource._id} id={resource._id}/>
                    <label></label>
                </td>
            </tr>
        ))
    }

    //
    // renderTopic() {
    //     var topicName = this.props.topic;
    //     if (topicName == undefined) {
    //         return null;
    //     } else {
    //         // console.log(topicName.sectionId);
    //         Session.set('unitId', topicName.unitId);
    //         return topicName.name;
    //     }
    // }

    //open upload modal
    handleModal(event) {
        event.preventDefault();
        $('#modal-upload').openModal();
    }

    render() {

      var topicName = this.props.topic;
      if (topicName == undefined) {
          return null;
      } else {
          // console.log(topicName.sectionId);
          Session.set('unitId', topicName.unitId);
          topic = topicName.name;
      }

        return (
            <div>

                <div id="modal-upload" className="modal">
                    <div ref='modal_upload' className="modal-content">
                        <a href="" className="pull-right modal-action modal-close fa fa-times waves-effect waves-green btn-flat"></a>
                        <h6></h6>
                        <h5>Upload Resource for {topic}</h5>
                    </div>
                    <UploadFile/>
                    <div className="modal-footer">
                        <a href="" className=" modal-action modal-close waves-effect waves-green btn-flat"> Close</a>
                    </div>
                </div>

                <div id="modal-edit" className="modal">
                    <div ref='modal_edit' className="modal-content">
                        <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
                        <h4>Edit The Resource</h4>
                        <div className="row">
                            <form onSubmit={this.handleSubmit.bind(this)}>
                                <div className="row">
                                    <div className="input-field">
                                        <input placeholder="Resource" id="resource-name" type="text" className="validate clear"/>
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

                <Header/>

                <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/>

                <div className="row">
                    <div className="col m3">
                        <Sidenav active={2}/>
                    </div>
                    <div className="col m1">

                    </div>

                    <div className="col m8">
                        <div className="">
                            <h4>{topic}</h4>
                        </div>
                        <div className="row ">

                            <div className="col s4 m4">
                                <button className="btn grey darken-3 fa fa-angle-left" onClick={this.getBack.bind(this)}> Topics</button>
                            </div>
                            <div className="col s4 m4">
                                <button className="btn red darken-3 fa fa-remove " onClick={this.deleteResource.bind(this, false)}> Delete</button>
                            </div>

                            <div className="col s4 m4">
                                <button className="btn fa fa-cloud-upload green darken-4 " onClick={this.handleModal.bind(this)}> Upload New
                                </button>
                            </div>

                        </div>

                        <table className="striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Resource</th>
                                    <th>Edit Resource</th>
                                    <th>Type</th>
                                    <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                                        <input type="checkbox" className='filled-in chk-all' readOnly/>
                                        <label>Check All</label>
                                    </th>

                                </tr>
                            </thead>
                            <tbody>

                                {this.renderResources()}

                            </tbody>

                        </table>

                    </div>
                </div>
            </div>
        )
    }
}

export function getTopicId() {
    return FlowRouter.getParam('_id');
}


export default createContainer(() => {
  Meteor.subscribe('resources');
  Meteor.subscribe('topics');

    return {
        resources: _Resources.find({topicId: getTopicId()}).fetch(),
        topic: _Topics.findOne({_id: getTopicId()})
    }
}, EditResources);
