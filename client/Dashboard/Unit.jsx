import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { _Units,  _SearchData, _Notifications } from '../../Collections/collections.js';
import {Session} from 'meteor/session';
import {Meteor} from 'meteor/meteor';
import Header from '../layouts/Header.jsx';
import {toastMsg} from '../Notifications/SysMsg';
import ManageUnits from './ManageUnits.jsx';
import Sidenav from './Sidenav.jsx';

export  class Unit extends Component {

constructor(){
  super();
  isHidden = false;

}

    MoreTopics(action,event) {
        event.preventDefault();
        var topics= $('.topic');

        // console.log(action);
        if (action == 1 && topics.length == 1 && isHidden) {
           $('.topics :last').show()
           isHidden = false;
        }else if (action == 1) {
          let topics = $('.topic').clone(false);
          const clone = $(topics[0]).val('');
           $('.topics').append(clone);

        }else if(action == -1){
        isHidden = true;
        topics.length == 1 ?  $('.topics :last').attr("hidden",true) :$('.topics :last').detach();
      }
    }

    handleSubmit(event){
        event.preventDefault();

        var DOMTopics = $('.topic');
        var newUnit = $('.unit').val();
        var topics = [];
        var programId = FlowRouter.getParam('_id');
        var course = FlowRouter.getQueryParam('cs');
        var year = FlowRouter.getQueryParam('y');
        var user = Meteor.userId()

        var unitId = new Meteor.Collection.ObjectID().valueOf();
        var count = 0;

        $.each(DOMTopics, (k, v) => {

            var _id = new Meteor.Collection.ObjectID().valueOf();
            var val = ($(v).val());
            $(v).val('');

            if(k != 0){
              $(v).detach();
            }


            if(val == ''){
            // do nothing;
          } else {


            var topic = {
                name: val,
                _id: _id,
                unit: newUnit,
                unitId: unitId,
                createdBy: user
            };
            topics.push(topic);
            //insert into topic for
          Meteor.call('insertTopic',_id,unitId, val, newUnit, programId, year, course);

            //index for search purposes
            _SearchData.insert({
                _id: _id,
                _ids: {
                    unitId: unitId
                },
                name: val,
                category: 'topic',
                createdAt: new Date()
            });

            count++;
          }
        })

        //index for search purposes

        _SearchData.insert({_id: unitId, _ids: {}, name: newUnit, category: 'unit', createdAt: new Date()});

        toastMsg(1, "Unit Successfully added");

        $('.clear').val('');

        //insert unit
      Meteor.call('addUnit', unitId, newUnit, count, programId,year,course)


        var msg = `New ${newUnit} was created`;

        var _id = new Meteor.Collection.ObjectID().valueOf();
        //insert in Notifications
        Meteor.call('insertNotification',_id, unitId, msg);
        //reload the page after the insert

        $('.clear').val('');

    }

    //take back to Manage Units
    takeBack(event){
      event.preventDefault();
      return history.go('-1')
    }

    renderForm() {

        return (
          <div>

                <a href={`/dashboard/units/${FlowRouter.getParam('_id')}?cs=${FlowRouter.getQueryParam('cs')}&y=${FlowRouter.getQueryParam('y')}`}>
                  <button className="btn fa fa-angle-left s12" role='submit'> Back </button>
              </a>
            <div className="card-panel">

                <div className="">

                    <h5 className="center large">Add New Unit and Its Topics</h5>
                     {/* <a href="" className=" btn-flat green right fa fa-angle-left" onClick={this.takeBack.bind(this)}> Back to Units</a> */}

                </div>

                <form className="new-topic" name='new-topic' onSubmit={this.handleSubmit.bind(this)}>
                    <div className='input-field'>
                        <input type="text" name='topic[]' className='unit clear' placeholder="Add Unit" required/>
                    </div>

                    <div className='topics input-field'>
                        <input type="text" ref="TextInput" name='topic[]' className='topic clear' placeholder="Add Topic" />
                    </div>
                    <div className="row">
                        <button className="btn green darken-4 fa fa-plus s12" onClick={this.MoreTopics.bind(this,1)}> </button>
                        <button className="btn red darken-4 fa fa-minus s12" onClick={this.MoreTopics.bind(this,-1)}> </button>

                        <button className="btn fa fa-floppy-o pull-right s12" role='submit'> Save </button>
                    </div>
                </form>
                <br/>

            </div>
          </div>

        )

    }



    render() {

        return (
            <div>
                <Header/>
                <div className=''>
                  <div className="row">
                  <div className="col m3">
                  <Sidenav active={' dash-active'}/>
                  <h4></h4>
                  </div>

                    <div className="col m8 ">
                      <div className="card">
                        {this.renderForm()}
                      </div>

                    </div>
                </div>
                </div>
            </div>
        )

    }

}

export default createContainer(() => {
  Meteor.subscribe('topics');
    return {units: _Units.find().fetch()}
}, Unit);
