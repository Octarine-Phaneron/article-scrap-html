const express = require('express');
const fetch = require('fetch');
const rp = require('request-promise');
const $ = require('cheerio');

// Journaux
const regexParisien = /leparisien/;
const regexMonde = /lemonde/;
//https://www.lemonde.fr/politique/article/2020/01/16/les-parlementaires-socialistes-presentent-leur-contre-reforme-des-retraites_6026083_823448.html

require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Starting server at ${port}`);
});
app.use(express.static('public'));
app.use(express.json({
  limit: '1mb'
}));

app.get('/test', (request, response) => {

  const url = request.query.url;
  rp(url)
    .then(function (html) {
      //success!
      if (regexParisien.test(url)) {
        response.send(String($('.article_header', html)) + String($('.byline', html)) + String($('.article-section p', html))); // HTML pointé sous forme de String.
      } else if (regexMonde.test(url)) {
        response.send(String($('.article__heading', html)) + String($('.meta__publisher', html)) + String($('article', html)));
      } else {
        console.log("else");
        response.send("Pas d'article trouvé");
      }
    })
    .catch(function (err) {
      console.error("Erreur : " + err);
      response.end();
      return;
    });
});