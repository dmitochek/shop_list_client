import './App.css';
import React from 'react';
import Main from "./main";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default class App extends React.Component
{
  render()
  {
    return (
      <div className="App">
        <Main UserID={"617bc8a123dbfde68b8faf0c"} />
      </div>
    );
  }
}
