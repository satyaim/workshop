//profile-routes.js
const router= require("express").Router();
// authCheck as middleware to check if logged in or not
const authCheck= function(req,res,next){
	if(!req.user || req.user.type!="customer"){
		//not logged in
		res.redirect("/");
	}
	else
		next();
}
router.get("/logout", function(req,res){
	//res.send("Will log you out ;)");
	req.logout();
	res.redirect("/");
});
router.get("/customer", authCheck, function(req,res){
	//res.send("You are logged in as: "+ req.user.username);
	res.render("customer",{username: req.user.username});
});
router.get("/neworder", authCheck, function(req,res){
	res.render("neworder",{user: req.user, username: req.user.username});
});
router.get("/myorders", authCheck, function(req,res){
	res.render("myorders",{orders: req.user.orders, username: req.user.username});
});
router.get("/myorders/:orderid", authCheck, function(req,res){
	orderid=req.params.orderid;
	index=req.user.orderids.indexOf(orderid);
	if(index>-1)
		res.render("orderinfo",{username: req.user.username, orderid: orderid, order: req.user.orders[index]});
	else
		res.send("invalid request")
});
/*
router.get("/lecturer", function(req,res){
	//res.send("You are logged in as: "+ req.user.username);
	res.render("user",{user: req.user});
	console.log(req.user);
});
*/

module.exports= router;