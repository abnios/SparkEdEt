import React, { Component } from 'react';
import Header from './Header.jsx';


export default class NotFound extends Component{

  render(){
    return(
      <div>
      <Header />
        <h1 className="notFoundHead">404 !</h1>
        <h3 className="notFound"> Oooops Page not Found Take me <a href="/">Home</a></h3>


      </div>


    )
  }
}
