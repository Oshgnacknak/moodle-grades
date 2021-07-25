const express = require('express');

const MoodleApi = require('./MoodleApi');

require('dotenv').config();

const api = new MoodleApi(process.env.URL, process.env.TOKEN);
const app = express();

const server = app.listen(process.env.PORT || 3000, () => {
    const { address, port } = server.address();
    console.log('Listening on http://' +  address+ ':' + port);
});

app.use(express.static('public'));
app.use(express.static('node_modules/axios/dist/'));
app.use(express.static('node_modules/chartjs/'));

app.get('/api/info', (_, res) => 
    api.getSiteInfo()
    .then(info => res.json(info)));

app.get('/api/user/:userid/courses', (req, res) => 
    api.getCouresOfUser(req.params.userid)
    .then(courses => res.json(courses)));

app.get('/api/user/:userid/grades/:courseid', (req, res) => 
    api.getGradesOfUser(req.params.userid, req.params.courseid)
    .then(grades => res.json(grades.tables[0])));
