
import axios from "axios";
import cheerio from "cheerio";


export default async function fetchPageSongs(page=1) {
    const resp = await axios.get(`https://bsaber.com/songs/top/page/${page}/?time=all`);
    const $ = cheerio.load(resp.data);
    const songs = [];

    $('article.post').each((i, el) => {
        const song = {};
        const $el = $(el);

        const titleEl = $el.find('.post-title .entry-title a');
        const downloadUrlEl = $el.find('a.action.post-icon.bsaber-tooltip.-download-zip');
        const userRating = $el.find('.circle_rating.rwp_user_score_styles > span').text();
        const postRating = $el.find('.circle_rating.post_ratings_average_styles > span').text();
        const statsEl = $el.find('[class="post-stat"]');

        song.url = titleEl.attr('href');
        song.title = titleEl.text().replace(/^\s+|\s+$|\s+(?=\s)/g, "");
        song.urlId = song.url.split('songs/')[1].split('/')[0];
        song.downloadUrl = downloadUrlEl.attr('href');
        song.userRating = Number.parseFloat(userRating) || null;
        song.postRating = Number.parseFloat(postRating) || null;
        song.likes = Number.parseFloat($(statsEl[0]).text()) || null;
        song.dislikes = Number.parseFloat($(statsEl[1]).text()) || null;

        songs.push(song);
    });

    return songs;
}


