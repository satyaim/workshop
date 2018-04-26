//auth-routes.js
const router= require("express").Router();
const passport= require("passport");

router.get("/logout", function(req,res){
	//res.send("Will log you out ;)");
	req.logout();
	res.redirect("/");
});

router.get("/google/customer",passport.authenticate("google-cus",{
	scope: ['profile']
}));

router.get("/google/worker", passport.authenticate("google-worker",{
	scope: ['profile']
}));

router.get("/google/redirectcus",passport.authenticate("google-cus"), function(req,res){
	//res.send(req.user);
	res.redirect("/user/customer");
});

router.get("/google/redirectworker",passport.authenticate("google-worker"), function(req,res){
	//res.send(req.user);
	res.redirect("/worker");
});
/*
router.get("/google/lec",passport.authenticate("google-lec",{
	scope: ['profile']
}));

router.get("/google/redirectlec",passport.authenticate("google-lec"), function(req,res){
	//res.send(req.user);
	res.redirect("/user/lecturer");
});
*/

module.exports= router;
