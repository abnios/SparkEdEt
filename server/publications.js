// This file should have all publications for all collections

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {
  _Sections,
  _Resources,
  _Statistics,
  _SearchData,
  _Topics,
  _Units,
  _Egranary,
  _Deleted,
  _Feedback,
  _Notifications,
  _School,
  _Programs,
  _Courses,
  _Institution,
  _Bookmark,
  _Sliding
} from '../Collections/collections';

 /*  Publish the subscribed users
     You can use callbacks for subscriptions to check when the sub is ready
     this can be used to make the custom loading
     this.ready() is used here instead of return an empty cursor of the subscriptions,
     this is to mark the subscriptions complete even when there is no data, it will send when available
*/

Meteor.publish('sections', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return _Sections.find({});
  });


Meteor.publish('programs', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return _Programs.find({});
  });

Meteor.publish('courses', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return _Courses.find({});
  });

Meteor.publish('units', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return _Units.find({});
  });

Meteor.publish('topics', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return _Topics.find({});
  });

Meteor.publish('resources', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return _Resources.find({});
  });


Meteor.publish('notifications', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return _Notifications.find({});
  });

Meteor.publish('schools', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return _School.find({});
  });

  Meteor.publish('slidings', function () {
    if (!this.userId) {
      this.ready();
      return;
    }
      return _Sliding.find({});
    });

Meteor.publish('allUsers', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
    return Meteor.users.find({});
  });

// left because it should always be publicly available
Meteor.publish('institution', function () {
    return _Institution.find({});
  });


Meteor.publish('user', function () {
    if (!this.userId) {
      this.ready();
      return;
    }
    return Meteor.users.find({_id: this.userId});
  });


Meteor.publish('statistics', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
      return _Statistics.find({});
    });

Meteor.publish('feedbacks', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
  return _Feedback.find({});
    });


Meteor.publish(null, function () {
  if (!this.userId) {
    this.ready();
    return;
  }
  return _Deleted.find({});
    });

Meteor.publish('egranary', function () {
  if (!this.userId) {
    this.ready();
    return;
  }
  return _Egranary.find({});
    });

  Meteor.publish('bookmarks', function () {
    if (!this.userId) {
      this.ready();
      return;
    }
    return _Bookmark.find({});
  });

Meteor.publish(null, function () {
  if (!this.userId) {
    this.ready();
    return;
  }
  return _SearchData.find({});
    });

  Meteor.publish(null, function (){
    return Meteor.roles.find({})
  })
