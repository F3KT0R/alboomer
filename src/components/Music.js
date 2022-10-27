import './Music.css';

function Music({name, images, total_tracks, release_date, isSearched, artists, external_urls}) {
    
    return (
        <div className='Music'>
            <a href={external_urls.spotify} target="_blank" rel="noopener noreferrer"><h3 className='title'>{name}</h3></a>
            {isSearched === false ? <h4 className='artist'>{`by \n ${artists[0].name}`}</h4> : ''}
            <img src={images[0].url} alt={name} className='poster'/>
            <h3 className='songs'>Songs: {total_tracks}</h3>
            <h3 className='release'>{release_date}</h3>
        </div>
    )
}

export default Music