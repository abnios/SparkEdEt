import React, {Component} from 'react';
import Header from '../../layouts/Header.jsx';
import {createContainer} from 'meteor/react-meteor-data';
import Sidenav from '../Sidenav.jsx';
import { _Settings } from '../../../Collections/collections.js';
import {ModalDialog, toggleModal} from '../../Utilities/Modal/Modal.jsx';
import {Session} from "meteor/session";

export  class SyncSettings extends Component {

  constructor() {
      super();

      this.modalDialogMsg = "Create new Setting";
      this.modalTitle = 'Create New Setting';
      this.modalCallBacks = [this.reseSettings, this.deleteSetting];
      this.modalId = "modal"; //default modal id
      this.modalCallBack = () => {};
      this.url = null;
      this.modalSelector = "#" + this.modalId;
      this.labledSettings = [];
      this.mInterval = 'checkResourceProgress';
      this.version = null;
      this.delId = null;
      self = this;
    }

    componentDidMount(){
      Meteor.setTimeout(function(){

        if(self.props.settings !== undefined && self.props.settings.length == 0){
          console.log('It should render the default settings');
        }

      },9000);

    }

    checkUpdateProgress(){

      var startTime = new Date();

      self.mInterval =setInterval(function () {

      var version = _Settings.findOne({label:'version'});
      console.log('client version',parseFloat(version.val) , self.version);

      if (parseFloat(version.val) > self.version) {
        $('.upgrading').hide(9000);
        Materialize.toast("The system has been updated successfully to version "+version.val,9000);
        $('.upgrade').addClass('hide');

        clearInterval(self.mInterval);

      }else if (((new Date()) - startTime) > 60000) {//the whole process should not take more than a minute
        $('.upgrading').hide(9000);
        Materialize.toast("Sorry  system has not been updated . Please consult Sys. Admin",9000);
        $('.upgrade').addClass('hide');

        clearInterval(self.mInterval);

      }

      },9000)

    }


    reseSettings(){
      $("#modal").closeModal();

      Meteor.call('resetSystemSettings');

      var settings = [
        {name:"School",val:'kijabe',placeholder:"School"
        ,category:"School",label:"schoolName"},
        {name:"version",val:'1.2',placeholder:"Version"
        ,category:"System",label:"version"},
        {name:"Sync Address",val:'http://52.42.16.134/',placeholder:"Sync Url/IP Address"
        ,category:"Sync",label:"syncAddress"}
      ]

      $.each(settings,function(k,v){

      var name = v.name;
      var val = v.val;
      var placeholder =v.placeholder;
      var category = v.category;
      var label = v.label;


      _Settings.insert({
          name: name,
          val: val,
          placeholder: placeholder,
          label: label,
          category: category,
          createdAt: new Date(),
      });

    });

    Materialize.toast("System settings successfully resetted",2000);

    }

    //Resetting the Settings
    displayAlert(){
      var msg = "Do you really want reset settings ?";
      this.modalTitle = msg;
      this.modalDialogMsg = 'this may affect system performace';
      this.modalCallBack = this.modalCallBacks[0];
      this.forceUpdate();
      toggleModal(this.modalSelector, true);
    }

    openModalSettings(){$('#modal-new-setting').openModal();}


    toggleEdit(event){


      var mSwitch =$('#setting-switch');
      var status = $(mSwitch).is(":checked");

      if (status) {
        var settings = $('.setting').attr('disabled',false);
        $(".setting-edit-icon").css({visibility:"visible"});

      } else {
        var settings = $('.setting').attr('disabled',true);
         $(".setting-edit-icon").css({visibility:"hidden"});
        this.saveChanges();

      }

    }


    upgrade(size){
                //kb
      if(size < 100){
        console.log("SIZE "+size);
        return;
      }
        $('.upgrading').show('slow');

      Meteor.call('setResource',
      {name:"package.tar.gz",size:size,path:'update',
      downloadPath:self.url+'updates/package.tar.gz'});

      Meteor.call('downloadResource');
      console.log('done started');
      var cancelProgress = false;

      self.mInterval =setInterval(function () {

        Meteor.call('getResourceProgress',[],function(err,result){

                    if(err){
                      return;
                    }

                      var resourceSize = result.resourceSize;
                      var resourceIndex = result.resourceIndex;
                      var chunkSize = result.chunkSize;
                      var chunkSizeDiff = result.chunkSizeDiff;
                      var resourceName = result.resourceName;

                      if (chunkSize == resourceSize && chunkSize !== 0 &&  !cancelProgress) {
                        cancelProgress = true;
                        clearInterval(self.mInterval);
                        console.log('done downloadResource');
                        // $('.sync-resource-main').children('i').removeClass('fa-spin');
                      // self.markTd(self.resourceIndex,'.tmp-resource','green');

                      var sudoPass = self.labledSettings['version'];

                      Meteor.call('runUpgrade',sudoPass,self.version);

                      self.checkUpdateProgress();

                    }

                      var progress = Math.floor(result.chunkSize/result.resourceSize*100);
                      console.log(result);

                      self.setState({
                        resourceSize:resourceSize,
                        resourceIndex:resourceIndex,
                        chunkSize:chunkSize,
                        chunkSizeDiff:chunkSizeDiff,
                        resourceName:resourceName,
                        resourceSize:resourceSize,
                        progress:progress,
                      });

        })

       }, 10);

    }


