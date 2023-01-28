import React, { useState } from 'react';
import './styles/App.css';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';


const planets = [
  {
    name: "Mercury",
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
    console.log(planet)
    return planet
  });
}

function App() {
  const [bday, setBday] = useState(0);
  const [planetArray, setPlanetArray] = useState({});

  const handleSubmit = (bday) => {
    console.log(new Date(bday).toLocaleDateString())
    setPlanetArray(processPlanets(bday, planets))
  }

  return (
    <div style={{padding:20}}>
    <Container component="main" maxWidth="md">
      <Grid container spacing={2}>

      <Grid item xs={12}>
      <Typography variant="h2" style={{padding:20,fontFamily:"Star Jedi, sans-serif"}}>Space Birthday</Typography>
      </Grid>
        <Grid style={{padding:20}} item xs={12}  md={8}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <MobileDatePicker
            style={{margin:20}}
            label="Your Birthday"
            value={bday}
            onChange={(newValue) => {
              setBday(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          </Stack>
        </LocalizationProvider>
      </Grid>
      <Grid direction="column"
            alignItems="center"
            justify="center"   
            container
            xs={12}
            md={4}>
        <Button 
          onClick={()=>handleSubmit(bday)}
          color='primary'
          size='large'
          style={{margin:'auto'}}
          variant="outlined" >Submit</Button>
      </Grid>
      <Grid container xs={12}>
          {planetArray.length ?
        <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Planet</TableCell>
            <TableCell align="right">Your Age</TableCell>
            <TableCell align="right">Your Next Birthday</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {planets.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
              <Avatar alt="Remy Sharp" src={`/planets/${row.name.toLowerCase()}.png`} />
                {row.name}
              </TableCell>
              <TableCell align="right">{row.years - 1}</TableCell>
              <TableCell align="right">{row.when}({row.years})</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    : ""}
        </Grid>
      </Grid>
      <Grid direction="column"
            alignItems="center"
            justify="center"   
            container
            xs={12}>
      <div>
        &copy; <a href="https://dariuszkorolczuk.com" target="_blank">Dariusz Korolczuk</a> 2023
      </div>
      </Grid>
    </Container>
    </div>
  );
}

export default App;
