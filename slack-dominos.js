// require dependencies
var pizza = require('dominos');
var express = require('express');
var bodyParser = require('body-parser');

// initalize express and body-parser
var server = express();
var port = process.env.PORT || 8080;
var router = express.Router();
var tokens = process.env.TOKENS.split(',');
server.use(bodyParser.urlencoded({ extended: true }));

// Verify request is coming from Slack
router.use(function(req, res, next) {
    if (tokens.includes(req.body.token)) {
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