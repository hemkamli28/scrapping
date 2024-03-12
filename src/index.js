import express from "express";
import { runCrawler } from "./main.js";
import { readFile, writeFileAsync } from "./functions.js";
const app = express();
const port = 3000;
app.use(express.json());
app.get("/", async (req, res) => {
  try {
    await runCrawler(); // Start the crawler when the root path is accessed
    res.send("Hello World!");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

app.post("/search", async (req, res) => {
  try {
    const { source, dest, date } = req.body;
    const obj = {
      source,
      dest,
      date,
    };

    const jsonString = JSON.stringify(obj);
    console.log(jsonString);
    writeFileAsync("./INPUT.json", jsonString);

    await runCrawler(obj); // Start the crawler when the root path is accessed

    const fd = await readFile("./allDetails.json");
    const parsedData = JSON.parse(fd);
    return res.status(200).json(parsedData);
    // return res.status(200).json(parsedData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error!" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
