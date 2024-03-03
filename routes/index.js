var express = require('express')
var cors = require('cors');
var router = express.Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

router.get('/profile', requiresAuth(), function (req, res, next) {
  res.render('profile', {
    userProfile: JSON.stringify(req.oidc.user, null, 2),
    title: 'Profile page'
  });
});

const domain = "gorilla-guru.kintone.com";
const appId = 1;
const requestEndpoint = "https://{{domain}}/k/v1/records.json?app={{appId}}";

const corsOptions = {
  origin: "http://localhost:3000"
};

router.get('/getData', cors({"X-Requested-With": "XMLHttpRequest"}), async (req, res) => {
  const fetchOptions = {
      method: 'GET',
      headers:{
          'X-Cybozu-API-Token':'f4HyRWDTDzo1LdRMiNQ3AIdQ5UTv7BIAIxbvvY3J'
      }
  }
  const response = await fetch(requestEndpoint, fetchOptions);
  const jsonResponse = await response.json();
  res.json(jsonResponse);
});
module.exports = router;
