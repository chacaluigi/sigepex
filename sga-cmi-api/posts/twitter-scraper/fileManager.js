const fs = require("fs").promises;
const { JSON_FILE } = require("./config.js");

async function loadExistingTweets() {
  try {
    const data = await fs.readFile(JSON_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveTweets(tweets) {
  const existingTweets = await loadExistingTweets();

  // Filtrar tweets duplicados usando el ID
  const newTweets = tweets.filter(
    (tweet) => !existingTweets.some((existing) => existing.id === tweet.id)
  );

  if (newTweets.length > 0) {
    const updatedTweets = [...existingTweets, ...newTweets];
    await fs.writeFile(JSON_FILE, JSON.stringify(updatedTweets, null, 2));
    console.log(`✅ Se añadieron ${newTweets.length} nuevos tweets.`);
  } else {
    console.log("🔍 No se encontraron nuevos tweets.");
  }
}

module.exports = {
  loadExistingTweets,
  saveTweets,
};
