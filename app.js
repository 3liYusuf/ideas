const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const { log } = require("console");
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));


mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://admin-ali:Test123@cluster0.i5q0kly.mongodb.net/ideas", {useNewUrlParser:true});

const ideaSchema = new mongoose.Schema({
    name:String,
    description:String,
    job:String,
    type:String,
    lang:String
});

ideaSchema.plugin(findOrCreate);

const Idea = mongoose.model("Idea", ideaSchema);

// const Website = mongoose.model("Website", ideaSchema);
// const Application = mongoose.model("Application", ideaSchema);
// const Logo = mongoose.model("Logo", ideaSchema);
// const SocialMedia = mongoose.model("SocialMedia", ideaSchema);
// const VisualIdentity = mongoose.model("VisualIdentity", ideaSchema);
// const Prints = mongoose.model("Prints", ideaSchema);
// const Ui = mongoose.model("Ui", ideaSchema);


app.get("/", function(req,res){
    res.render("home");
})

app.post("/idea", function(req,res){
    Idea.findOne({type:req.body.category_id},function(err,found){
        if(found){
            res.render("idea",{name:found.name,description:found.description,job:found.job,type:found.type,selected:req.body.category_id});
        }else{
            res.send("Not found");
        }
    })

})

app.get("/add",function(req,res){
    res.render("add");
})

app.get("/idea",function(req,res){
    res.redirect("/");
})


app.post("/add",function(req,res){
    Idea.create({
        name: req.body.name,
        description: req.body.description,
        job: req.body.job,
        type: req.body.category_id,
        lang:"EN"
    });
    res.redirect("/add");
})



app.listen(3000,function(){
    console.log("Server started on port 3000")
})