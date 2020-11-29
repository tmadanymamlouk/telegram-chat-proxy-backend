const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors')
const port = process.env.PORT || 8081;

require('dotenv').config();
const JokeService = require('./joke-service')

/* --- telegram bot --- */
const Slimbot = require('slimbot');
const slimbot = new Slimbot(process.env.TELEGRAM_BOT_SECRET);

// reply to messages from telegram
slimbot.on('message', message => {
    slimbot.sendMessage(message.chat.id, 'Ich bin kein echter Chatbot also erzähle ich Dir einen Witz: ' + JokeService.getRandomJoke());
});

slimbot.startPolling();
/* --------------- */


const app = express();
app.use(cors())
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World');
});

// reply to messages from webb
app.post('/chat', function (req, res) {
    console.log(JSON.stringify(req.body.message))

    // send message to telegram
    slimbot.sendMessage(process.env.TELEGRAM_CHAT_ID, req.body.message)
        .then(message => {
            // reply to web
            res.send({message: 'Ich bin kein echter Chatbot also erzähle ich Dir einen Witz: ' + JokeService.getRandomJoke()});
        });
});

const server = app.listen(port, function () {
    console.log(`Telegram chat app listening at http://${server.address().address}:${server.address().port}`)
});