const express=require('express')();
const questions=require('./questions.json');
const bodyparser=require('body-parser');


express.set("view engine", "ejs");
express.use(bodyparser.urlencoded({ extended: true }));
let scores=[]
let player


//Middlewares

//Middleware to check if player has entered his name
isName=(req,res,next)=>{
    if(player){
        next();
    }else{
        res.redirect("/");
    }    
}


//Home
express.get("/",(req,res)=>{
    res.render("index")
})

//Get Name of the Player
express.post("/",(req,res)=>{
    player=req.body.name;
    res.redirect("/courses");
})

//List Courses
express.get("/courses",isName,(req,res)=>{
    courses=[]
    Object.keys(questions).forEach(question=>{
        courses.push(question);
    })
    res.render("courses",{player:player,courses:courses});
})

//Get course by name
express.get("/course/:name",isName,(req,res)=>{
    const courseName=req.params.name;
    const quiz=questions[courseName];
    res.render("quiz",{quiz:quiz,courseName:courseName});
})

//Submit quiz responses
express.post("/course/:name",(req,res)=>{
    const responses=req.body;
    const courseName=req.params.name;
    const courseQuestions=questions[courseName];
    let score=0;
    Object.keys(responses).forEach((response)=>{
        const questionIndex=parseInt(response.substring(1));
        if(responses[response]==courseQuestions[questionIndex].answer)
            score=score+1;
    })
    //score Model
    const scoreRecord={
        name:player,
        score:score,
        course:courseName,
        time:Date()
    };
    
    if(! (player in scores)){
        scores[player]=[];
    }    
    scores[player].push(scoreRecord);
    res.redirect("/score/"+player);
})

//Get scoreboard
express.get("/score/:name",isName,(req,res)=>{
    const playerName=player;
    if(playerName in scores)
        res.render("score",{score:scores[playerName]});
    else
        res.send("Nothing Here :(");
})



express.listen(3000,()=>{
    console.log('Server started at http://localhost:3000');
})