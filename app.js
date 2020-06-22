var express=require("express"); 
var bodyParser=require("body-parser"); 

const mongoose = require('mongoose'); 

mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true);  
mongoose.connect('mongodb://localhost:27017/trytry'); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
	console.log("connection succeeded"); 
}) 

var app=express() 
app.use(bodyParser.json()); 
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ 
	extended: true
}));
app.set('view engine','ejs');
//for signup
app.get('/sign_up',function(req,res){
    res.redirect("signup.html")

})
app.post('/sign_up', function(req,res){ 
	var name = req.body.name; 
	var email =req.body.email; 
	var pass = req.body.password; 
	var phone =req.body.phone; 
	var follower = ""
	var following =""
	var data = { 
		"name": name, 
		"email":email, 
		"password":pass, 
		"phone":phone ,
		"follower":follower,
		"following":following
	} 
db.collection('details').insertOne(data,function(err, collection){ 
		if (err) throw err; 
		console.log("Record inserted Successfully"); 
			
	}); 
		
	return res.redirect('login.html'); 
}) 
//for log in
app.get('/log_in',function(req,res){
    res.redirect("login.html")

})
var names ={value :0}
app.post('/log_in',function(req,res){
	names.value = req.body.name;
	var name = names.value
    var password = req.body.password; 
    db.collection('details').findOne({"name":name,"password":password},{projection:{"name":1,"password":1}},function(err,collection){
        if (err) throw err;
        console.log("logged in Successfully"); 
        return res.redirect('signup_success.html');
    });

})
app.post('/logout',function(req,res){
	
	console.log('logged out successfully')
	res.redirect("/"); 

})
var article1 = []
var header1 =[]
var senderinfo1=[]
app.post('/send',function(req,res){
	var headero = req.body.header;
	var content1 = req.body.content;
	var senderinfo = req.body.username;
	article1.push(content1)
	header1.push(headero)
	senderinfo1.push(senderinfo)

	console.log(article1)
	var newdata = {$set: {"articledata1":article1,"header1":header1,"infog":senderinfo1}}
     
	db.collection('details').updateMany({},newdata,function(err,data){
		if(err) throw err ;
		console.log('article added')
		return res.redirect('signup_success.html');
	})
	
	
	
	
})

app.post('/check2',function(req,res){
	res.render('search')
	
})
app.get('/check2',function(req,res){
	res.redirect("/search");
})
var findname = {value:""}
app.post('/search',function(req,res){
	findname.value=req.body.findname
	
	db.collection('details').find({"name":findname.value}).toArray(function(err,result){
		
		var data = {name:result[0].name,email:result[0].email,phone:result[0].phone}
		if (err) throw err ;
		
		res.render('profile2',{data:data}) 
	})
})
app.post('/check',function(req,res){
	var myname = names.value;
	
	
	db.collection('details').find({"name":myname}).toArray(function(err,result){
		
		var data = {name:result[0].name,email:result[0].email,phone:result[0].phone,following:(result[0].following).length,follower:(result[0].follower).length}
		
		if (err) throw err ;
		res.render("profile",{data:data})
	
	})

})
var follower1 = []
var following1 = []
app.post('/follow',function(req,res){
	var myname1 = names.value
	follower1.push(myname1)
	following1.push(findname.value)
	var query = {"name":myname1}
	var query1 = {"name":findname.value}
	var added = {$set:{ following : following1}}
	var added1 = {$set:{ follower : follower1}}
	db.collection('details').updateOne(query,added,function(err,data){
		if (err) throw err ;
		console.log('u started following one user')
		db.collection('details').updateOne(query1,added1,function(err,data){
			if (err) throw err;

		})
		return res.redirect('signup_success.html');

	})
})


app.post('/check3',function(req,res){
	var myname = names.value 
	db.collection('details').find({"name":myname}).toArray(function(err,result){
		console.log(result)
		var x = result[0].articledata1.length
		console.log(x)
		var collect = []
		var collect2=[]
		var collect3=[]
		var data = {value:collect,value2:collect2,value3:collect3,num:x}
		for (i=0;i<x;i++){
			collect.push(result[0].articledata1[i])
			collect2.push(result[0].header1[i])
			collect3.push(result[0].infog[i])
			
		}
		

		//var data = {value:result[0].articledata}
		res.render('accinvi',{data:data})
		
	})
    
	

})

app.get('/',function(req,res){ 
    
res.set({ 
	'Access-control-Allow-Origin': '*'
	}); 
return res.redirect("index.html"); 
})
app.listen(4000) 


console.log("server listening at port 4000"); 
