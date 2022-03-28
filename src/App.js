import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const planets = [
  {
      name: "Merkury",
      year: 87.969,
  },
  {
      name: "Venus",
      year: 224.65,
  },
  {
      name: "Mars",
      year: 687,
  },
  {
      name: "Jupiter",
      year: 4333,
  },
  {
      name: "Saturn",
      year: 10759,
  },
  {
      name: "Uranus",
      year: 30687,
  }
]

const countPlanetBirthday = (bday, planet) => {
  const today = Date.now();
  let next = new Date(bday).getTime();
  let years = 0
  const plYearMilis = planet.year * 1000 * 3600 * 24;
  do {
      years++
      next = next + (plYearMilis)
  } while (next < today)
  return [years, new Date(next).toLocaleDateString()]
}

const processPlanets = (bday, planets) => {
  return planets.map((planet) => {
    const [years, when] = countPlanetBirthday(bday, planet);
    planet.years = years;
    planet.when = when;
    return planet
  });
}

function App() {
  const [bday, setBday] = useState(0);
  const [planetArray, setPlanetArray] = useState({});

  const handleChange = (event) => {
    setBday(event.target.value)
  }

  const handleSubmit = (event) => {
    
    setPlanetArray(processPlanets(bday, planets))
    
    event.preventDefault();
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          When were you born?(YYYY-MM-DD)
          <input type="text" name="bday" value={bday} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      {planetArray.length ?
      <table>
      <thead>
        <tr>
          <th>Planet</th>
          <th>Year length</th>
          <th>Age</th>
          <th>Next Birthday</th>
        </tr>
      </thead>
      <tbody key="planets">
        {planets.map((planet) => {
          return (
            <tr >
              <td>{planet.name}</td>
              <td>{planet.year} days</td>
              <td>{planet.years - 1}</td>
              <td>{planet.when}({planet.years})</td>
            </tr>
          )
        })}
      </tbody>
    </table> : ""}
    </div>
  );
}

export default App;
