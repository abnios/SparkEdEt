import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Header from '../../layouts/Header.jsx';
import { _SearchData } from '../../../Collections/collections.js';
import Pagination, { getQuery,validatePageNum,getPageNumber } from '../../Utilities/Pagination/Pagination.jsx';
import SearchListView from './SearchListView.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { insertStatistics } from '../../Statistics/Statistics.jsx';
import { Session } from 'meteor/session'


export  class SearchResults extends Component {

  constructor(){
    super();
  }


  componentDidMount(){
    this.saveUsage(FlowRouter.getQueryParam('q'));
}

  saveUsage(name){
    var id =  name;
    var material = name;
    var urlData = FlowRouter.current();
    var url = urlData.path;
    var page = 'search_results';
    var user = Meteor.userId();
    var date = new Date();
    var data = {id:id,material:name,url:url,page:page,user:user,date:date};
    insertStatistics(data);
  }


  renderSearchDisplay(){

  //  Session.set('page',FlowRouter.getParam('_id'));
    this.props.muks = 10;
    if(this.props.results.length == 0){
      return <tr><td><h6>Sorry no results found </h6></td></tr>;
    }else{

      return this.props.results.map((result) =>(

       <SearchListView   key={result._id} result={{_id:result._id,name:result.name,category:result.category,_ids:result._ids}} />

      ))

    }
  }
  render() {
    return(
      <div>
        <Header />
        <div className="container">
          <table>
            <thead>
              <tr>
                  <th>Showing results for {FlowRouter.getQueryParam('q') }</th>
              </tr>
            </thead>
            <tbody>
          {this.renderSearchDisplay()}
        </tbody>
        </table>

        <Pagination path={"/results"} query={getQuery(queryParams,true)}  itemPerPage={limit} totalResults={this.props.count}  />

      </div>
      </div>

    )
  }
}


export function getSort(param,sort){

  let paramValue = FlowRouter.getQueryParam(param);

   if(paramValue == undefined || value == ''){//if FlowRouter return undefined
     return {};
   }else{
     return {sort};

   }
}

export function search(){
  var queryData =getQuery(queryParams,true,true);
  var query = queryData.q;
  return query;
    }

export const limit = 5;
export var query ='q';//default search query param
export const queryParams = [{param:query}]; //prepare search query paramaters

export default createContainer(() => {
  return{
   results:_SearchData.find({name:search()},{skip:getPageNumber(limit),limit:limit}).fetch(),
   count:_SearchData.find({name:search()}).count(),
  }


},SearchResults);
