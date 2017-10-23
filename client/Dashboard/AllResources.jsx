import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {_Resources} from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import Sidenav from './Sidenav.jsx';
import Pagination, { getPageNumber, validatePageNum, getQuery } from '../Utilities/Pagination/Pagination.jsx';
import Search  from '../Utilities/Search/Search.jsx';
import {SearchView, SearchField} from '../Utilities/Utilities';
import { Session } from 'meteor/session';

export  class AllResources extends Component {
      constructor(){
        super();
        this.SESSION_RESULTS = "RESOURCE_RESULTS";//
        this.SESSION_RESULTS_COUNT = "RESOURCE_RESULTS_COUNT";//
        this.itemPerPage = 10;
        this.totalResults = 0;
        this.queryParams = [{'param':'q'}];
      }

      componentDidMount(){

        var self = this;

        Tracker.autorun(function () {
          Session.get("RESOURCE_RESULTS");
          Session.get("RESOURCE_RESULTS_COUNT");

          self.setState({data:Session.get("RESOURCE_RESULTS")});
          self.setState({resultsCount:Session.get("RESOURCE_RESULTS_COUNT")});
        });
      }





    renderResources() {
        var count = 1;

          if(this.state == null || this.state.data == undefined){
            return null;
          }

          this.totalResults =this.state.resultsCount;

          return this.state.data.map((resource) => (
            <tr key={resource._id} onClick={this.handleUrl.bind(this, resource._id, resource.topicId)} className="link-section">
                <td>{count++}</td>
                <td>{resource.name}</td>
                <td>{resource.file.type.split('/')[1]}</td>
            </tr>
        ))
    }
    handleUrl(id, topicId, event) {
        event.preventDefault();
        FlowRouter.go(`/dashboard/view_resource/${id}`);
        return ;
    }

    getResources(){
      var query = getQuery(this.queryParams,true,true,'q');
      var searchParams = [{name:query}];
      if(query == ""){
        searchParams = [{}]
      }
      return (
        <Search limit={this.itemPerPage} skip={getPageNumber(this.itemPerPage)} coll={_Resources} session={this.SESSION_RESULTS} data={searchParams} criteria={"OR"} />

      )



    }

    render() {

        return (
            <div>
                <Header/>
                {this.getResources()}

                <div className="row">
                  <div className="col s3">
                    <Sidenav active={7}/>

                  </div>
                  <div className="col s1">

                  </div>
                {/* <span>
                    <a href="" onClick={this.showNav.bind(this)} className="fa fa-bars fa-3x"></a>
                </span> */}
                <div className="col s8">
                    <h4>List of All resources</h4>

              <div className="col m8 offset-m2">
                  {/* <SearchView action={"/dashboard/Units"} name={"accounts"} placeholder={"search user by name,email"} query={"q"}/> */}
                  <SearchField action={"/dashboard/list_resources"} name={"resources"} placeholder={"search all resources"} query={"q"}/>

              </div>


                    <table className="highlight">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Resource</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderResources()}
                        </tbody>
                    </table>
                </div>
                <Pagination path={'/dashboard/list_resources'} itemPerPage={this.itemPerPage} query={getQuery(this.queryParams, true)} totalResults={this.totalResults}  />
              </div>

            </div>
        )
    }

}

// No longer needed data pulled from sessions
export default createContainer(() => {
    return {
      resources: {}
}
}, AllResources);
