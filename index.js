import { chromium } from 'playwright';

async function fetchArticles(page, articles) {
  const newArticles = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('tr.athing'));
    return items.map(item => {
      const titleElement = item.querySelector('td.title span.titleline > a');
      const title = titleElement ? titleElement.innerText : "No title";
      const ageElement = item.nextElementSibling.querySelector('span.age');
      const time = ageElement ? ageElement.title : null; 
      return { title, time };
    });
  });
  articles.push(...newArticles);
}

async function sortHackerNewsArticles() {
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

 
  await page.goto('https://news.ycombinator.com/newest');

  const articles = [];

  // Click on the 'More' link to load the next set of articles
  while (articles.length < 100) {
    await fetchArticles(page, articles);

    if (articles.length >= 100) break;

    const moreLink = await page.$('a.morelink');
    if (moreLink) {
      await moreLink.click();
      await page.waitForTimeout(2000); 
    } else {
      break;
    }
  }

  // Print out the title and time of the first 100 articles
  articles.slice(0, 100).forEach((article, index) => {
    console.log(`Article ${index + 1} - Title: ${article.title}, Time: ${article.time}`);
  });

  // Check if the articles are sorted in descending order by time
  for (let i = 0; i < articles.length - 1; i++) {
    if (new Date(articles[i].time) < new Date(articles[i + 1].time)) {
      console.log("Articles are not sorted correctly.");
      await browser.close();
      return;
    }
  }

  console.log("Articles are sorted correctly.");
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
