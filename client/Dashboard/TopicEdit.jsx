import React, { Component } from 'react';
import { Mongo } from 'meteor/mongo';


export default class TopicsEdit extends Component {



    render(){


        return(
            <div>
                <form className="formCenter" onSubmit={this.handleSubmit.bind()}>
                     <div className="row">
                        <div className="input-field">
                            <input id="topic" type="text" defaultValue={user.profile.fname} className="validate field" placeholder="First name"/>
                        </div>
                    </div>
                    </form>

            </div>

        )

    }


}
