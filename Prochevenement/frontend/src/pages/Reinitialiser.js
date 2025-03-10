
import React, { Component } from 'react';
import './styles.css';

class Reinitialiser extends Component {
    async Reinitialiser(event) {
        if (event) {
            event.preventDefault(); 
            if(document.getElementById("newpassword").value!=document.getElementById("newpasswordagain").value){
                document.getElementById("hidden").style.display="block";
            }
            else{
            var user=document.getElementById("newpassword").value;
            document.location.href="Connexion";
            }
        }
        }

    render() { 
        return <div id='background'>
                <section id="back">
                <a href="Oublier" id="img"><img src="fleche.png"></img></a>
        </section>
        <h1>
        Réinitialiser le mot de passe
        </h1>
        <form onSubmit={this.Reinitialiser}>
            <input type="text" id="newpassword" class='input' placeholder="Nouveau mot de passe"/>
            <input type="text" id="newpasswordagain" class='input' placeholder="Mot de passe encore"/>
                        <button id="submit" color="primary" type="submit" class='button'>Réinitialiser</button>
                </form>
        <a id="hidden">Les mots de passe sont different.</a>


</div>
  }
}
 
export default Reinitialiser;