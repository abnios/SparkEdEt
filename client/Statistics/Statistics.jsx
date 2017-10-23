import React,{ Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { _Statistics } from '../../Collections/collections.js';
import { Meteor }  from 'meteor/meteor';

export default class Statistics{


}


  export  function insertStatistics(data){

    Meteor.call('insertUsage',data,function(err,result){

    })
}
