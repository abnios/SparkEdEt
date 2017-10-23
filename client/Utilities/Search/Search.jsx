import { Session } from 'meteor/session';
import React, {Component} from 'react';
import { PropTypes } from 'prop-types';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {Mongo} from 'meteor/mongo';


export  class Search extends Component {

  constructor(){
    super();
     this.COUNT = "_COUNT";
  }


  render(){
    return(
        <div>

          {Session.set(this.props.session,this.props.searcResults)}
          {Session.set(this.props.session+this.COUNT,this.props.count)}
        </div>

    )
  }

}

export function refineSearch(searchData){
    //pass empty object if these options are specified
    //??? validate data type ?????
    var limit = searchData.limit == undefined ? 0:searchData.limit;
    var sort = searchData.sort == undefined ? {}:searchData.sort;
    var skip = searchData.skip == undefined ? 0:searchData.skip;
    var fields = searchData.fields == undefined ? {}:searchData.fields;
    return {limit:limit,sort:sort,skip:skip,fields:fields}
}

export function getSearchCriteria(criteria,data){

  if(criteria == 'OR' && Array.isArray(data)){
        return {$or:data};
  }else if (criteria == 'AND' && typeof data == 'object') {
      return data;
  }else {
    return {};//return all fields
  }

}


export default createContainer((params) => {
    var options = refineSearch(params);
    return {
        searcResults: params.coll.find(getSearchCriteria(params.criteria,params.data),options).fetch(),
        count:params.coll.find(getSearchCriteria(params.criteria,params.data)).count()
    };
}, Search);


Search.propsTypes = {
  criteria: PropTypes.string.isRequired,
  coll: PropTypes.object.isRequired,
  session: PropTypes.string.isRequired,//name of the sessions
}
