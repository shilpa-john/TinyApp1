const express       = require("express");
const app           = express();
const PORT          = 8080; // default port 8080
const bodyParser    = require("body-parser");
var   cookieParser  = require('cookie-parser');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Function to generate a random string
const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Route for Login And entering the Username
app.post("/login", (req, res) => {
  username = req.body.username;
  res.cookie("username", username).redirect("/urls");

});

//For urls display
app.get("/urls", (req, res) => {
  const templateVars = { username: req.cookies["username"],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL =  urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, username: req.cookies["username"]};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL  =  urlDatabase[shortURL];
  console.log(longURL);
  res.redirect(longURL);
});

//Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

/*app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});*/

// Login-Authentication
/*app.get("/login", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies.username};
  res.render("urls_index", templateVars);
});*/

//Clear the Cookie on logout
app.post("/logout", (req, res) => {
  res.clearCookie("username").redirect("/urls")
});

//Connecting To The Server!
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
