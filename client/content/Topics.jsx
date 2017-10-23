import React, {Component} from 'react';
import { PropTypes } from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data'; //helper for getting data from a Collection
import {_Topics} from '../../Collections/collections.js';
import {insertStatistics} from '../Statistics/Statistics.jsx';
import {setActiveItem} from '../Utilities/Utilities.jsx';
import { Session } from 'meteor/session';

export  class Topics extends Component {
  componentDidMount(){
    setActiveItem(Session.get('activetopic'), 'topic', 'cardListItem');
  }
    saveUsage(id, name, url) {
        setActiveItem(id, 'topic', 'cardListItem');
        var material = name;
        var urlData = FlowRouter.current();
        var page = 'TOPIC';
        var user = Meteor.userId();
        var date = new Date();
        var data = {
            id: id,
            material: material,
            url: url,
            page: page,
            user: user,
            date: date
        };
        insertStatistics(data);
       Session.set('topicName',name);
       Session.set('activetopic',id);
      FlowRouter.go(url);
    }
    renderTopic() {
        var index = 0;
        if (this.props.topics === undefined) {
            return null;
        }
        return this.props.topics.map((topic) => (
            <li
                key={index++}
                onClick={this.saveUsage.bind(this,topic._id,topic.name,
                    `/contents/${this.props.unitId}?rs=${topic._id}`)}
                id={topic._id}
                className={"link topic cardListItem"}
                >
                    <div id="selectedTopic"> {topic.name}</div>
            </li>
        ))
    };
    render() {
        return (
        <ul className="topic-item-container">
            {this.renderTopic()}
        </ul>
        )
    }
}
Topics.propTypes = {
    unitId: PropTypes.string.isRequired
};
export default createContainer((param) => {
  Meteor.subscribe('topics');

    return {
        topics: _Topics.find({unitId: param.unitId}).fetch()
    }
}, Topics);
