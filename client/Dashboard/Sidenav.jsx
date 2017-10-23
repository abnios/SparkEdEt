import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Meteor from 'meteor/meteor';
import { Tracker } from 'meteor/tracker'

// TODO: Removed the unecessary setActiveItem()
/*
  You can use this.props.active to set the active class in a simpler way
*/

export default class Sidenav extends Component {

  render(){

    return(
      // BEGIN SIDE BAR
      <div className="side-bar">
        <div className="dashboard-side-nav side-nav fixed">
          {/* begin list */}
          <ul className="item-container">
            <li onClick=''>
              <a disabled="true"  id="dashtweek" href="#" className="center" >
                  Dashboard
              </a>
            </li>
             {/*<li className="divider"></li>*/}
            <li>
              <a href="/dashboard/accounts" className="side-list">
                <i className={`fa fa-user fa-lg ${this.props.accounts}`}></i>&nbsp;Accounts
              </a>
            </li>
            <li>
              <a href="/dashboard/school" className="side-list">
                <i className={`fa fa-book fa-lg ${this.props.school}`}></i>&nbsp;School
              </a>
            </li>
            <li>
              <a href="/dashboard/overview" className="side-list">
                <i className={`fa fa-bar-chart fa-lg ${this.props.stats}`}></i>&nbsp;Statistics
              </a>
            </li>
            <li>
              <a href="/feedback" className="side-list">
                <i className={`fa fa-comments fa-lg ${this.props.feedback}`}></i>&nbsp; Feedback
              </a>
            </li>
            <li>
              <a href="/egranary" className="side-list">
                <i className={`fa fa-plus-square fa-lg ${this.props.general}`}></i>&nbsp; General
              </a>
            </li>
            <li>
              <a href="/dashboard/list_topics" className="side-list">
                <i className={`fa fa-angle-right fa-lg ${this.props.topics}`}></i>&nbsp; All Topics
              </a>
            </li>
            <li>
              <a href="/dashboard/list_resources" className="side-list">
                <i className={`fa fa-file-o ${this.props.resources}`}></i>&nbsp; All Resources
              </a>
            </li>
            <li>
              <a href="/dashboard/settings" className="side-list">
                <i className={`fa fa-gear fa-lg ${this.props.settings}`}></i>&nbsp;  Settings
              </a>
          </li>
          <li>
            <a href="/slidings" className="side-list">
              <i className={`fa fa-picture-o ${this.props.sliding}`}></i>&nbsp;  Change Slider
            </a>
        </li>

            <li>
              <a href="/sync" className="side-list">
              <i className="fa fa-refresh fa-lg"></i>&nbsp;  SYNC
              </a>
            </li>
            <li>
              <a href="#" className="small" >
                <span  className="sideHide item">
                   <code>version 1.1</code>
                 </span>
               </a>
           </li>
        </ul>
        {/* end list (ul) */}
      </div>
    </div>
    //END SIDE-BAR
    )
  }
}
