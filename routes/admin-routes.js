//admin-routes.js
const router= require("express").Router();
const User= require("../models/user-model");
const passport = require('passport')
const Excel = require('exceljs');

router.get("/logout", function(req,res){
	//res.send("Will log you out ;)");
	req.logout();
	res.redirect("/admin");
});

router.get("/google/admin",passport.authenticate("google-adm",{
	scope: ['profile']
}));

router.get("/google/redirectadm",passport.authenticate("google-adm"), function(req,res){
	//res.send(req.user);
	res.redirect("/admin/dashboard");
});

router.get("/google/redirectwork",passport.authenticate("google-work"), function(req,res){
	//res.send(req.user);
	res.redirect("/worker");
});

const adminCheck= function(req,res,next){
	if(!req.user || req.user.type!='admin'){
		//not logged in
		res.redirect("/");
	}
	else{
		next();
		console.log(req.user)
	}
}


router.get("/addworker", adminCheck, passport.authenticate("google-work",{
	scope: ['profile']
}));

router.get("/dashboard", adminCheck, function(req, res){
	res.render("dashboard", {username: "admin"})
})

router.get("/attendance", adminCheck, function(req, res){
	User.find({},function(err,data){
			if(err)
				res.send("Error");
			else{
				res.render("attendance", {username: "admin", data: data});
			}
	});
})

router.get("/monthly", adminCheck, function(req, res){
	User.find({},function(err,data){
			if(err)
				res.send("Error");
			else{
				res.render("monthly", {username: "admin", data: data});
			}
	});
})

router.get("/addworkers", adminCheck, function(req, res){
	res.render("addworker", {username: "admin"})
})

router.get("/allusers", adminCheck, function(req,res){
	User.find({},function(err,data){
			if(err)
				res.send("Error All Users");
			else{
				res.render("allusers", {username: "admin", data: data});
			}
	});
});
router.get("/allusers/:userid", adminCheck, function(req,res){
	userid=req.params.userid;
	User.findOne({_id: userid},function(err,data){
			if(err)
				res.send("Error");
			else{
				res.render("userinfo", {username: "admin", data: data});
			}
	});
});
router.get("/allorders", adminCheck, function(req,res){
	User.find({},function(err,data){
			if(err)
				res.send("Error");
			else{
				res.render("allorders", {username: "admin", data: data});
			}
	});
});
router.get("/order/:userid/:orderid", adminCheck, function(req,res){
	userid=req.params.userid;
	orderid=req.params.orderid;
	var workers;
	User.find({type: "worker"}, function(err,data){
		workers= data;
	}).then(function(){
	User.findOne({_id: userid},function(err,data){
			if(err)
				res.send("No Such User");
			else{
				index=data.orderids.indexOf(orderid);
				if(index>-1)
					res.render("order", {username: "admin", order: data.orders[index], workers: workers});
				else
					res.send("No Such Order For Given User")
			}
	});
	});
});
router.get("/allworkers",  adminCheck, function(req,res){
	User.find({},function(err,data){
			if(err)
				res.send("Error");
			else{
				res.render("allworkers", {username: "admin", data: data});
			}
	});
});
router.get("/allworkers/:userid",  adminCheck, function(req,res){
	userid=req.params.userid;
	User.findOne({_id: userid, type: "worker"},function(err,data){
			if(err)
				res.send("Error");
			else{
				console.log("data")
				console.log(data)
				res.render("workerinfo", {username: "admin", data: data});
			}
	});
});
router.get("/allworkers/:userid/:weeks/download",  adminCheck, function(req,res){
	userid=req.params.userid;
	weeks=req.params.weeks;
	User.findOne({_id: userid, type: "worker"},function(err,data){
			if(err)
				res.send("Error");
			else{
				console.log("data")
				console.log(data)
				var workbook = new Excel.Workbook();
				var sheet = workbook.addWorksheet('Attendance');
				sheet.columns = [
		            { header: 'Date', key: 'date', width: 15 },
		            { header: 'In Time', key: 'intime', width: 30 },
		            { header: 'Out Time', key: 'outtime', width: 30 }
		        ];
		        today = new Date();
		        for (i=0; i<14; i++){
		        	sheet.addRow({date: today.toLocaleDateString('en-GB')})
		        	today.setDate(today.getDate()-1)	
		        }
		        today = new Date();
		        // 0 corresponds to today.getDay(), rest : -> -1, x -> today.getDay() - thatDay
		        var inlength = data.login.length;
		        inlength--;
		        while ( ((diff=Math.ceil(Math.abs((today.getTime()-new Date(data.login[inlength]).getTime()))/(1000 * 3600 * 24))) < 14) && (inlength > -1) && (today - new Date(data.login[inlength])) >= 0){
		        	sheet.getRow(diff+2).getCell('intime').value= new Date(data.login[inlength]).toLocaleTimeString('en-GB', { timeZone: 'Asia/Calcutta' });
		        	inlength--;
		        }
		        var outlength = data.logout.length;
		        outlength--;
		        while ( ((diff=Math.ceil(Math.abs((today.getTime()-new Date(data.logout[outlength]).getTime()))/(1000 * 3600 * 24))) < 14) && (outlength > -1) && (today - new Date(data.logout[outlength])) >= 0){
		        	sheet.getRow(diff+2).getCell('outtime').value= new Date(data.logout[outlength]).toLocaleTimeString('en-GB', { timeZone: 'Asia/Calcutta' });
		        	outlength--;
		        }
		     	
				//workbook.commit();
				var fileName = data.username+'.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
			    workbook.xlsx.write(res).then(function(){
			        res.end();
			    });
			}
	});
});
router.get("/addorder",  adminCheck, function(req,res){
	res.render("addorder", {username: "admin"});
});
router.get("/", function(req,res){
	res.render("admin");
})
module.exports= router;