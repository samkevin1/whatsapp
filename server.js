const express = require('express');
const mongoose = require('mongoose')
const messageRouter = require('./routes/message');
const pusher = require('./services/pusher');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/messages', messageRouter);

const uri = process.env.MONGODB_URI;

const connectionUrl = 'mongodb+srv://admin:221bakerstreet@cluster0.lvtxl.mongodb.net/whatsappdb?retryWrites=true&w=majority';

mongoose.connect(connectionUrl, {
  useCreateIndex: true, 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', () => {
  console.log("Db connected")

  const msgCollection = db.collection('messages');
  const changeStream = msgCollection.watch();

  changeStream.on('change', (change) => {
    console.log('A change occured', change);

    if(change.operationType === 'insert'){
      const messageDetails = change.fullDocument;
      pusher.trigger('messages', 'inserted',
        {
          name: messageDetails.name,
          message:messageDetails.message,
          timestamp:messageDetails.timestamp,
          received:messageDetails.received
        }
      );
    }else{
      console.log('Error triggering pusher');
    }
  })
});

app.listen(port, () => console.log(`Listening on localhost:${port}`));

