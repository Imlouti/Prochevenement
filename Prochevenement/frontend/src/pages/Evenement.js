import React from 'react';



function Evenement() {
     
  function Creation(event) {
    if (event) {
        event.preventDefault(); 
        document.location.href="Magasiner";

        
  
    }
    }


    function getEvent(){
      let message = localStorage.getItem("event");
      if(message!=null){
      message=message.split(",");
      return [message[0],message[1], message[2],message[3],message[4],message[5]]
      }
      else{
        return ["","","","",""]
      }

    }

        return(
        
         <div id="background">
                      <p id="two">

                <section id="back">
                <a href="Magasiner" id="img"><img src="fleche.png"></img></a>
        </section>
        
</p>
        
                    
                    <form onSubmit={Creation()}>
                    <h1>
        {getEvent()[0]}
                </h1>
                <h2>
                {getEvent()[1]}
                </h2>
                <a>  {getEvent()[2]}</a>
                    <a>  {getEvent()[3]}</a>
                    <a>  {getEvent()[4]}</a>
                    <a>  {getEvent()[5]}</a>
                        <button id="submit" color="primary" type="submit" class='button'>Acheter</button>
                </form>



                    <a id="hidden">Pas de billets restant.</a>






</div>
    )
}
 
export default Evenement;