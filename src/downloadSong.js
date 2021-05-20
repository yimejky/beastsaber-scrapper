import axios from "axios";
import path from 'path';
import unzip from 'unzip-stream';
import fs from 'fs';
import sanitize from 'sanitize-filename';


export default async function downloadSong(song) {
    const { title, downloadUrl } = song;

    const res = await axios({
        url: downloadUrl,
        method: 'GET',
        responseType: 'stream',
        headers: {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-encoding': ' gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-gpc': '1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
        }
    });

    const responseUrlTmp = res.data.responseUrl.split('/');
    const filename = responseUrlTmp[responseUrlTmp.length - 1].split('.')[0];

    const filepath = path.resolve('./', 'songs', sanitize(`${title} - ${filename}`));
    if (fs.existsSync(filepath)) {
        console.log(`Download folder already exists`);
        return;
    } else {
        res.data.pipe(unzip.Extract({ path: filepath }));
    }
}

