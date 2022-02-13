import './App.css';
import React from 'react';
import Main from "./main";
import { BrowserRouter } from "react-router-dom";

export default class App extends React.Component
{
  render()
  {
    return (
      <BrowserRouter>
        <div className="App">
          <Main />
        </div>
      </BrowserRouter>
    );
  }
}
