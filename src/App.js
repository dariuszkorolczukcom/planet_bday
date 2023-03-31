import React, { useState } from 'react';
import ReactGA from "react-ga";
import './styles/App.css';

import { FacebookShareButton, FacebookIcon } from 'react-share';

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

const ShareOnFacebookButton = ({ tableData }) => {
  const createImageFromTable = () => {
    const table = document.querySelector('table');
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = table.offsetWidth;
    canvas.height = table.offsetHeight;

    img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(table.outerHTML)));

    img.onload = () => {
      context.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      const blob = dataURLtoBlob(dataURL);
      shareOnFacebook(blob);
    };
  };

  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  };

  const shareOnFacebook = (blob) => {
    const file = new File([blob], 'table.png', { type: 'image/png' });
    const data = new FormData();
    data.append('file', file);

    fetch('https://graph.facebook.com/v12.0/me/photos?access_token=your-access-token', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.link)}&amp;src=sdkpreparse`);
      });
  };

  return (
    <FacebookShareButton url={'https://www.space-birthday.net/'}>
      <FacebookIcon size={32} round={true} onClick={createImageFromTable} />
    </FacebookShareButton>
  );
};

const useAnalyticsEventTracker = (category="space birthday") => {
  const eventTracker = (action = "submit birthday date", label = "submit birthday") => {
    ReactGA.event({category, action, label});
  }
  return eventTracker;
}

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
  const gaEventTracker = useAnalyticsEventTracker('Contact us');
  const [bday, setBday] = useState(0);
  const [planetArray, setPlanetArray] = useState({});

  const handleSubmit = (bday) => {
    gaEventTracker(bday)
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
      <Grid container>
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
        <Grid>
        <ShareOnFacebookButton tableData={planets} />
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
