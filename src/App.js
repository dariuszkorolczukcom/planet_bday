import React, { useState, useRef, useEffect } from 'react';
import ReactGA from "react-ga";
import './styles/App.css';
import { toJpeg, toBlob } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FacebookProvider, ShareButton } from 'react-facebook';
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
  const componentRef = useRef();
  const gaEventTracker = useAnalyticsEventTracker('Contact us');
  const [bday, setBday] = useState(0);
  const [planetArray, setPlanetArray] = useState({});
  // const [shareImageUrl, setShareImageUrl] = useState("");
  const [shareDataUrl, setShareDataUrl] = useState("");

  const convertToImage = async () => {
    try {
      const file = componentRef.current
      const dataUrl = await toJpeg(file, { quality: 0.95 });
      // const blob = await toBlob(file, { quality: 0.95 })
      // console.log( typeof dataUrl)
      // console.log( blob instanceof Blob)
      setShareDataUrl(dataUrl)
      // const url = URL.createObjectURL(blob)
      // setShareImageUrl(url);
      // console.log(url)
    } catch (error) {
      console.error('Błąd podczas konwersji komponentu na zdjęcie:', error);
    }
  };

useEffect(() => {
  // Update the document title using the browser API
  console.log("shareDataUrl",shareDataUrl);
});

  const downloadPicture = async () => {
    console.log("downloadPicture", shareDataUrl)
    saveAs(shareDataUrl, 'planet-birthday.jpg');
  }

  const handleSubmit = async (bday) => {
    gaEventTracker(bday)
    console.log(new Date(bday).toLocaleDateString())
    await setPlanetArray(processPlanets(bday, planets))
    await convertToImage()
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
    <>
    <TableContainer component={Paper}>
      <Table 
        aria-label="simple table"
        ref={componentRef}
      >
        <TableHead>
          <TableRow>
            <TableCell colSpan={3} align="center">
              <Typography variant="p" style={{padding:20,fontFamily:"Star Jedi, sans-serif"}}>
                www.space-birthday.net
              </Typography>
            </TableCell>
          </TableRow>
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
        <FacebookProvider appId="YOUR_APP_ID">
          {/* <ShareButton href={shareDataUrl}>
            Kliknij, aby udostępnić zdjęcie
          </ShareButton> */}
          <Button onClick={()=>downloadPicture()}>Pobierz</Button>
        </FacebookProvider>
    </>
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