    saveChanges() {

        var settings = $('.edited');

        $.each(settings,function(k,v){
          let val =$(v).val();
          let name =$(v).attr('name');
          let id =$(v).attr('id');

          _Settings.update({
              _id: id
          }, {
              $set: {
                  'name': name,
                  'val': val,
              }
          })


        })

    }
    checkUpdates() {
      this.url = this.labledSettings['syncAddress'];
      this.version = this.labledSettings['version'];

      $.ajax({
      dataType: "JSON",
      url: self.url+'version',
      data: {},
      crossDomain:true,
      success: function(serverVserion,status){

        var sysVserion = self.labledSettings['version'];

      if(serverVserion > sysVserion){
      $('.upgrade').removeClass('hide');
      Materialize.toast("Please click the upgrade button below to update your system",7000);
    }else {
      Materialize.toast("Your system is up to update", 3000);
    }

    },
    error:function(error){
    console.log('Error ',error);

    }
    });

    }

getUpdateSize() {
          $.ajax({
    dataType: "JSON",
    url: self.url+'filesize?file=package.tar.gz&path=update',
    data: {},
    crossDomain:true,
    success: function(size,status){
        self.upgrade(size);
    },
    error:function(error){
    console.log('Error ',error);

    }
    });
}


    createSetting(event){
      event.preventDefault();

      var name = $('#setting-name').val();
      var val = $('#setting-value').val();
      var placeholder = $('#setting-placeholder').val();
      var category = $('#setting-category').val();
      var label = $('#setting-label').val();

      _Settings.insert({
          name: name,
          val: val,
          placeholder: placeholder,
          label: label,
          category: category,
          createdAt: new Date(),
      });
      $('#modal-new-setting').closeModal()
     Materialize.toast("Setting saved successfully!",3000);
    }

    toggleChange(id,event){
      $("#"+id).addClass('edited');
    }


    editModal(id, name, event){
      event.preventDefault();
      // var title = "Update Settings";
      // this.modalTitle = title;
      $("#modal-edit-setting").openModal();
      $('.setting-id').val(id);
      $('#modal-title').text("Update Details for " + name);

    }

    deleteSetting(isDelete,id,name){
      if(isDelete == true){
        this.delId =id;
        var msg = "Do you want to delete " + name ;
        this.modalTitle = msg;
        this.modalDialogMsg = "Delete "+ name;
        this.modalCallBack = this.modalCallBacks[1];
        this.forceUpdate();
        toggleModal(this.modalSelector, true);

    }else {

      _Settings.remove(self.delId);
      $("#modal").closeModal();

    }

      // var id = Session.get("setting-id");

    }


    deleteModal(id, name){
      // event.preventDefault();


  }

    updateSetting(event){
      event.preventDefault();
      // console.log($(".setting-id").val());
      var id = $(".setting-id").val();
      var name = $("#setting-name-edit").val();
      var value = $("#setting-value-edit").val();
      var placeholder = $("#setting-placeholder-edit").val();
      var category = $("#setting-category-edit").val();
      var label = $("#setting-label-edit").val();

    _Settings.update(
      {_id:id},
      {$set:{
        "name": name,
        "val": value,
        "placeholder":placeholder,
        "label":label,
        "category":category,
      }
    }
  );
  $(".clear").val("");


    }


    renderSettings(){

      if(this.props.settings  == undefined){
        return null;
      }

    this.props.settings.map((setting,index,thisArr)=>{
          index = setting.label;
          this.labledSettings[index] = setting.val
      });


      return this.props.settings.map((setting) => (

              // <div key={setting._id}>
              //     <div className="input-field ">
              //       <p  className="col s4" >{setting.name}</p>
              //         <input placeholder={setting.placeholder} id={setting._id} defaultValue={setting.val} onChange={this.toggleChange.bind(this,setting._id)}
              //           disabled={true} data-category={setting.category} type="text" className="validate col s6 setting" />
              //       </div>
              // </div>
              <tr key={setting._id}>
                <td>{setting.name}</td>
                <td>
                  <input placeholder={setting.placeholder} id={setting._id} defaultValue={setting.val} onChange={this.toggleChange.bind(this,setting._id)}
                          disabled={true} data-category={setting.category} type="text" className="validate col s6 setting" />
                </td>
                <td>
                  <a href="" className="fa fa-pencil setting-edit-icon" onClick={this.editModal.bind(this, setting._id, setting.name)}></a>
                </td>
                <td>
                  <a href=""  className="fa fa-times setting-edit-icon" onClick={this.deleteSetting.bind(this,true,setting._id,setting.name)}></a>
                </td>
              </tr>
      ))
    }







