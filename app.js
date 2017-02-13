/**
 * Created by davidtran on 2017-02-09.
 */

'use strict';

// Enable actions client library debugging
process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({type: 'application/json'}));

// Actions from intents on API.AI
const GENERATE_ANSWER_ACTION = 'generate_answer';
const CHECK_GUESS_ACTION = 'check_guess';

app.post('/', function (request, response) {
    const assistant = new Assistant({request: request, response: response});
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateAnswer(assistant) {
        console.log('generateAnswer');
        var answer = getRandomNumber(0, 100);
        assistant.data.answer = answer; //store the generated number
        assistant.ask('I\'m thinking of a number from 0 and 100. What\'s your first guess?');
    }

    function checkGuess(assistant) {
        console.log('checkGuess');
        let answer = assistant.data.answer; //the generated number from generateAnswer
        let guess = parseInt(assistant.getArgument('guess'));
        if (answer > guess) {
            assistant.ask('It\'s higher than ' + guess + '. What\'s your next guess?');
        } else if (answer < guess) {
            assistant.ask('It\'s lower than ' + guess + '. Next guess?');
        } else {
            assistant.tell('Congratulations, that\'s it! I was thinking of ' + answer);
        }
    }

    // Connect the actions to functions to build logic in answers
    let actionMap = new Map();
    actionMap.set(GENERATE_ANSWER_ACTION, generateAnswer);
    actionMap.set(CHECK_GUESS_ACTION, checkGuess);

    assistant.handleRequest(actionMap);

});



if (module === require.main) {
    // [START server]
    // Start the server
    let server = app.listen(process.env.PORT || 8080, function () {
        let port = server.address().port;
        console.log('App listening on port %s', port);
    });
    // [END server]
}
