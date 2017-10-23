import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {_Feedback} from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import Sidenav from './Sidenav.jsx';

export class Feedback extends Component {

    renderComments() {
        var comments = this.props.feedback;
        if (this.props.feedback == undefined) {
            return null;
        }

        return comments.map((feedback) => (
            <ul key={feedback._id} className="collapsible popout" data-collapsible="accordion">

                <li>
                    <div className="collapsible-header">
                        <i className="fa fa-user "></i>{feedback.createdBy}

                        <a href={feedback.link} className="blue-text right">Source</a>
                      </div>
                    <div className="collapsible-body">
                      {/* Yet to include the "flow-text" to make the text more responsive and larger */}
                        <p className="">{feedback.feedback}</p>
                    </div>
                </li>

                {/* <li className="collection-item avatar">
                    <a href="" className="fa fa-user circle fa-3x"></a>
                    <span className="title">{feedback.createdBy}</span>
                    <p>{feedback.feedback}</p>
                </li> */}
            </ul>

        ))
    }

    render() {
        // console.log(this.props.feedback)
        Meteor.setTimeout(function(){
          $('.collapsible').collapsible();

        }, 5)

        return (

            <div className="">
                <Header/>
                <div className="row">
                    <div className="col m3">
                        <Sidenav feedback={' dash-active'}/>
                    </div>
                    <div className="col m1">

                    </div>
                    <div className="col m8">
                        <h3 className="center blue-text">Users Feedback</h3>
                        <div className="row">
                            <div className="">

                                {this.renderComments()}

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}

export default createContainer(() => {
  Meteor.subscribe('feedbacks');
    return {feedback: _Feedback.find({}, {
            sort: {
                createdAt: -1
            }
        }).fetch()}
}, Feedback)
