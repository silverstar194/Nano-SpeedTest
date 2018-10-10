import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="nav nav-tabs">
          <li className="nav-item">
            <a className="nav-link active" href="#SpeedTest">
            Speed Test</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#Stats">
            Statistics</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#Info">
            More Info</a>
          </li>
        </div>
          <h1 className="page-header text-center">
            Welcome to NanoSpeed.live</h1>
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <button type="button" className="btn btn-success btn-circle btn-xl">Go</button>
                <br/>
                <button type="button" className="btn btn-outline-primary">Advanced</button>
                <br/>
                Run your live test now.
              </div>
            </div>
          <div/>
        </div>
      </div>
    );
  }
}

export default App;
