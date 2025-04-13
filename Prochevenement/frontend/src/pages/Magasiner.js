import React, { Component } from 'react';
import { EventTable } from "../components/EventTable";
import { Navigator } from '../components/Navigator';

//import './App.css';

class Magasiner extends Component {

  render() {
    return (<div id="background">
      
      <Navigator/>

      <EventTable></EventTable>
      
      <a href="Evenement">Evenement</a>


      </div>
    )
  }
}
 
export default Magasiner;