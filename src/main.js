import { PlaywrightCrawler, ProxyConfiguration } from 'crawlee';
import { router } from './routes.js';

const startUrls = ['https://www.makemytrip.com'];

const crawler = new PlaywrightCrawler({
    headless: false,
    requestHandler: router,
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 20,
});

await crawler.run(startUrls);
