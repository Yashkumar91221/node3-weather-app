const path = require("path");
const express = require("express");
const hbs = require("hbs");
const app = express();
const port = process.env.PORT || 3000;
const forecast = require("./source/utils/forecast");
const geocode = require("./source/utils/geocode");

//Define paths for express config
const publicDirPath = path.join(__dirname, "/public");
const viewsPath = path.join(__dirname, "./templates/views");
const partitalsPath = path.join(__dirname, "/templates/partials");

//Set up handle bars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partitalsPath);

//Set up static directory to serve
app.use(express.static(publicDirPath));

//app.com
//app.com/help
//app.com/about

const name = "Yash";
app.get("", (req, res) => {
  res.render("index", { title: "Weather App", name });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Page!", name });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help Page",
    message: "Please reach out to the contact number provided for any help.",
    name,
  });
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide search term.",
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Address must be provided.",
    });
  }
  geocode(req.query.address, (error, { latitude, longitude, place } = {}) => {
    if (error) {
      return res.send({
        error,
      });
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error,
        });
      }
      res.send({
        forecast: forecastData,
        location: place,
        place: req.query.address,
      });
    });
  });
});

app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "Help Page Error!",
    name,
    text: "Help article not found",
  });
});

app.get("*", (req, res) => {
  res.render("404", { title: "404 Page!", name, text: "Page Not Found!" });
});

app.listen(port, () => {
  console.log("Server running on port no: " + port);
});
