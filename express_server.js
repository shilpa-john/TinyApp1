const express         = require("express");
const app             = express();
const PORT            = 8080; // default port 8080
const bodyParser      = require("body-parser");
const cookieParser    = require('cookie-parser');
const { emailLookUp } = require('./helpers');


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Users in The Database
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//Function to generate a random string
const generateRandomString = () => {
  return Math.random().toString(36).substring(2,8);
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

//Register new user
app.get("/register", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("urls_reg", templateVars);
});

//New User Registration
app.post('/register', (req, res) => {
  if(!req.body.email && !req.body.password)  {
    res.status(400).send("Invalid details");
    return;
  } else if(emailLookUp(req.body.email, users)) {
    res.status(400).send("User exists!");
    return;
  } else {
    let newUser = generateRandomString();
    users[newUser] = {
      id: newUser,
      email: req.body.email,
      password: req.body.password
    };
    res.cookie('user_id', newUser);
    res.redirect('/urls');
  }
});

// Login-Authentication
app.get("/login", (req, res) => {
  let templateVars = { user:users[req.cookies.user_id] };
  res.render("login", templateVars);
});

//Route for Login
app.post("/login", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.cookie('user_id', templateVars);
  return res.redirect("/urls");
  });

//Clear the Cookie on logout
app.post("/logout", (req, res) => {
  res.clearCookie("user_id").redirect("/urls")
});

//For urls display
app.get("/urls", (req, res) => {
  let templateVars = { 
    user: users[req.cookies.user_id],
    urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL =  urlDatabase[shortURL];
  let templateVars = { shortURL, 
    longURL, 
    user: users[req.cookies.user_id]
  };
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


//Connecting To The Server!
app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`)});
