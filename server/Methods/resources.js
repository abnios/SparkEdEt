import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _Resources } from '../../Collections/collections';


Meteor.methods({
  insertResource:function(resourceId,topicId,resource,file){
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      _Resources.insert({
          _id: resourceId,
          topicId: topicId,
          name: resource,
          file: file,
          sync: {
              kijabe: false,
              kisumu: false
          }
      });
    }
  },
  updateResource: function(id,resource){
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      _Resources.update({
          _id: id
      }, {
          $set: {
              'name': resource
          }
      });
    } else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  },
  removeResource: function(id){
    if (true) {
      _Resources.remove(id);
    }
    else {
      throw new Meteor.Error('oops', 'You are not allowed to not make changes');
    }
  }
})
