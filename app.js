var express=require("express");
var fd=require("formidable");
var cookie=require("cookie");
var ejs=require("ejs");
var session=require("express-session");
var mssql=require("mssql");
var router=require("./contorller");
app=express();
app.use(express.static('./public'));
//app.use(express.bodyParser);
app.use(session({
	
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
//app.use(express.static('./views'));
app.set("view engine","ejs");
app.get('/',router.index);
app.get('/index',router.index);
app.get('/signin',router.signin);
app.post('/signin',router.dosignin);
app.post('/select',router.selectEvery);
app.get('/insert',router.insertEvery);
app.get('/update',router.updateEvery);
app.get('/delete',router.deleteEvery);
app.get('/getData',router.getData);
app.listen(80,function(){
	console.log("正在监听80端口");
})
