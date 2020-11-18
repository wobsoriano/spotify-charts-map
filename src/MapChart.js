import React, { memo } from 'react';
import { useQuery } from 'react-query';
import { ZoomableGroup, ComposableMap, Geographies, Geography, Graticule } from 'react-simple-maps';
import Loader from './Loader';

import './MapChart.css';

const geoUrl =
  'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

const withCommas = (num) => Intl.NumberFormat().format(num);

const MapChart = ({ setTooltipContent }) => {
  const { isLoading, data } = useQuery('repoData', () =>
    fetch(
      'https://raw.githubusercontent.com/wobsoriano/spotify-charts-map/master/data/spotifycharts.json'
    ).then((res) => res.json())
  );

  if (isLoading) return <Loader />;

  return (
    <>
      <ComposableMap style={{ maxHeight: '80vh' }} data-tip="">
        <ZoomableGroup>
          <Graticule stroke="gray" />
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const exists = Object.keys(data).find((i) => i === geo.properties.ISO_A2);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    stroke="#fff"
                    onMouseEnter={() => {
                      const { NAME, ISO_A2 } = geo.properties;
                      if (exists) {
                        const countryData = data[ISO_A2];
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
                        const { url } = data[geo.properties.ISO_A2];
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
