const express = require('express')
const session = require('express-session')
const fs = require('fs')
var bodyParser = require('body-parser')

var app = express()
var manager = express()
var customer = express()
var logDate = new Date() //current timestamp

var logWrite = fs.createWriteStream("application.log")
app.set('view engine' , 'ejs')

app.use(bodyParser.urlencoded({
    extended:true
    }
))
//session mounting Eg: 27-01-2022
logWrite.write(logDate.getDate() + "-" + (logDate.getMonth()+1) + "-" + logDate.getFullYear() + " : Mount the session for the sub servers (manager, customer)\n")
manager.use(session({
    secret: "manager",
    resave: true,
    saveUninitialized: true
}))

customer.use(session({
    secret: "customer",
    resave: true,
    saveUninitialized: true
}))

app.use(session({
    secret: "main",
    resave: true,
    saveUninitialized: true
}))
manager.get("/",function(req,res){
    res.render("/login")
})
manager.post("/managerlogin", function(req, res){
    var name  = req.body.name
    if( req.session.login )
    {
        
        res.send("Login available" + name)
    }
    else
    {
        res.send("Login not available")
    }
})
customer.get("/",function(req,res){
    res.render("loginc")
})

customer.post("/customerlogin", function(req, res){
    if( req.session.login )
    {
        var nameC  = req.body.nameC
        res.send("Login available" + nameC)
    }
    else
    {
        res.send("Login not available")
    }
})

manager.get("/login", function(req, res){
 req.session.login = "Aditi"
    res.send("Manager session")
  // res.render("login")
})

//mounting the sub serves
logWrite.write(logDate.getDate() + "-" + logDate.getMonth()+1 + "-" + logDate.getFullYear() + " : Mount the sub servers (manager, customer)\n")
app.use("/manager", manager)
app.use('/customer', customer)

app.listen(3005,function(err,result){
    if(err){
        console.log("Error");
        return
    }
    console.log("Server started 3005" );
})