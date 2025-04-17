import React, { Component } from 'react';
import { Navigator } from '../components/Navigator';
import { CartTable } from '../components/CartTable';
//import './App.css';

class Panier extends Component {

    render() { 
        return <div id="background">
        <Navigator/>
        <CartTable />
        <a href="Acheter">Acheter</a>

    </div>
  }
}
 
export default Panier;