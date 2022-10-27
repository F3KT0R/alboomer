const base_url = 'https://api.spotify.com/v1/';

const requests = {
    fetchNewReleases: `${base_url}browse/new-releases?country=RS`,
    fetchToken: `https:accounts.spotify.com/api/token`,
    fetchArtistId: `${base_url}search?q=`,
    fetchAlbums: `${base_url}artists/`,
};

export default requests;
