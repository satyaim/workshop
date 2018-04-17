//admin-routes.js
const router= require("express").Router();
const User= require("../models/user-model");
/*
// authCheck as middleware to check if logged in or not
const authCheck= function(req,res,next){
	if(!req.user){
		//not logged in
		res.redirect("/auth/login");
	}
	else
		next();
}
*/
router.get("/dashboard", function(req,res){
	res.render("dashboard", {username: "admin"});
});
router.get("/allusers", function(req,res){
	User.find({},function(err,data){
			if(err)
				res.send("Error All Users");
			else{
				res.render("allusers", {username: "admin", data: data});
			}
	});
});
router.get("/allusers/:userid", function(req,res){
	userid=req.params.userid;
	User.findOne({_id: userid},function(err,data){
			if(err)
				res.send("Error");
			else{
				res.render("userinfo", {username: "admin", data: data});
			}
	});
});
router.get("/allorders", function(req,res){
	User.find({},function(err,data){
			if(err)
				res.send("Error");
			else{
				res.render("allorders", {username: "admin", data: data});
			}
	});
});
router.get("/order/:userid/:orderid", function(req,res){
	userid=req.params.userid;
	orderid=req.params.orderid;
	User.findOne({_id: userid},function(err,data){
			if(err)
				res.send("No Such User");
			else{
				if(data.orderids.indexOf(orderid)>-1)
					res.render("order", {username: "admin", order: data.orders[data.orderids.indexOf(orderid)]});
				else
					res.send("No Such Order For Given User")
			}
	});
});
router.get("/allworkers", function(req,res){
	res.render("allworkers", {username: "admin"});
});
module.exports= router;