    render(){

      Meteor.setTimeout(function(){
        //Hide the Editing Button before toggle
        $(".setting-edit-icon").css({visibility:"hidden"});
      },
      10)

        return (
            <div>
                <Header/>

                <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/>



                <div id="modal-new-setting" className="modal">
                    <div ref='modal_edit' className="modal-content">
                        <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
                        <h4>{this.modalTitle}</h4>
                        <div className="row">
                            <form onSubmit={this.createSetting.bind(this)}>
                                <div className="row">
                                    <div className="input-field">
                                        <input placeholder="Name" id="setting-name" required="true" type="text" className="validate clear"/>
                                    </div>
                                    <div className="input-field">

                                        <input placeholder="Value" id="setting-value" required="true" type="text" className="validate clear"/>

                                    </div>
                                    <div className="input-field">
                                        <input placeholder="Placeholder" id="setting-placeholder" required="true" type="text" className="validate clear"/>
                                    </div>
                                    <div className="input-field">
                                        <input placeholder="Category" id="setting-category" required="true" type="text" className="validate clear"/>
                                    </div>
                                    <div className="input-field">
                                        <input placeholder="Label e.g syncAddress" pattern="[A-Za-z0-9\S]{1,25}" title="Must be one word" id="setting-label" required="true" type="text" className="validate clear"/>
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



                {/* The editing Modal */}
                <div id="modal-edit-setting" className="modal">
                    <div ref='modal_edit' className="modal-content">
                        <a href="" className="pull-right modal-action modal-close fa fa-times fa-1x waves-effect waves-green btn-flat"></a>
                        <h4 id="modal-title" className="center">Update Setting</h4>
                        <div className="row">
                            <form onSubmit={this.updateSetting.bind(this)}>
                                <div className="row">
                                    <div className="input-field">
                                        <input placeholder="Name" id="setting-name-edit" required="true" type="text" className="validate clear"/>
                                        <input className="setting-id" hidden="true"/>
                                    </div>
                                    <div className="input-field">
                                        <input placeholder="Value" id="setting-value-edit" required="true" type="text" className="validate clear"/>
                                    </div>
                                    <div className="input-field">
                                        <input placeholder="Placeholder" id="setting-placeholder-edit" required="true" type="text" className="validate clear"/>
                                    </div>
                                    <div className="input-field">
                                        <input placeholder="Category" id="setting-category-edit" required="true" type="text" className="validate clear"/>
                                    </div>
                                    <div className="input-field">
                                        <input placeholder="Label e.g syncAddress" pattern="[A-Za-z0-9\S]{1,25}" title="Must be one word" id="setting-label-edit" required="true" type="text" className="validate clear"/>
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
                <Sidenav active={3}/>
                <h4></h4>
                </div>

                <div className="col m1">
                </div>











                <div className="col m8 ">

                <div className="col m10 container">
                        <div className="col m12 s12">
                            <h4>Settings</h4>

                          </div>

                      <div className="settings ">

                        <div className="switch col s4">
                    <label>
                      Save
                      <input type="checkbox"  id="setting-switch" onClick={this.toggleEdit.bind(this)}/>
                      <span className="lever"></span>
                      Edit
                    </label>
                  </div>

                  <div className="col s3">
                    <button className="btn green darken-4 fa fa-plus" onClick={this.openModalSettings.bind(this)} >New</button>

                  </div>
                  <div className="col s3">
                    <button className="btn blue darken-4 fa fa-plus" onClick={this.checkUpdates.bind(this)} >Check updates</button>

                  </div>



                      </div>
                      <div className="col m12 " >
                        <table>
                          <thead>
                            <tr>

                              <th></th>
                              <th></th>
                              <th></th>

                          </tr>
                          </thead>
                          <tbody>
                            {this.renderSettings()}
                          </tbody>
                        </table>



                          {/* {this.renderSettings()} */}

                          <div className="col s4 offset-m7 pull-right">
                            <button   className="hide btn red darken-4 fa fa-save upgrade" onClick={this.getUpdateSize.bind(this)} > Upgrade</button>

                          </div>
                          <div className="col s4  pull-left">
                            <button   className="btn grey darken-4 fa reset-settings" onClick={this.displayAlert.bind(this)} >Set Defaults</button>
                          </div>
                      </div>


                </div>

                </div>
            </div>



            </div>
        )
    }
}




export default createContainer(() => {
    return {
        settings: _Settings.find({}).fetch(),
    }
}, SyncSettings);
