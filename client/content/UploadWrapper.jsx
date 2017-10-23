import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';


export default class UploadFile extends Component {
  componentDidMount(){
    this.view = Blaze.render(
    Template.file_upload,
      ReactDOM.findDOMNode(this.refs.container)
    );
  }

  componentWillUnMount(){
     // Clean up Blaze view
    Blaze.remove(this.view);
  }

  render(){
    // Just render a placeholder container that will be filled in
    return <div  ref='container' />
  }

   }
