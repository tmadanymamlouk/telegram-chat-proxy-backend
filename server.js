const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const fetch = require('node-fetch');
const port = process.env.PORT || 8081;
require('dotenv').config();

const app = express();
app.use(cors())
app.use(bodyParser.json());

const answers = {}

/**
 * The server needs only one endpoint for chatting.
 *
 * @param message   user input ("start" is the initial message when the page is loaded)
 * @param userId    uuid stored in browser cookie.
 */
app.post('/chat', function (req, res) {
    console.log(JSON.stringify(req.body.message))
    console.log(JSON.stringify(req.body.userId))
    const message = req.body.message;
    const userId = req.body.userId;

    if (!answers[userId]) {
        answers[userId] = []
    }
    if(message !== "start")
        answers[userId].push(message)

    /*
     this is just a mock for the chat-bot logic
     */
    const questions = [
        {
            question: "Hallo! Wie ist Dein Name?",
            buttons: []
        },
        {
            question: "Das ist ein schöner Name. Darf ich Dir ein paar Fragen stellen?",
            buttons: ['ja', 'nein', 'vielleicht']
        },
        {
            question: "Egal, lass und reden!",
            buttons: []
        },
    ]

    if (answers[userId].length >= questions.length) {
        res.send({
            message: "Ich habe keine weiteren Fragen",
            buttons: []
        })
    } else {
        res.send({
            message: questions[answers[userId].length].question,
            buttons: questions[answers[userId].length].buttons
        })
    }
});

const server = app.listen(port, function () {
    console.log(`Chat app backend listening at http://${server.address().address}:${server.address().port}`)
});
