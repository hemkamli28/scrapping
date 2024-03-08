import { KeyValueStore } from "crawlee";

export const locateAndClick = async (page, xpath) => {
  try {
    console.log("locating and clicking....");
    await page.locator(xpath).click();
    console.log("clicked!");
  } catch (error) {
    console.log("Failed to click.!");
    console.log(error);
  }
};

export const waitForRender = async (page, selector) => {
  try {
    console.log("waiting for selector....");
    await page.waitForSelector(selector);
    console.log("selector loaded!");
  } catch (error) {
    console.log("Failed to click.!");
    console.log(error);
  }
};

export const getInputAndFill = async (page, input) => {
  try {
    console.log("Entering From & To...");
    console.log(input);
    await page.getByPlaceholder("From").fill(input.source);
    await page.waitForTimeout(1000);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");

    await page.getByPlaceholder("To").fill(input.dest);
    await page.waitForTimeout(1000);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");

    console.log("Entered From & To!");
  } catch (error) {
    console.log(error);
    console.log("Failed to click.!");
  }
};

export const scrollBottom = async (page) => {
  try {
    console.log("scrolling down...");
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("End");
    }
  } catch (error) {
    console.log(error);
    console.log("Failed to scroll!");
  }
};

export const fetchDetails = async (page, input) => {
  try {
    const airlineNames = await page.$$eval(".airlineName", (els) => {
      return els.map((el) => el.textContent);
    });
    const ETA = await page.$$eval(".timeInfoRight .flightTimeInfo", (els) => {
      return els.map((el) => el.textContent);
    });

    const DT = await page.$$eval(".timeInfoLeft .flightTimeInfo", (els) => {
      return els.map((el) => el.textContent);
    });

    const price = await page.$$eval(".clusterViewPrice", (els) => {
      return els.map((el) => el.textContent);
    });
    const duration = await page.$$eval(".stop-info ", (els) => {
      return els.map((el) => el.textContent);
    });
    let details = [];
    let detail = {
      source: "",
      destination: "",
      airline: "",
      ETA: "",
      DT: "",
      price: "",
      duration: "",
    };

    for (let i = 0; i < DT.length; i++) {
      detail = {
        source: input.source,
        destination: input.dest,
        airline: airlineNames[i],
        ETA: ETA[i],
        DT: DT[i],
        price: price[i]?.slice(0, -9),
        duration: duration[i]?.slice(0, 9),
      };

      details.push(detail);
    }

    return details;
  } catch (error) {
    console.log("failed to fetch!");
  }
};

export const formatDate = async (input) => {
  try {
    const date = input.date;
    const monthNumber = date.slice(3, 5);
    const year = date.slice(6, 10);
    let monthName;
    switch (monthNumber) {
      case "01":
        monthName = "January ";
        break;
      case "02":
        monthName = "February ";
        break;
      case "03":
        monthName = "March ";
        break;
      case "04":
        monthName = "April ";
        break;
      case "05":
        monthName = "May ";
        break;
      case "06":
        monthName = "June ";
        break;
      case "07":
        monthName = "July ";
        break;
      case "08":
        monthName = "August ";
        break;
      case "09":
        monthName = "September ";
        break;
      case "10":
        monthName = "October ";
        break;
      case "11":
        monthName = "November ";
        break;
      case "12":
        monthName = "December ";
        break;
      default:
        monthName = "Invalid month number";
    }
    const obj = monthName.concat(year);
    console.log("fubobj:", obj);
    return obj;
  } catch (error) {
    console.log(error);
    console.log("Failed to format date!");
  }
};

export const searchByDiv = async (page,searchText, parentDivSelector) => {
  try {

    const divWithText = await page.$eval(
      parentDivSelector,
      (parentDiv, searchText) => {
        const divs = parentDiv.querySelectorAll("div");
        for (const div of divs) {
          if (div.textContent.includes(searchText)) {
            return div.outerHTML;
          }
        }
        return null;
      },
      searchText
    );
    // const divWithText = await page.$(parentDivSelector + ' div:has-text("' + searchText + '")');
  
    if(divWithText){
      return true;
    } 
    else{
      return false;
    }
  } catch (error) {
    console.log(error)
  }
};

export const getDate = async(input)=>{
  try {
    const day = input.date.slice(0,2);
    return day;
  } catch (error) {
    console.log(error)
  }
}
export const dateClick = async (page,day)=>{
  try {
    const divsWithText = await page.$$('.dateInnerCell');

    for (const divWithText of divsWithText) {
      const innerText = await divWithText.$eval('p:first-child', element => element.textContent);
      if (innerText === day) {
        await divWithText.click();
        console.log('Clicked on the div with text:', day);
        break; 
      }
    }
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}
