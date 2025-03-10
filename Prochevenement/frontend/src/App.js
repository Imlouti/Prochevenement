import logo from './logo.svg';
import { Routes, Route } from 'react-router-dom'
import './App.css';

import Acceuil from './pages/Acceuil'
import Connexion from './pages/Connexion'
import Creation from './pages/Creation';
import Oublier from './pages/Oublier';
import Reinitialiser from './pages/Reinitialiser';
import Magasiner from './pages/Magasiner';
import Modifier from './pages/Modifier';
import Evenement from './pages/Evenement';
import Parametres from './pages/Parametres';
import Calendrier from './pages/Calendrier';
import Annuler from './pages/Annuler';
import Panier from './pages/Panier';
import Acheter from './pages/Acheter';
import Propos from './pages/Propos';
import Vendeur from './pages/Vendeur';
import ModifierEvenement from './pages/ModifierEvenement';
import AppercuMagasiner from './pages/AppercuMagasiner';
import AppercuEvenement from './pages/AppercuEvenement';
import AjouterEvenement from './pages/AjouterEvenement';




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Acceuil/>} />
        <Route path="/Connexion" element={<Connexion/>}/>
        <Route path="/Creation" element={<Creation/>}/>
        <Route path="/Oublier" element={<Oublier/>}/>
        <Route path="/Reinitialiser" element={<Reinitialiser/>}/>
        <Route path="/Magasiner" element={<Magasiner/>}/>
        <Route path="/Modifier" element={<Modifier/>}/>
        <Route path="/Evenement" element={<Evenement/>}/>
        <Route path="/Parametres" element={<Parametres/>}/>
        <Route path="/Calendrier" element={<Calendrier/>}/>
        <Route path="/Annuler" element={<Annuler/>}/>
        <Route path="/Panier" element={<Panier/>}/>
        <Route path="/Acheter" element={<Acheter/>}/>
        <Route path="/Propos" element={<Propos/>}/>
        <Route path="/Vendeur" element={<Vendeur/>}/>
        <Route path="/ModifierEvenement" element={<ModifierEvenement/>}/>
        <Route path="/AppercuMagasiner" element={<AppercuMagasiner/>}/>
        <Route path="/AppercuEvenement" element={<AppercuEvenement/>}/>
        <Route path="/AjouterEvenement" element={<AjouterEvenement/>}/>
      </Routes>
    </>
  );
}

export default App;
