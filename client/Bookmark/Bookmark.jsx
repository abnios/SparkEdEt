import React, { Component, Proptypes } from 'react';
import Header from '../layouts/Header.jsx';
import {createContainer} from 'meteor/react-meteor-data';
import { _Bookmark } from '../../Collections/collections.js';

export  class Bookmark extends Component {

  constructor() {
      super();

      this.isDelete = false;

      this.state = {
          subscription: {
              users: Meteor.subscribe('allUsers')
          }
      }
    }

     showBookMark(path,event){

      if (!this.isDelete) {
         location.href = path;
      }
      this.isDelete = false;





     }


     removeBookMark(id,event){
       this.isDelete = true;
       _Bookmark.remove({_id:id});
     }



  renderPageData(){

    if(this.props.bookmarksCount === 0){
      return (
      <tr>
          <td>You have not bookmarked any page or all bookmarked records are removed</td>
      </tr>
      )
    }

    return this.props.bookmarks.map((bookmark)=>(

      <tr onClick={this.showBookMark.bind(this,bookmark.path)} key={bookmark._id} className="pointer" style={{backgroundColor:bookmark.color}}>
        <td>{ bookmark.title} </td>
        <td>{ bookmark.description}</td>
        <td>{ new Date(bookmark.createdAt).toString()}</td>
        <td onClick={this.removeBookMark.bind(this,bookmark._id)} className="fa fa-times red darken-3"></td>

      </tr>
    ));

  }
getBack(){
  return history.back();
}

renderUserName(){
  var user = this.props.user;
  if(user == undefined){
    return null;
  }
  else {
    return <span>{user.profile.fname} {user.profile.lname}</span>;
  }

}
showNav(event){
  event.preventDefault();
  $('.sidenav').show("slow");
}


  render(){
    return(
  <div>

        <div className="row">



      <div className="col">
            {/* <div className=""> */}
                  <h5 className="blue-text center">My Bookmarks</h5>
            {/* </div> */}


        <table className="highlight">
              <thead>
                  <tr>
                    <th> </th>
                    <th> </th>
                    <th></th>
                    <th></th>
                  </tr>
              </thead>

              <tbody>

                {this.renderPageData()}

              </tbody>
          </table>
      </div>
    </div>
    </div>
    )
  }
}


export default createContainer((param) => {
  Meteor.subscribe('bookmarks');
  return {
    bookmarks : _Bookmark.find({user:Meteor.userId()},{sort:{color:1}}).fetch(),
    bookmarksCount : _Bookmark.find({user:Meteor.userId()},{sort:{color:1}}).count(),
  }
}, Bookmark);
