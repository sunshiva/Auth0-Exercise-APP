const express = require('express');
const passport = require('passport');
const connection  = require('express-myconnection'); 
const mysql = require('mysql');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
const router = express.Router();
const request = require('request');
const ensureTokenValid = require('../utils/ensureTokenValid');
const authorize = require('../utils/authorize');

/*function delay() {
  console.log("Waiting for API");
}*/

//	Create connection to MySQL database server.

router.use(
	    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : '0MusunD0',
        port : 3306,
        database:'test'

    },'pool')

);

/*function handleDelivery (res, url, accessToken) {
    const options = {
      url: url,
      json: true,
      headers: {
        'authorization': `bearer ${accessToken}`
      }
    };
    const json = '';
    request(options, function (error, response, body) {
      if (error) {
          console.error(error);
          return res.json({ error: true, description: 'Check server logs & whether API Ports already in use' });
      }
      response.on('data', function(chunk) {
          json = JSON.parse(chunk);
          //stockPrice = json.LastPrice;
      }).end();
      return json;
    })
};*/

const handleDelivery = (res, options, template ) => {

    request(options, function (error, response, body) {
      if (error) {
        console.error(error);
        return res.json({ error: true, description: 'Check server logs & whether API Ports already in use' });
      }
      //console.log("options:", options);
      console.log("body: ", body);
      console.log("template: ", template)

      if ( typeof template !== 'undefined' && template ) {
        console.log("here");
        res.render(template,{ page_title: "View Customer Data", data: body} );
      }
  
      //return res.json(body);
      //finalData = getResponseJson(statusCode, body.toString());
      //finalData = body.toString();
      //return callback(finalData);
      //console.log(body);
      //return body;
    });
  };

/* GET user profile. */
/*router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('customers', {
    user: req.user,
    page_title: "Customer Data",
    data:[]
  });
});*/

/*router.get('/contacts', ensureLoggedIn('/auth'), ensureTokenValid, function (req, res, next) {
    const url = `http://localhost:${process.env.CONTACTS_API_PORT}/api/contacts`;
    handleDelivery(res, url, req.session.access_token);
  });*/

router.get('/', ensureLoggedIn('/auth'), function(req, res, next) {

    const options = {
      url: 'http://localhost:4300/customers/read',
      json: true,
      method: 'GET',
      headers: {
        'authorization': `bearer ${req.session.access_token}`
      }
    };

    console.log("Options: ", options);
    //var apireturn = handleDelivery(res, url, req.session.access_token);
    handleDelivery(res, options, 'customers');
    //setTimeout(delay, 3000); // Add delay
    //console.log("After handleDelivery(): ", JSON.stringify(req.headers));
    //console.log(apireturn);
  });
    /*const request = require('request')
         ,url = 'http://api.sunshiva.com:3030/customers/read'
         ,headers = { 'Authorization': `Bearer ${accessToken}`}
    
    request(url, (error, response, body)=> {
      if (!error && response.statusCode === 200) {
        const userData = JSON.parse(body)
        console.log("Got a response: ", userData);
        res.render('user', {
                user: req.user,
                page_title: "User details",
                data: userData
        });
      } else {
        console.log("1Got an error: ", error, ", status code: ", response.statusCode);
    
      }
    })*/

    
    
    router.get('/add', ensureLoggedIn('/auth'), function(req, res, next) {
      res.render('add_customer',{ page_title: "Create customer record"} );
    });
    
    /*Save the customer*/
    router.post('/add', ensureLoggedIn('/auth'), function(req, res, next) {
        
      //var input = JSON.parse(JSON.stringify(req.body));
      var input = JSON.parse(JSON.stringify(req.body));
      //var params  = req.body;
      console.log("Add customer form data received: ", input);

      const coptions = {
        url: 'http://localhost:4300/customers/create',
        form: input,
        method: 'POST',
        headers: {
          'authorization': `bearer ${req.session.access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      console.log("Options: ", coptions);

      //var apireturn = handleDelivery(res, url, req.session.access_token);
      handleDelivery(res, coptions);

      const roptions = {
        url: 'http://localhost:4300/customers/read',
        json: true,
        method: 'GET',
        headers: {
          'authorization': `bearer ${req.session.access_token}`
        }
      };

      console.log("Options: ", roptions);
      handleDelivery(res, roptions, 'customers');
      //setTimeout(delay, 3000); // Add delay
      //console.log("After handleDelivery(): ", JSON.stringify(req.headers));
      //console.log(apireturn);
    });
    
    router.get('/delete/:id', ensureLoggedIn('/auth'), function(req, res, next) {
    var id = req.params.id;
    console.log("id: ", id);
    const doptions = {
      url: `http://localhost:4300/customers/delete/${id}`,
      json: true,
      method: 'GET',
      headers: {
        'authorization': `bearer ${req.session.access_token}`
      }
    };
    console.log("Delete request options: ", doptions);
    handleDelivery(res, doptions);      

    const roptions = {
      url: 'http://localhost:4300/customers/read',
      json: true,
      method: 'GET',
      headers: {
        'authorization': `bearer ${req.session.access_token}`
      }
    };
    console.log("Read request options: ", roptions);
    handleDelivery(res, roptions, 'customers');

  });

module.exports = router;

