import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _Topics } from '../../Collections/collections';

Meteor.methods({
  insertTopic: function(id,unitId, val, newUnit, programId, year, course){
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      _Topics.insert({
          _id: id,
          unitId: unitId,
          name: val,
          unit: newUnit,
          sync: {
              kijabe: false,
              kisumu: false
          },
          details:{
            programId:programId,
            year:year,
            courseId:course
          },
          createdAt: new Date(),
          createdBy: this.userId
      });
    }
    else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  updateTopic: function(id, topic){
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      _Topics.update(
        {_id:id},
        {$set:
          {'name': topic}}
      )
    }
    else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  removeTopic: function(id){
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      _Topics.remove(id);
    }
  },
  insertSingleTopic: function(id, unitId,newTopic,unitName){
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      _Topics.insert(
        {
          _id:id,unitId:unitId,name:newTopic,unit:unitName,createdAt:new Date(),createdBy: this.userId
        }
      )
    }
    else {
        throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  }
});
