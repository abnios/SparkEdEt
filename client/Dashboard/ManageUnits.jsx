import { Session } from 'meteor/session';
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { _Units,_SearchData,_Deleted, _Courses } from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import { handleCheckboxChange,handleCheckAll,getCheckBoxValues } from '../Utilities/CheckBoxHandler.jsx';
import Sidenav from './Sidenav.jsx';
import {  toastMsg } from '../Notifications/SysMsg.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';
import Pagination, { getPageNumber, validatePageNum, getQuery } from '../Utilities/Pagination/Pagination.jsx';
import {initInput, SearchView,filterUrl,SearchField} from '../Utilities/Utilities.jsx';
import Search  from '../Utilities/Search/Search.jsx';

export  class ManageSections extends Component {
        constructor(){
          super();
          Meteor.subscribe('units');
          this.modalCallBacks = this.deleteUnits;
          this.modalCallBack = () => {};
          this.modalTitle = 'default title';
          this.modalId = "modal"; //default modal id
          this.modalSelector = "#" + this.modalId;
          this.modalDialogMsg = "My default dialog message";
          this.SESSION_RESULTS = "UNIT_RESULTS";//
          this.SESSION_RESULTS_COUNT = "UNIT_RESULTS_COUNT";//
          this.itemPerPage = 10;
          this.totalResults = 0;
          this.queryParams = [{'param':'q'}];


        }


        componentDidMount(){

          var self = this;

          Tracker.autorun(function () {
            Session.get("UNIT_RESULTS");
            Session.get("UNIT_RESULTS_COUNT");

            self.setState({data:Session.get("UNIT_RESULTS")});
            self.setState({resultsCount:Session.get("UNIT_RESULTS_COUNT")});
            //self.totalResults = Session.get("UNIT_RESULTS_COUNT");
          });
        }
        componentWillUnMount(){
            var self = this;
            self.setState({data:''});
        }

renderUnits(){


    var count = 1;

    if(this.state == null || this.state.data == undefined){
      return null;
    }

    this.totalResults =this.state.resultsCount;

    return this.state.data.map((unit) => (

      <Section key={unit._id} href={'/dashboard/editunit/'+ unit._id} count={count++} unit={{_id:unit._id,name:unit.name,createdBy:unit.createdBy,createdAt:unit.createdAt}}/>

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


  toastMsg(true, "Section Updated!");

  $("#modal-unit").closeModal();


}


deleteUnits(isDelete) {
    var Units = getCheckBoxValues('chk');
    let _unit = Units.length > 1
        ? " Units"
        : " Section";

    if (Units.length < 1) {
        Materialize.toast("Please check alteast one unit!", 4000);
        return;
    }


    if (!isDelete) {
        var msg = "Do you really want to delete " + Units.length + _unit;
        this.modalTitle = msg;
        this.modalDialogMsg = "";
        this.modalCallBack = this.modalCallBacks;
        this.forceUpdate();
        toggleModal(this.modalSelector, true);
        return;
    }

    toggleModal(this.modalSelector, false);
    var count = 0;
    Units.forEach(function(v, k, arra) {

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


  getUnits(){
    var query = getQuery(this.queryParams,true,true,'q');
    var searchParams = [{name:query}];
    if(query == ""){
      searchParams = [{}]
    }
    return (
      <Search limit={this.itemPerPage} skip={getPageNumber(this.itemPerPage)} coll={_Units} session={this.SESSION_RESULTS} data={searchParams} criteria={"OR"} />

    )

  }



    addUnits(event){
      event.preventDefault();
      $('#add-unit').openModal();


    }


  render() {

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

        {this.getUnits()}

          <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/>

          <div id="modal-unit" className="modal">
              <div ref='modal_edit' className="modal-content">
              <a href="" className="pull-right modal-action modal-close fa fa-times "></a>
                <h4>Edit The Section</h4>
                <div className="row">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                          <div className="row">
                              <div className="input-field">
                                <input placeholder="Section" id="unit" type="text" className="validate clear" />
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





          <div className="row">
          <div className="col m3">
          <Sidenav active={' dash-active'}/>
          <h4></h4>
          </div>

          <div className="col m1">
          </div>




           <div className="col m8">
                    <div className="">
                        <h4>Manage Units</h4>
                    </div>


        <div className="col m8 offset-m2">
            {/* <SearchView action={"/dashboard/Units"} name={"accounts"} placeholder={"search user by name,email"} query={"q"}/> */}
            <SearchField action={"/dashboard/Units"} name={"units"} placeholder={"search unit by name"} query={"q"}/>

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
                              onClick={this.deleteUnits.bind(this, false)}> Delete</button>
                          </div>
                          <div className="col m3">
                            <a href={`/dashboard/unit/${programId}?cs=${courseId}&y=${FlowRouter.getQueryParam('y')}`} >
                               <button className="btn green darken-4 fa fa-plus" > New</button>
                            </a>
                          </div>
                        </div>
                              <table className="highlight striped">
                                      <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Section</th>
                                            <th>Created At</th>
                                            <th>Edit Section</th>
                                            <th>Manage Topics</th>
                                            <th onClick={handleCheckAll.bind(this,'chk-all','chk')}>
                                            <input type="checkbox" className='filled-in chk-all'  readOnly />
                                            <label>Check All</label>
                                          </th>
                                        </tr>
                                      </thead>
                                       <tbody>

                                        {this.renderUnits()}

                                      </tbody>
                              </table>

                </div>

                <Pagination path={"/dashboard/Units"} itemPerPage={this.itemPerPage} query={getQuery(this.queryParams,true)} totalResults={this.totalResults}/>
    </div>
    </div>

    )
  }
}



export class Section extends Component {


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

    return(


        <tr key={ this.props.unit._id } className="link-unit">
        <td>{this.props.count}</td>
         <td onClick={this.handleUrl.bind(this, this.props.unit._id)}>{this.props.unit.name}</td>
         <td>{this.props.unit.createdAt.toDateString()}</td>
         <td><a href="" className="fa fa-pencil" onClick={this.displayModal.bind(this, this.props.unit._id, this.props.unit.name)}></a></td>
         <td><a href={'/manage_unit/'+this.props.unit._id} className='fa fa-pencil'></a></td>
         <td onClick={handleCheckboxChange.bind(this,this.props.unit._id)} >
                            <input type="checkbox" className={" filled-in chk chk"+this.props.unit._id} id={this.props.unit._id}  />
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
  Meteor.subscribe('deleted');

    return { //,{$or:m()}
     units: _Units.find({'details.courseId':getCourseId()}).fetch(),
     course: _Courses.findOne({_id:getCourseId()}),
     Units: []
    }
},ManageSections);
