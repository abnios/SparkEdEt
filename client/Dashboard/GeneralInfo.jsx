import React , { Component } from 'react';
import { _Egranary } from '../../Collections/collections.js';
import {createContainer} from 'meteor/react-meteor-data';
import Header from '../layouts/Header.jsx';
import ExtraResource from './ExtraResource.jsx';


export  class GeneralInfo extends Component {

handleUrl(link){
  window.open(link, '_blank');
}

  renderSites(){
    var count = 1;
    var sites = this.props.egranary;
    return sites.map((site)=>(
       <tr key={site._id} onClick={this.handleUrl.bind(this, site.link)} className="openLink">
          <td>{count++}</td>
          <td>{site.name}</td>
          <td>{site.text}</td>
        </tr>

    ))

  }

  render(){
    return(
      <div>
        <Header />
        <div className="container">
        <div className="row ">

        <ExtraResource />

        <div className="col l6 m6 s6  Extra">
        <div>
            <h4>Egranary Resources</h4>
        </div>


          <table className="bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>

            { this.renderSites() }

            </tbody>
          </table>
        </div>
        </div>
        </div>
      </div>
    )
  }
}

export default createContainer(()=>{
  return {
    egranary:_Egranary.find().fetch(),
  }
}, GeneralInfo)
