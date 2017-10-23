import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {_Topics, _Resources} from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import Sidenav from './Sidenav.jsx';
import Pagination, { getPageNumber, validatePageNum, getQuery } from '../Utilities/Pagination/Pagination.jsx';
import { Session } from 'meteor/session';
import Search  from '../Utilities/Search/Search.jsx';
import {SearchView, SearchField} from '../Utilities/Utilities';


export class AllTopics extends Component {

    constructor(){
      super();
      this.SESSION_RESULTS = "TOPICS_RESULTS";//
      this.SESSION_RESULTS_COUNT = "TOPICS_RESULTS_COUNT";//
      this.itemPerPage = 10;
      this.totalResults = 0;
      this.queryParams = [{'param':'q'}];
    }

    componentDidMount(){
      var self = this;

      Tracker.autorun(function () {
        Session.get("TOPICS_RESULTS");
        Session.get("TOPICS_RESULTS_COUNT");

        self.setState({data:Session.get("TOPICS_RESULTS")});
        self.setState({resultsCount:Session.get("TOPICS_RESULTS_COUNT")});
      });
    }

    getTopics(){
      var query = getQuery(this.queryParams,true,true,'q');
      var searchParams = [{name:query}];
      if(query == ""){
        searchParams = [{}]
      }
      return (
        <Search limit={this.itemPerPage} skip={getPageNumber(this.itemPerPage)} coll={_Topics} session={this.SESSION_RESULTS} data={searchParams} criteria={"OR"} />

      )
    }



    handleUrl(id,event) {
      FlowRouter.go(`/dashboard/edit_unit/${id}`);
        return;
    }


    renderAllTopics() {
        var count = 1;
        if(this.state == null || this.state.data == undefined){
          return null;
        }

        this.totalResults =this.state.resultsCount;

        return this.state.data.map((topic) => (
            <tr key={topic._id} onClick={this.handleUrl.bind(this, topic.unitId)} className="link-section">
                <td>{count++}</td>
                <td>{topic.name}</td>
                <td>{_Resources.find({'topicId': topic._id}).count()}
                </td>
            </tr>
        ));
    }

    render() {

        return (
            <div>
                <Header/>
                {this.getTopics()}

                <div className="row">
                    <div className="col m3">
                        <Sidenav active={6}/>
                        <h4></h4>
                    </div>
                    <div className="col m1">

                    </div>

                    <div className="col m8">
                        <h4>List of Topics</h4>
                    <div className="col m8 offset-m2">
                        {/* <SearchView action={"/dashboard/Units"} name={"accounts"} placeholder={"search user by name,email"} query={"q"}/> */}
                        <SearchField action={'/dashboard/list_topics'} name={"topics"} placeholder={"search for topics"} query={"q"}/>

                    </div>

                        <table className="highlight">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Topics</th>
                                    <th>Resources</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderAllTopics()}
                            </tbody>
                        </table>
                    </div>
                    <Pagination path={'/dashboard/list_topics'} itemPerPage={this.itemPerPage} query={getQuery(this.queryParams, true)} totalResults={this.totalResults}  />

                </div>
            </div>
        )
    }
}

export default createContainer(() => {
    return {
        topics:{}
        // logo:Images.find({}, {$sort:{'uploadedAt': -1}, limit:1}).fetch(),
    }
}, AllTopics);
