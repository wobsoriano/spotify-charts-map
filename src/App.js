import { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { QueryCache, ReactQueryCacheProvider, useQuery } from 'react-query';

import MapChart from './MapChart';
import Loader from './Loader';
import './App.css';

const queryCache = new QueryCache();

export default function App() {
  const [content, setContent] = useState('');
  const { isLoading, data } = useQuery('repoData', () =>
    fetch(
      'https://raw.githubusercontent.com/wobsoriano/spotify-charts-map/master/data/spotifycharts.json'
    ).then((res) => res.json())
  );

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <div className="App">
        <h1 className="Title">Spotify Top Tracks by Region</h1>
        <div className="Subtitle">Hover on a country to see the most streamed track of the day</div>

        {isLoading ? <Loader /> : <MapChart countries={data} setTooltipContent={setContent} />}

        <div className="Footer-text">
          Powered by{' '}
          <a
            className="Link"
            href="https://spotifycharts.com/regional"
            target="_BLANK"
            rel="noopener noreferrer"
          >
            Spotify Charts
          </a>
        </div>
        <ReactTooltip html={true}>{content}</ReactTooltip>
      </div>
    </ReactQueryCacheProvider>
  );
}
