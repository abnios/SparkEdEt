import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {_Institution} from "../../Collections/collections.js";

export  class RegisterHeader extends Component {


    render() {
      var inst = this.props.institution;
      var name = '';
      var tag = '';
      if(inst){
        name = inst.name;
        tag = inst.tagline;
      } else {
        // return ''
      }

        return (
          <div className="">
              {/*=====start fixed top na=====*/}
              <div className="navbar-fixed">
                  <nav>
                      <div className="nav-wrapper">
                          {/*<ul className="right hide-on-med-and-down" id="menu-list">*/}

                          {/*</ul>*/}
                          <a href="/" className="brand-logo" id="logo">
                              <i className="fa fa-home fa-2x" id="home-icon"></i>
                              <p id="title">{name}</p>
                          </a>
                          <a href="#" data-activates="mobile-demo" className="button-collapse">
                              <i id="bars" className="fa fa-bars"></i>
                          </a>
                          <p id="subTitle">{tag}</p>
                      </div>
                  </nav>
              </div>
              {/*======end fixed top navbar======*/}
          </div>
        )
    }
}
export default createContainer(()=>{
  return {
    institution: _Institution.findOne(),
  }
},RegisterHeader)
