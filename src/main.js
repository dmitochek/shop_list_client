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
            SelectedList: null,
            PrListName: null
        };
        this.SelectedList = this.SelectedList.bind(this);
        this.PreviousListName = this.PreviousListName.bind(this);
    }

    SelectedList(list)
    {
        this.setState({
            SelectedList: list
        });
        console.log("You are observing list: " + list);
    }

    PreviousListName(list)
    {
        this.setState({
            PrListName: list
        });
        console.log("After renaming list, previous name: " + list);
    }


    render()
    {
        return (
            <Router>
                <div className="main">
                    <Switch>
                        <Route exact path="/">
                            <Mainheader UsID={this.props.UserID} ListChosen={this.SelectedList} PreviousListName={this.PreviousListName} />
                            <Showlist UsID={this.props.UserID} ListChsn={this.state.SelectedList} PrevListNm={this.state.PrListName} />
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}