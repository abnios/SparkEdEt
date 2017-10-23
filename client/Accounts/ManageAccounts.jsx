import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import Header from '../layouts/Header.jsx';
import {ModalDialog, toggleModal} from '../Utilities/Modal/Modal.jsx';
import {Mongo} from 'meteor/mongo';
import {handleCheckboxChange, handleCheckAll, getCheckBoxValues} from '../Utilities/CheckBoxHandler.jsx';
import Pagination, { getPageNumber, validatePageNum, getQuery } from '../Utilities/Pagination/Pagination.jsx';
import {initInput, SearchView,filterUrl} from '../Utilities/Utilities.jsx';
import {SearchField} from '../Utilities/Utilities.jsx';
import Sidenav from '../Dashboard/Sidenav.jsx';

export  class ManageAccounts extends Component {

    // subscribing to the Uses
    constructor() {
        super();
        this.state = {
            subscription: {
                users: Meteor.subscribe('allUsers')
            }
        }

        this.limit = 5;
        // this.itemPerPage = 2;
        this.modalCallBacks = [this.deleteUsers, this.approveUsers, this.suspendUsers];
        this.modalCallBack = () => {};
        this.modalTitle = 'default title';
        this.modalId = "modal"; //default modal id
        this.modalSelector = "#" + this.modalId;
        this.modalDialogMsg = "My default dialog message";

    }

    deleteUsers(isDelete) {
        var users = getCheckBoxValues('chk');
        let _user = users.length > 1
            ? " Users"
            : " User";

        if (users.length < 1) {
            Materialize.toast("Please check alteast one user!", 4000);
            return;
        }

        if (!isDelete) {
            var msg = "Do you really want to delete " + users.length + _user;
            this.modalTitle = msg;
            this.modalDialogMsg = "";
            this.modalCallBack = this.modalCallBacks[0];
            this.forceUpdate();
            toggleModal(this.modalSelector, true);
            return;
        }

        toggleModal(this.modalSelector, false);
        var count = 0;
        users.forEach(function(v, k, arra) {
            Meteor.users.remove(v);
            count++;
        });
        if (count) {
          $("#modal").closeModal();

            Materialize.toast(count + " " + _user + " users successfully deleted", 4000);
        }

    }

    approveUsers(isApprove) {
        var users = getCheckBoxValues('chk-appr');
        let _user = users.length > 1
            ? " Users"
            : " User";

        if (users.length < 1) {
            Materialize.toast("Please check alteast one user!", 4000);


            setTimeout(function () {

              filterUrl("appr");
            }, 2000);

            return;
        }

        if (!isApprove) {
            var msg = "Do you really want to approve " + users.length + _user;
            this.modalTitle = msg;
            this.modalDialogMsg = "";
            this.modalCallBack = this.modalCallBacks[1];
            this.forceUpdate();
            toggleModal(this.modalSelector, true);
            return;
        }

        toggleModal(this.modalSelector, false);
        var count = 0;
        users.forEach(function(v, k, arra) {
            Meteor.users.update({
                _id: v
            }, {
                $set: {
                    "profile.status": 1
                }
            }, (error, success) => {
                console.log(success); //ToDO
            });
            count++;
        });
        if (users.length > 0) {

          toggleModal(this.modalSelector, false);
          $("#modal").closeModal();

            Materialize.toast(users.length + " " + _user + " successfully Approved!", 4000);
        }

    }

