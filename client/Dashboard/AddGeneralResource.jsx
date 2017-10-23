import React, {Component} from 'react';
import {_Egranary} from '../../Collections/collections.js';
import Header from '../layouts/Header.jsx';
import {toastMsg} from '../Notifications/SysMsg.jsx';
import Sidenav from './Sidenav.jsx';

export default class AddGeneralResource extends Component {

    handleSubmit(event) {
        event.preventDefault();

        var webName = $('#name').val();
        var link = $('#link').val();
        var summary = $('#textarea').val();
        var _id = new Meteor.Collection.ObjectID().valueOf();

        _Egranary.insert({_id: _id, name: webName, link: link, text: summary, createdAt: new Date()});
        toastMsg(1, "Website successfully Added");

        $('.clear').val('');
    }

    showNav(event) {
        event.preventDefault();
        $('.sidenav').show('slow');
    }

    render() {

        return (
            <div>
                <Header/>
                <div className="row">
                    <div className="col m3">
                        <Sidenav general={' dash-active'}/>
                    </div>
                    <div className="col m1">

                    </div>

                    <div className="col m8">
                        <div className="">
                            <h4>Add Offline Websites Here</h4>
                        </div>

                        <div className="row">
                            <form className="" onSubmit={this.handleSubmit.bind(this)}>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input id="name" type="text" className="clear validate" placeholder="Website Name" required/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input id="link" type="text" className="clear validate" defaultValue="http://localhost/" required/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <textarea id="textarea" className="clear materialize-textarea" maxLength="100" required placeholder="Add Summary of less than 100 letters"></textarea>
                                    </div>
                                </div>
                                <div className="row">
                                    <button className="btn fa fa-floppy-o pull-right s12" role='submit'> Save</button>
                                </div>
                            </form>
                        </div>
                        <div className="row">
                            <h4>
                                <a href="/contents/551020b36b38d8cf05e383b1?rs=551020b36b38d8cf05e383b1&">Add Extra Resources</a>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}
