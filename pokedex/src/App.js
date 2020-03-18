import React from 'react';
import { PokeList } from './components/List';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Pokedex</h1>
      <PokeList />
    </div>
  );
}

export default App;
