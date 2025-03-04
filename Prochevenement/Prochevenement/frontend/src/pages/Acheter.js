import React, { Component } from 'react';
//import './App.css';

class Acheter extends Component {
    async Creation(event) {
        if (event) {
            event.preventDefault(); 
            var user=[document.getElementById("nom").value,document.getElementById("courriel").value, document.getElementById("postal").value, document.getElementById("password").value];
            document.location.href="Magasiner";
        }
        }
    render() { 
        return <div>
        <a href="Magasiner">Magasiner</a>
        <br></br>
        <a href="Parametres">Parametres</a>
        <br></br>
        <a href="Calendrier">Calendrier</a>
        <br></br>
        <a href="Panier">Panier</a>
        <br></br>
        <a href="Propos">Propos</a>

        <form onSubmit={this.Creation}>
            <input type="text" id="nom"/>
            <br></br>
            <input type="text" id="courriel"/>
            <br></br>
            <input type="text" id="numerocarte"/>
            <br></br>
            <input type="text" id="expiration"/>
            <br></br>
            <input type="text" id="codesecurite"/>
            <br></br>
            <input type="text" id="addresse"/>
                               <br></br>
                        <button id="submit" color="primary" type="submit">Confimer

</button>
                </form>







</div>
  }
}
 
export default Acheter;