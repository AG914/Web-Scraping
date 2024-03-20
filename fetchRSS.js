const puppeteer = require('puppeteer');
const Parser = require('rss-parser');
const parser = new Parser();
const rssUrls = require('./rssUrls');

async function getLinksAndTitlesFromRSS(urls) {
  
  const allnews = [];

  for (const url of urls) {
	
	let rssLink = url;
	const feed = await parser.parseURL(rssLink);
	
	const news = feed.items.map(item => ({
	  title: item.title,
	  link: item.link,
	  domain: new URL(rssLink).hostname
	}));
	
	allnews.push(...news);
	
  }

  return allnews;
}

getLinksAndTitlesFromRSS(rssUrls)
  .then(news => {
	console.log(news);
	// Sauvegarder les news dans un fichier JSON de manière synchrone
	const path = require('path');
	const fs = require('fs');
	
	const filePath = path.join(__dirname, 'news.json');
	fs.writeFileSync(filePath, JSON.stringify(news, null, 2));
  })
  .catch(err => {
	console.error(err);
  });
