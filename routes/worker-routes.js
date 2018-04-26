//worker-routes.js
const router= require("express").Router();
const User= require("../models/user-model");
const passport= require("passport");

const workerCheck= function(req,res,next){
	if(!req.user || req.user.type!="worker"){
		//not logged in
		res.redirect("/");
	}
	else
		next();
}

router.get("/logout", workerCheck, function(req,res){
	//res.send("Will log you out ;)");
	console.log("profile");
	console.log("req");
	console.log(req);
	var date= new Date();
	User.updateOne({_id: req.user._id},{$push : {logout: date}}, function(err,res){
	    if (err)  console.log(err);
	    else console.log("logged out")
	});
	req.logout();
	res.redirect("/");
});

router.get("/",workerCheck,function(req,res){
	res.render("worker", {username: req.user.username});
});

module.exports= router;