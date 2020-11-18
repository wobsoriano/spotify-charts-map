const path = require('path');
const fs = require('fs');
const https = require('https');
const csv = require('@fast-csv/parse');

const countries = require('./data/countries.json');

async function getTopTrackPerCountry(countryCode) {
    let data
    return new Promise((resolve) => {
        https.get(`https://spotifycharts.com/regional/${countryCode}/daily/latest/download`, function(response) {
            csv.parseStream(response, { skipRows: 2 })
            .on('error', error => console.log(error))
            .on('data', row => {
                if (!data) {
                    data = row;
                }
            })
            .on('end', () => {
                if (data.length === 5) {
                    const obj = {
                        trackName: data[1],
                        artist: data[2],
                        streams: data[3],
                        url: data[4]
                    }
                    console.log('resolving', obj);
                    resolve(obj);
                } else {
                    resolve()
                }
            });
        });
    })
}

const pathToData = path.join(__dirname, 'data/spotifycharts') + '.json';

async function run() {
    const data = {};
    for (const country of Object.keys(countries)) {
        const result = await getTopTrackPerCountry(country);
        if (result) {
            data[country.toUpperCase()] = result;
        }
    }
    fs.writeFileSync(path.resolve(pathToData), JSON.stringify(data));
}
  
run();