    suspendUsers(isSuspend) {
        var users = getCheckBoxValues('chk-ban');
        let _user = users.length > 1
            ? " Users"
            : " User";

        if (users.length < 1) {
            Materialize.toast("Please check alteast one user!", 4000);
            setTimeout(function () {

              filterUrl("sspd");
            }, 2000);
            return;
        }

        if (!isSuspend) {
            var msg = "Do you really want to Suspend " + users.length + _user;
            this.modalTitle = msg;
            this.modalDialogMsg = "";
            this.modalCallBack = this.modalCallBacks[2];
            this.forceUpdate();
            toggleModal(this.modalSelector, true);
            return;
        }

        toggleModal(this.modalSelector, false);
        var count = 0;
        users.forEach(function(v, k, arra) {
            Meteor.users.update({
                _id: v
            }, {
                $set: {
                    "profile.status": 2
                }
            }, (error, success) => {
                console.log(success);
            });
            count++;
        });

        if (users.length > 0) {
          $("#modal").closeModal();

            Materialize.toast(users.length + " " + _user + " successfully Suspended!", 4000);
        }

    }
    render() {
        var count = 1;
        var users = this.props.users;
        return (
            <div>
                <Header/>
                <ModalDialog id={this.modalId} title={this.modalTitle} callBack={this.modalCallBack} msg={this.modalDialogMsg}/>

                    {/* <Sidenav active={2}/> */}
                <div className="row">
                  <div className="col m3">
                    <Sidenav accounts={' dash-active'}/>
                  </div>
                    <div className="col m9">

                    <div className="row">
                        <div >
                            <h4>Manage Accounts</h4>
                        </div>
                        <div className="col m8">
                          {/* <span>search users</span> */}
                          <SearchField action={"/accounts"} name={"accounts"} placeholder={"search user by name,email"} query={"s"}/>
                          {/* <SearchView action={"/accounts"} name={"accounts"} placeholder={"search user by name,email"} query={"q"}/> */}
                        </div>
                    </div>

                    <div className="row">
                            <div className="col m3 s3">
                                <button className="btn red darken-3 fa fa-remove" onClick={this.deleteUsers.bind(this, false)}> Delete</button>
                            </div>

                            <div className="col m3 s3">
                                <button className="btn  fa fa-check" onClick={this.approveUsers.bind(this, false)}> Approve</button>
                            </div>

                            <div className="col m3 s3">
                                <button className="btn grey darken-3 fa fa-ban" onClick={this.suspendUsers.bind(this, false)}> Suspend</button>
                            </div>
                            <div className="col m3 s3">
                                <a href="/register">
                                    <button className="btn green darken-4 fa fa-plus"> New
                                    </button>
                                </a>
                            </div>

                    </div>

                    <table className=" striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Status</th>
                                <th >Edit</th>
                                <th onClick={handleCheckAll.bind(this, 'chk-all', 'chk')}>
                                    <input type="checkbox" className='filled-in chk-all' readOnly/>
                                    <label>Check All</label>
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {users.map((user) => {

                                var status = user.profile.status;
                                var statusIcon = 'fa-clock-o  '; //default waiting approval
                                var chkboxStatus = 'chk-appr  '; //default waiting approval
                                var email = user.emails;
                                email = email == undefined
                                    ? 'null'
                                    : email[0].address;
                                if (status == 1) {
                                    statusIcon = "fa-check-circle ";
                                    chkboxStatus = "chk-ban "
                                } else if (status == 2) {
                                    statusIcon = "fa-ban ";
                                }

                                return <tr key={user._id}>
                                    <td>{count++}</td>
                                    <td>{user.profile.fname}</td>
                                    <td>{user.profile.lname}</td>
                                    <td>{email}</td>
                                    <td>{user.profile.gender}</td>
                                    <td>
                                        <i className={"fa-2x fa " + statusIcon}></i>
                                    </td>
                                    <td>
                                        <a href={'/dashboard/editaccounts/' + user._id} className="fa fa-pencil"></a>
                                    </td>
                                    <td onClick={handleCheckboxChange.bind(this, user._id)}>
                                        <input type="checkbox" className={chkboxStatus + " filled-in chk chk" + user._id} id={user._id}/>
                                        <label></label>
                                    </td>
                                </tr>
                            })
                          }
                        </tbody>
                    </table>

                    <Pagination path={"/accounts"} itemPerPage={limit} query={getQuery(queryParams, true)} totalResults={this.props.count}/> {initInput()}</div>
                  </div>
             </div>
        )
    }

}




export function search() {
    var queryData = getQuery(queryParams, true, true);
    var query = queryData.s;

    // export const itemPerPage = 2;
    if (queryData.s !== "") {

           return [
              {
                  'emails.address': query
              }, {
                  'emails.lname': query
              }, {
                  'profile.fname': query
              }
          ];

    }else if (queryData.appr !== "") {
       return  [
          {
              'profile.status': 0
          }
      ];
    }else if (queryData.pend !== "") {
      return  [
         {
             'profile.status': 2
         }
     ];
   }else if (queryData.sspd !== "") {
     return  [
        {
            'profile.status': 1
        }
    ];
   }else {
      return [{}];
    }

}

export const limit = 5;
export var query = 's';
export const queryParams = [
    {param: 's' },
    {param: 'appr' },
    {param: 'pend' },
    {param: 'sspd' },

]; //prepare search query paramaters

export default createContainer(() => {
    //$or:search()
    return {

        users: Meteor.users.find({
            $or: search()
        }, {sort:{"profile.status":1},
            skip: getPageNumber(limit),
            limit: limit
        }).fetch(),
        count: Meteor.users.find({$or: search()},{sort:{"profile.status":1}}).count()
    };
}, ManageAccounts);
