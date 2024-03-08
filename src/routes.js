import { Dataset, createPlaywrightRouter } from "crawlee";
import { KeyValueStore } from "crawlee";
import {
  dateClick,
  fetchDetails,
  formatDate,
  getDate,
  getInputAndFill,
  locateAndClick,
  scrollBottom,
  searchByDiv,
  waitForRender,
} from "./functions.js";
export const router = createPlaywrightRouter();
router.addDefaultHandler(async ({ page, log }) => {
  log.info(`enqueueing new URLs`);
  await page.waitForTimeout(3860);
  await page.screenshot({ path: "screenshotstart.png" });
  await page.mouse.click(100, 200);

  await waitForRender(
    page,
    "#top-banner > div.minContainer > div > div > div > div.fsw > div.fsw_inner.returnPersuasion > div.flt_fsw_inputBox.searchCity.inactiveWidget"
  );
  await locateAndClick(
    page,
    '//*[@id="top-banner"]/div[2]/div/div/div/div[2]/div[1]/div[1]'
  );

  const input = await KeyValueStore.getInput();
  console.log(input);
  //map input object
  await getInputAndFill(page, input);
  await page.waitForTimeout(1000);
  const searchText = await formatDate(input);
  const day = await getDate(input);
  await page.waitForTimeout(2000);

  while (
    !(await searchByDiv(
      page,
      searchText,
      '//*[@id="top-banner"]/div[2]/div/div/div/div[2]/div[1]/div[3]/div[1]/div/div/div/div[2]/div/div[2]/div[1]'
    )
  ) ){
    await page
      .locator(
        '//*[@id="top-banner"]/div[2]/div/div/div/div[2]/div[1]/div[3]/div[1]/div/div/div/div[2]/div/div[1]/span[2]'
      )
      .click();
  }
  await dateClick(page,day);

  await page.waitForTimeout(2000);
  await page.screenshot({ path: "ascreenshotstart.png" });


  // //click on search
  await locateAndClick(page,'//*[@id="top-banner"]/div[2]/div/div/div/div[2]/p/a' )
  await page.waitForTimeout(3000);
  await waitForRender(page, "#root > div > div:nth-child(2) > div.flightBody > div.overlay > div > div > div.makeFlex.hrtlCenter.right > button")

  await locateAndClick(page,'//*[@id="root"]/div/div[2]/div[2]/div[2]/div/div/div[3]/button')
  await page.waitForTimeout(1000);
  await scrollBottom(page);

  const details = await fetchDetails(page,input);
  console.log(details);
  console.log("cheapest: ", details[0]);

  await page.locator('//*[@id="listing-id"]/div/div[1]/div/div/div[2]').click();
  await page.waitForTimeout(1000);
  await scrollBottom(page);

  const fastest = await fetchDetails(page,input);
  console.log("fastest: ", fastest[0]);
  await Dataset.pushData(details);
  await Dataset.exportToCSV("flightDetails");
});
