// load and require environment variables
require('dotenv').config();

// require dependencies
var pizza = require('dominos');
var express = require('express');
var bodyParser = require('body-parser');

// initalize express and body-parser
var server = express();
var port = process.env.PORT || 8080;
var router = express.Router();
server.use(bodyParser.urlencoded({ extended: true }));

// Verify request is coming from Slack
router.use(function(req, res, next) {
    if (req.body.token == process.env.TOKEN) {
        next();
    } else {
        res.sendStatus(403);
    }
});

// track pizza
router.route('/track').post(function(req, res) {        
    var phone = req.body.text; // get phone from request
    pizza.Track.byPhone(phone, function(pizza) {
        res.json({
            "text": JSON.stringify(pizza.orders)
        });
    });
});

// start listening
server.use('/api', router);
server.listen(port);
console.log('Listening on port ' + port);