
import async from 'async';
import fs from 'fs';

import fetchPageSongs from './src/fetchPageSongs.js';


async function main() {
    const count = 2000;
    const startIndex = 1;
    const endIndex = startIndex + count - 1;

    const indices = [...Array(count).keys()].map((_, i) => i + startIndex);
    console.log(`Fetching songs info: ${indices[0]}-${indices[indices.length - 1]}`);

    const songs = await async.concatLimit(
        indices,
        5,
        async (index) => {
            console.log(`Fetch: ${index}`);
            const songs = await fetchPageSongs(index);
            console.log(`Fetch done: ${index}`);
            
            return songs;
        }
    );

    console.log(`Got songs: ${songs.length}`);
    const data = JSON.stringify(songs);
    const filename = `songs-list-${startIndex}-${endIndex}.json`;
    fs.writeFileSync(filename, data);
}

main();

