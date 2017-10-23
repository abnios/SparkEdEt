import React,{ Component } from 'react';
import { PropTypes } from 'prop-types';
import { _Topics } from '../../Collections/collections.js';
import { createContainer } from 'meteor/react-meteor-data';//helper for getting data from a Collection


export  class Unit extends Component{


  countTopics(){
        var index = 0;
        topics = this.props.topics;

        if(topics == undefined){
        return null;
        }

      return topics;

  }

  render (){
      var courseId = this.props.unit.details.courseId;
      var year = this.props.unit.details.year;
      var programId = this.props.unit.details.programId;


    return (
           <div className={"col m6 s12 l4 homeCards  cse-unit "+ courseId + ' yr' + year + ' ' + programId } id={'r'+this.props.unit._id} name={this.props.topics}>
            <div className="card-panel homeCardColor">
                <span className={"card-title "}><h5><a href={'/contents/'+this.props.unit._id+'?ref=home'} id="cardListTitle">{this.props.unit.name}</a></h5></span>
                <span className="badge dark">{this.countTopics()}</span>
             </div>
          </div>
      );
  }
}


Unit.propTypes = {
  unit: PropTypes.object.isRequired,
}

export default createContainer((params) => {
  Meteor.subscribe('topics');

  return {
    topics: _Topics.find({unitId:params.unit._id}).count(),
  }
}, Unit)
