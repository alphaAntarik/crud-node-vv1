const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes/routes');

const app = express();

const session = require('express-session');

const MongoDBStore = require('connect-mongodb-session')(session);
const port = process.env.PORT || 3000;


app.use(express.json()); 

// Session store
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/userAuth',
    collection: 'sessions'
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "this should be a long text in production", resave: false, saveUninitialized: false, 
    store:store
}))
app.use('/user', router);

mongoose.connect('mongodb://localhost:27017/userAuth')
    .then(() => {
        console.log('db connected');
    })
    .catch((err) => {
        console.log('error is ' + err);
    });

app.listen(port, () => {
    console.log('Server is listening to ' + port);
});
