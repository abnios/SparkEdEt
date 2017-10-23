import {Meteor} from 'meteor/meteor';
import {_Resources, _SearchData, _Notifications, _Topics, _Institution, _Sliding} from '../Collections/collections.js';
import {toastMsg} from './Notifications/SysMsg.jsx';
import {renderTopic} from './Dashboard/EditResources.jsx';
import { Session } from 'meteor/session';


Meteor.startup(function() {
  Meteor.subscribe('institution');
  Meteor.subscribe('topics');
  Meteor.subscribe('resources');
  Meteor.subscribe('slidings');

    Uploader.finished = function(index, file) {
        var resourcName = $('#resource_name').val();
        var topicId = FlowRouter.getParam('_id');
        let institution = _Institution.findOne();
        let instId = institution._id;

        if (FlowRouter.getRouteName() === 'Institution') {

        _Institution.update(
          {_id:instId},
          {$set:{
            name: Session.get('name'),
            tagline: Session.get('sub'),
            logo:resourcName,
            file:file
          }
        }
      );
          toastMsg(true, 'The New Logo was successfully Uploaded');
      }
      else if (FlowRouter.getRouteName() === 'Sliding') {
      //   _Sliding.update(
      //     {_id:slidingId},
      //     {$set:{
      //       name: Session.get('name'),
      //       // tag: Session.get('sub'),
      //       tag:resourcName,
      //       file:file
      //     }
      //   }
      // );
      //     toastMsg(true, 'The New sliding was successfully Uploaded');

              var slidingId = new Meteor.Collection.ObjectID().valueOf();
              // var _id = new Meteor.Collection.ObjectID().valueOf();
              // var unit = _Topics.findOne({_id:topicId});
              // var unitId = unit.unitId;
              // var unitName = unit.name;

              Meteor.call('addSliding',slidingId, resourcName, resourcName, file,
              function(err){
                if (err) {
                  Session.set('error', err.reason);
                    console.log('Everything seems not okay with error');
                } else {
                  console.log('Everything seems okay');
                }}
              );

              //
              // _SearchData.insert({
              //     _id: resourceId,
              //     _ids: {
              //         topicId: topicId
              //     },
              //     name: resourcName,
              //     tag: 'resource',
              //     createdAt: new Date()
              // });

              let msg = `New resource ${resourcName} was uploaded under ${unitName} `
              // console.log(msg);

              // //insert in Notifications
              // _Notifications.insert({
              //   _id:_id,
              //   unitId:unitId,
              //   title: msg,
              //   createdAt: new Date(),
              //   read: false
              // });
              //
              // _Notifications.insert({_id: _id, title: msg, createdAt: new Date()})
              toastMsg(true, `Resource ${resourcName}successfully Uploaded`);
      }
      else  {

        var resourceId = new Meteor.Collection.ObjectID().valueOf();
        var _id = new Meteor.Collection.ObjectID().valueOf();
        var unit = _Topics.findOne({_id:topicId});
        var unitId = unit.unitId;
        var unitName = unit.name;

        Meteor.call('insertResource',resourceId, unit._id, resourcName, file,
        function(err){
          if (err) {
            Session.set('error', err.reason);
          } else {
            console.log('Everything seems okay');
          }}
        );


        _SearchData.insert({
            _id: resourceId,
            _ids: {
                topicId: topicId
            },
            name: resourcName,
            category: 'resource',
            createdAt: new Date()
        });

        let msg = `New resource ${resourcName} was uploaded under ${unitName} `
        // console.log(msg);

        //insert in Notifications
        _Notifications.insert({
          _id:_id,
          unitId:unitId,
          title: msg,
          createdAt: new Date(),
          read: false
        });
        //
        // _Notifications.insert({_id: _id, title: msg, createdAt: new Date()})
        toastMsg(true, 'Resource successfully Uploaded');
    }
  }
});
