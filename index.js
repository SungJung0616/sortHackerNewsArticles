const { chromium } = require("playwright");

async function getArticleTimes() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  // 페이지가 완전히 로드될 때까지 대기
  await page.waitForSelector('span.age');

  // 각 기사의 게시 시간 가져오기
  const times = await page.$$eval('span.age', spans => {
    return spans.map(span => span.getAttribute('title'));
  });

  // 기사 게시 시간 출력
  console.log("Article times:", times);
  console.log("Number of article times:", times.length);

  await browser.close();
}

(async () => {
  await getArticleTimes();
})();
