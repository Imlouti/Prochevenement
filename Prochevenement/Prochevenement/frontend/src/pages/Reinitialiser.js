
import React, { Component } from 'react';
import './styles.css';

class Reinitialiser extends Component {
    async Reinitialiser(event) {
        if (event) {
            event.preventDefault(); 
            if(document.getElementById("newpassword").value!=document.getElementById("newpasswordagain").value || null){
                document.getElementById("myDIV").style.display="block";
            }
            else{
            var user=document.getElementById("newpassword").value;
            document.location.href="Connexion";
            }
        }
        }

    render() { 
        return <div>
        <img src="comment-choisir-jeux.jpg" ></img>
        <h1>
        Réinitialiser le mot de passe
        </h1>
        <form onSubmit={this.Reinitialiser}>
            <input type="text" id="newpassword"/>
            <br></br>
            <input type="text" id="newpasswordagain"/>
                               <br></br>
                        <button id="submit" color="primary" type="submit">Réinitialiser</button>
                </form>
        <a id="myDIV">Les mots de passe sont different.</a>


</div>
  }
}
 
export default Reinitialiser;