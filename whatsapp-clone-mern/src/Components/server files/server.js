// importing
import express from 'express';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import Messages from './dbMessages.js';

// app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: '1095790',
    key: '980755287b27b933bdfb',
    secret: '0a6e58b90a934a1ee2c9',
    cluster: 'ap2',
    encrypted: true
  });
  

// middleware
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});


// DB config
const connection_url = 'mongodb+srv://admin-whatsapp-mern:rJpN7XT3h79RqgWd@cluster0.saxzp.mongodb.net/whatsappDB?retryWrites=true&w=majority';
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("DB connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) =>{
        console.log("the change is",change);

        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received,
            });
        }else {
            console.log("Error triggering Pusher");
        }
    });
});

// ???

// api routes
app.get('/', (req, res) => res.status(200).send('hello world'));

app.get('/messages/sync', (req, res)=> {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    });
});

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

// listen
app.listen(port, ()=>console.log(`Listening on localhost port:${port}`));