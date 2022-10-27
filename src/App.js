import logo from './logo.png';
import './App.css';
import { useState, useEffect } from 'react'
import Music from './components/Music';
import requests from "./components/requests";

const API_KEY = process.env.REACT_APP_API_KEY;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

function App() {
  const [inputTerm, setInputTerm] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);
  const [data, setData] = useState([]);

  const fetchToken = async(param) => {
    const response = await fetch(requests.fetchToken, param)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))

    return response;
  }

  const fetchData = async() => {
    let search_param = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }

    const new_releases = await fetch(requests.fetchNewReleases, search_param)
      .then(result => result.json())
      .then(data => setData(data.albums.items))
    
    return new_releases;
  }
  
  useEffect(() => {
    var authorization_param = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${API_KEY}`
    }

    fetchToken(authorization_param);
    const intervalID = setInterval(fetchToken, 3600000, authorization_param);
  }, [])

  useEffect(() => {
    fetchData();
  }, [accessToken])

  const search = async(param) => {
    let search_param = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }

    let artist_id = await fetch(`${requests.fetchArtistId}${param}&type=artist`, search_param)
      .then(result => result.json())
      .then(data => {return data.artists.items[0].id})

    let albums = await fetch(`${requests.fetchAlbums}${artist_id}/albums?include_groups=album&market=RS&limit=50`, search_param)
      .then(response => response.json())
      .then(data => setAlbums(data.items))

    return albums;
  }  

  const fix_name = (param) => {
    const text = param.replace(/\s+/g, ' ').toLowerCase().trim();
    const words = text.split(' ');

    for(let i = 0; words.length > i; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }

    return words.join('')
  }

  const handleOnChange = (event) => {
    if(event.target.value === '' || event.target.value.length === 1) {
      fetchData();
      setInputTerm('')
      return;
    } 
    setInputTerm(fix_name(event.target.value));

    return search(inputTerm)
  }

  return (
    <div className="App">
        <img src={logo} className="logo" alt="logo" />
        <div className='container'>
          <input 
          className='search'
          placeholder='Search for your favorite artist...'
          type='search'
          autoComplete="off"
          onChange={handleOnChange}
          />
     
        </div>
        <div className='albums'>
        {inputTerm.length !== 0 ? 
          albums.map(album => <Music key={album.id} isSearched={true} {...album}/>
          ) : data.map(item => <Music key={item.id} isSearched={false} {...item}/>)}
        </div>
    </div>
  );
}

export default App;
