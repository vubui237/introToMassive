
const express = require('express');
const {json} = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const config = require('./config')
const port = config.port || 3000;

const app = express();

app.use(cors());
app.use(json());

massive(config.massiveConnectionString).then(dbInstance => {
    app.set('db', dbInstance);
});

//columns MUST be lowercase
app.post('/api/people', (req,res,next) => {
    //This is the same as const name = req.body.name, const age = req.body.age etc
    const {name, age, location} = req.body
    req.app.get('db').postToPeople([name, age, location]).then(response => res.status(200).json(response)).catch(err => res.status(500).json(err));});

app.get('/api/people', (req,res,next)=> {
    //References /db/readAllPeople
    req.app.get('db').readAllPeople().then(people=> res.status(200).json(people)).catch(err => res.status(500).json(err))
})

app.put('/api/people/:id', (req,res,next) => {
    const {id} = req.params;
    const {location} = req.body;
    req.app.get('db').updateUserLocation([location, id]).then(people=> res.status(200).json(people)).catch(err => res.status(500).json(err))
})


app.listen(port, function() {
    console.log('Listening on port ' + port)
});