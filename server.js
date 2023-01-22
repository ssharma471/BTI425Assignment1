var express = require("express");
var app = express();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

var cors = require("cors"); 
const { json } = require("express");
app.use(cors());
app.use(express.json());

var dotenv = require('dotenv').config();

var HTTP_PORT = process.env.PORT || 8080;

// function onHttpStart() {
//   console.log("API Listening " + HTTP_PORT);
// }

app.get("/", function(req,res){
    var JSON = "API Listening on port " + HTTP_PORT;
    res.json({message:JSON});
});

app.post('/api/movies', (req,res)=>{
    let movie = req.body;
    db.addNewMovie(movie)
    .then((data)=>{ 
        res.status(201).send(data);
    }).catch((err)=>{
        res.status(500).send({error:err});
    });
});

app.get('/api/movies', async (req, res) => {
    
      let { page, perPage, title } = req.query;
      db.getAllMovies(page, perPage, title).then((movies) => {
        res.json(movies)
        //console.log(movies)
      }).catch ((err)=>{
        console.log(err);
        res.send({message:err.message});
      })
    });
    
    app.get('/api/movies/:id', (req,res)=>{
    let id = req.params.id;
    db.getMovieById(id)
    .then((data)=>{
    res.status(200).json(data);
    }).catch((err)=>{
    res.status(500).send({error:err});
    });
    });
    
    app.put('/api/movies/:id', (req,res)=>{
    let id = req.params.id;
    let movie = req.body;
    db.updateMovieById(movie,id)
    .then((data)=>{
    res.status(200).json(data);
    }).catch((err)=>{
    res.status(500).json({error:err});
    });
    });
    
    app.delete('/api/movies/:id', (req,res)=>{
    let id = req.params.id;
    db.deleteMovieById(id)
    .then(()=>{
    res.status(204).send();
    }).catch((err)=>{
    res.status(500).json({error:err});
    });
    });

db.initialize("mongodb+srv://Sidhant:senecaweb123@senecaweb.dt4u9j7.mongodb.net/sample_mflix?retryWrites=true&w=majority").then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
   }).catch((err)=>{
    console.log(err);
   });


//app.listen(HTTP_PORT, onHttpStart);