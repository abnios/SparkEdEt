import React, { Component } from 'react';
import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';
import ReactDOM from 'react-dom';
import { Tracker } from 'meteor/tracker'
import { createContainer } from 'meteor/react-meteor-data';
import { _Units, _Topics } from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import ContentContainer from '../layouts/content-viewer.jsx';
import Footer from '../layouts/Footer.jsx';
import   Topics  from './Topics.jsx';
import   Resources  from './Resources.jsx';
import AccountsUIWrapper from '../Accounts/AccountsUIWrapper.jsx';
import { insertStatistics } from '../Statistics/Statistics.jsx';
import { Session } from 'meteor/session';
import { NavLinks } from './ViewResourceApp.jsx';
import { FloatingButton } from '../Utilities/Utilities.jsx';


export  class ContentsApp extends Component {

  constructor() {
      super();
      self = this;
      Session.set('isMounted',true);
      Meteor.subscribe('topics');
    }

    saveUsage(){

      var ref = FlowRouter.getQueryParam('ref');
      if(!ref || this.props.unit === undefined){
        return;
      }

      //check

      var user = Meteor.user();
      var _id = user._id;



      var id = FlowRouter.getParam('_id');
      var material = this.props.unit.name;
      var urlData = FlowRouter.current();
      var url = urlData.path;
      var date = new Date();
      var page = 'UNIT';
      var stats = user.profile.stats;
      var data = {id:id,material:material,url:url,page:page,user:_id,date:date,stats:stats};

      insertStatistics(data);
    }

componentWillUnMount(){
  Session.set('isMounted',false)

  // Blaze.remove(this.view);
};

componentDidMount(){
  $(window).on('popstate', function() {
     $('#forward').show();
   });

  self._mounted = true;
  this.saveUsage();//set
  Session.set('sectionId',FlowRouter.getParam('_id'));
  Tracker.autorun(function () {
     FlowRouter.watchPathChange();
      // console.log(Session.get('isMounted'));
    if(Session.get('isMounted') ){
      self.forceUpdate();
    }
});
}
    getBack(event){
      event.preventDefault();
      var stepBack = history.go(-1);
      return stepBack;
    }

    goForward(event){
      event.preventDefault();
      var stepHead = window.history.go(1);
      return stepHead;
    }



render(){
  var unitName = this.props.unit;

  if(unitName === undefined){
    return <div className="light-green ">Loading... </div>
  }
  else {
  unitName =  unitName.name;
  }
  $('.collapsible').collapsible();
  return (
  <div>
      <Header />
      {/*<ContentContainer />*/}
      <div className="unitContainer">
          <h4 id="unitName">{ unitName }</h4>
      </div>
        {/*=====BEGIN SIDE BAR =======*/}
            <div className="topic-side-nav side-nav fixed">
                    <div className="sideNavHeadingUnderline">
                        <p className="sideNavHeading">Topics</p>
                    </div>
                {/* begin list */}
                <Topics unitId={getUnitId()} />
                {/* end list (ul) */}
            </div>
       {/*=====END SIDE BAR======*/}
          <div className="selected_resouce_container" ref='contentContainer'>
            <h5 className="center topicName"> Topic:   {Session.get("topicName")}</h5>
            <Resources topicId={getTopicId()}   />
          </div>
      <FloatingButton />
    </div>

    )
  }
}

export function  getUnitId(){
  return FlowRouter.getParam('_id');
  }

  // export function  getTopicId(){
  //     let topicId = FlowRouter.getQueryParam('rs');
  //
  //     if(topicId === undefined){
  //     Session.set('topicName',"");//reset activetopic name
  //     Session.set('activetopic',-1);//reset activetopic id
  //
  //     return '1';
  //   }
  //
  //   return topicId
  //
  //   }

    export function  getTopicId(){
        let topicId = FlowRouter.getQueryParam('rs');
        let topics = _Topics.findOne({unitId:FlowRouter.getParam('_id')});

      if(topicId === undefined && topics !== undefined){
        return topics._id;
      } else if (topics === undefined) {
        return '1';
      }
      return topicId

      }

  export function getCurrentUrl(){
    var url = window.location.href;
    // var path = url.toString();
    Session.set('currentLocation', url);
    // var path = Session.get('currentLocation')

    // console.log(path);
    return path;
  }

export default createContainer(() => {
  Meteor.subscribe('units');
  return {
    unit:_Units.findOne({_id:getUnitId()}),

  }
},ContentsApp);
