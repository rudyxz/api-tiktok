import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: false, message: 'No TikTok URL provided' });
  }

  try {
    const response = await axios.post('https://snaptik.app/abc2', new URLSearchParams({ url }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    const $ = cheerio.load(response.data);
    const links = [];
    $('.download a').each((i, el) => {
      const href = $(el).attr('href');
      if (href?.startsWith('https://')) links.push(href);
    });

    if (!links.length) {
      return res.status(500).json({ status: false, message: 'Download link not found' });
    }

    res.json({
      status: true,
      creator: 'Rudy404',
      result: {
        video_nowm: links[0],
        mirror_links: links,
        description: '',
        profile_picture: '',
        username: '',
        nickname: '',
        slides: []
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Failed to scrape snaptik', error: error.message });
  }
}
