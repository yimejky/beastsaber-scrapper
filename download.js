import fs from 'fs';
import async from 'async';
import path from 'path';
import sanitize from 'sanitize-filename';

import downloadSong from './src/downloadSong.js';


async function main() {
    const count = 2000;
    const startIndex = 1;
    const endIndex = startIndex + count - 1;

    const fileName = `songs-list-${startIndex}-${endIndex}.json`;
    const data = fs.readFileSync(fileName);
    const songs = JSON.parse(data);

    const parsed = songs
        .filter(song => song.likes > 400)
        .filter(song => song.userRating || song.postRating)
        .filter(song => song.userRating ? song.userRating > 4 : true);

    console.log(parsed.length);

    const songsFolders = fs.readdirSync(path.resolve('./', 'songs'));

    await async.eachLimit(
        parsed,
        1,
        async (song) => {
            console.log(`Download: ${song.title}`);

            let downloaded = false;
            while (!downloaded) {
                try {
                    const findTitle = sanitize(song.title);
                    const found = songsFolders.find(folder => folder.includes(findTitle));
                    if (found) {
                        console.log(`Download already exists: ${song.title}`);
                        return;
                    }

                    await downloadSong(song);

                    console.log(`Download done: ${song.title}`);
                    downloaded = true;
                } catch (err) {
                    console.log(`Download error: ${song.title}`);
                    console.error(err?.response?.status);
                    console.log(err);

                    await new Promise(res => setTimeout(res, 5000));
                }
            }
        }
    );
}

main();

