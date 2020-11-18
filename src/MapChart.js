import React, { memo } from 'react';
import { useQuery } from 'react-query';
import { ZoomableGroup, ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';

import './MapChart.css';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const withCommas = (num) => Intl.NumberFormat().format(num);

const countriesWithSpotify = Object.keys(spotifyData);

const MapChart = ({ setTooltipContent }) => {
  const { isLoading, error, data } = useQuery('repoData', () =>
    fetch('https://api.github.com/repos/tannerlinsley/react-query').then((res) => res.json())
  );

  return (
    <>
      <ComposableMap style={{ maxHeight: '80vh' }} data-tip="">
        <ZoomableGroup>
          <Graticule stroke="gray" />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const exists = countriesWithSpotify.find((i) => i === geo.properties.ISO_A2);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    stroke="#fff"
                    onMouseEnter={() => {
                      const { NAME, ISO_A2 } = geo.properties;
                      if (exists) {
                        const countryData = spotifyData[ISO_A2];
                        setTooltipContent(
                          `${NAME}:<br />Track: <span style="font-weight: bold;">${
                            countryData.trackName
                          }</span><br />Artist: <span style="font-weight: bold;">${
                            countryData.artist
                          }</span><br/>Streams: <span style="font-weight: bold;">${withCommas(
                            countryData.streams
                          )}</span>`
                        );
                      }
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('');
                    }}
                    onClick={() => {
                      if (exists) {
                        const { url } = spotifyData[geo.properties.ISO_A2];
                        const win = window.open(url, '_blank');
                        win.focus();
                      }
                    }}
                    style={{
                      default: {
                        fill: exists ? '#1ed65f' : '#000',
                        outline: 'none',
                      },
                      hover: {
                        fill: exists ? '#1ed65f' : '#000',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
