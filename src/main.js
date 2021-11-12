import './App.css';
import React from 'react';
import Mainheader from './mainheader'
import Showlist from './showlist'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


export default class Main extends React.Component
{
    constructor(props)
    {
        super(props);
        console.log("Logged user: " + this.props.UserID);
        this.state = {
            SelectedList: null
        };
        this.SelectedList = this.SelectedList.bind(this);
    }

    SelectedList(list)
    {
        this.setState({
            SelectedList: list
        });
        console.log("You are observing list: " + list);
    }

    render()
    {
        return (
            <Router>
                <div className="main">
                    <Switch>
                        <Route exact path="/">
                            <Mainheader UsID={this.props.UserID} ListChosen={this.SelectedList} />
                            <Showlist UsID={this.props.UserID} ListChsn={this.state.SelectedList} />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}