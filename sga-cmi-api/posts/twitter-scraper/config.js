const SESSION_FILE = "posts/twitter_session.json";
const JSON_FILE = "posts/data/tweets.json";
const LOGIN_URL = "https://x.com/login";
const HOME_URL = "https://x.com/home";
const SEARCH_URL = {
  queries: ["pollo", "gasolina"],
  users: ["eldiario_net", "LaRazon_Bolivia", "grupoeldeber", "ExitoNoticias"],
  sinceDate: "2025-06-11",
  untilDate: "2025-06-14",
};

module.exports = {
  SESSION_FILE,
  JSON_FILE,
  LOGIN_URL,
  HOME_URL,
  SEARCH_URL,
};
