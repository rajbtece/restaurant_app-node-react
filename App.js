const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;




mongoose.connect('mongodb://admin:adminas1@ds241530.mlab.com:41530/restaurant_db');
mongoose.connection
    .once('open', ()=>console.log('connected to DB'))
        .on('error', (e) => console.log('e'));

const port = process.env.PORT || 9000;




app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/client/build'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', publicRoutes);
app.use('/', adminRoutes);

if(process.env.NODE_ENV==='production'){
  app.get('/*', (req, res)=>{
    res.sendFile(__dirname+'/client/build/index.html')
  })
}

const server = app.listen(port, ()=>{
});

const io = require('socket.io')(server);

io.on('connection', (socket)=>{
  console.log('user connected');
  socket.on('test', (data)=>{
    console.log(data);
  })
});


app.set('socketio', io);