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
	User.find({type: "worker"},function(err,data){
			if(err)
				res.send("Error");
			else{
				res.render("allworkers", {username: "admin", data: data});
			}
	});
});
router.get("/allworkers/all/:weeks/download",  adminCheck, function(req,res){
	weeks=req.params.weeks;
	User.find({type: "worker"},function(err,data){
			if(err || weeks>4)
				res.send("Error");
			else{
				console.log("data")
				console.log(data)
				var workbook = new Excel.Workbook();
				var sheetEE = workbook.addWorksheet('Entry Exit', {properties: {hidden: false}});
		        var columns = [];
		        today = new Date();
		        today.setHours(today.getHours() + 5); today.setMinutes(today.getMinutes() + 30);
		        columns[0] = { header: 'Name', key: 'name', width: 12}
		        columns[1] = { header: 'Id', key: 'id', width: 6}
		        for (i=0; i< 7*weeks; i++){
		        	columns[2*i+2] = { header: 'In '+today.toLocaleDateString('en-GB'), key: 'in'+i, width: 14 };
		        	columns[2*i+3] = { header: 'Out '+today.toLocaleDateString('en-GB'), key: 'out'+i, width: 14 };
		        	today.setDate(today.getDate()-1)
		        }
		        sheetEE.columns = columns;
		        today = new Date();
		        today.setHours(today.getHours() + 5); today.setMinutes(today.getMinutes() + 30);
		        console.log("today's date")
		        console.log(today.toLocaleDateString('en-GB', { timeZone: 'Asia/Calcutta' }))
		        todaytime = new Date(today.toLocaleDateString('en-GB', { timeZone: 'Asia/Calcutta' })).getTime();
		        for (i=0; i< data.length; i++){
		        	sheetEE.addRow({name: data[i].username, id: data[i].wid})
		        }
		        for (i=0; i< data.length; i++){
		        	var inlength = data[i].login.length;
			        inlength--;
			        while ( ((diff=Math.ceil(Math.abs((todaytime -new Date(new Date(data[i].login[inlength]).toLocaleDateString('en-US', { timeZone: 'Asia/Calcutta' })).getTime()))/(1000 * 3600 * 24))) < 7*weeks) && (inlength > -1) && (today - new Date(data[i].login[inlength])) >= 0){
			        	intime = new Date(data[i].login[inlength]).toLocaleTimeString('en-GB', { timeZone: 'Asia/Calcutta' });
			        	console.log("intime")
			        	console.log(intime)
			        	console.log(new Date(data[i].login[inlength]).toLocaleDateString('en-US', { timeZone: 'Asia/Calcutta' }))
			        	console.log(diff)
			        	sheetEE.getRow(i+2).getCell('in'+(diff)).value= intime;
			        	inlength--;
			        }
			        var outlength = data[i].logout.length;
			        outlength--;
			        while ( ((diff=Math.ceil(Math.abs((todaytime -new Date(new Date(data[i].logout[outlength]).toLocaleDateString('en-US', { timeZone: 'Asia/Calcutta' })).getTime()))/(1000 * 3600 * 24))) < 7*weeks) && (outlength > -1) && (today - new Date(data[i].logout[outlength])) >= 0){
			        	outtime = new Date(data[i].logout[outlength]).toLocaleTimeString('en-GB', { timeZone: 'Asia/Calcutta' });
			        	if(sheetEE.getRow(i+2).getCell('out'+(diff)).value== null)
			        		sheetEE.getRow(i+2).getCell('out'+(diff)).value= outtime;
			        	outlength--;
			        }
		        }
		        
				var fileName = 'AllAttendancex.xlsx';
				res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
			    res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
			    workbook.xlsx.write(res).then(function(){
			        res.end();
			    });
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
			if(err || weeks>4)
				res.send("Error");
			else{
				console.log("data")
				console.log(data)
				var workbook = new Excel.Workbook();
				var sheetAll = workbook.addWorksheet('All Times', {properties: {hidden: false}});
				var sheetDay = workbook.addWorksheet('Entry Exit', {properties: {hidden: false}});
				sheetAll.columns = [
		            { header: 'Date', key: 'date', width: 15 },
		            { header: 'In Time', key: 'intime', width: 60 },
		            { header: 'Out Time', key: 'outtime', width: 60 }
		        ];
		        sheetDay.columns = [
		            { header: 'Date', key: 'date', width: 15 },
		            { header: 'In Time', key: 'intime', width: 60 },
		            { header: 'Out Time', key: 'outtime', width: 60 }
		        ];
		        today = new Date();
		        today.setHours(today.getHours() + 5); today.setMinutes(today.getMinutes() + 30);
		        for (i=0; i< 7*weeks; i++){
		        	sheetAll.addRow({date: today.toLocaleDateString('en-GB')})
		        	sheetDay.addRow({date: today.toLocaleDateString('en-GB')})
		        	today.setDate(today.getDate()-1)	
		        }
		        // today collapsed
		        today = new Date();
		        today.setHours(today.getHours() + 5); today.setMinutes(today.getMinutes() + 30);
		        todaytime = new Date(today.toLocaleDateString('en-GB', { timeZone: 'Asia/Calcutta' })).getTime();
		        // 0 corresponds to today.getDay(), rest : -> -1, x -> today.getDay() - thatDay
		        var inlength = data.login.length;
		        inlength--;
		        //console.log(today.toLocaleTimeString('en-US'));

		        //console.log(Math.ceil(Math.abs((new Date(today.toLocaleDateString('en-US')).getTime()-new Date(new Date(data.login[inlength]).toLocaleDateString('en-US')).getTime()))/(1000 * 3600 * 24)))
		        while ( ((diff=Math.ceil(Math.abs((todaytime -new Date(new Date(data.login[inlength]).toLocaleDateString('en-GB', { timeZone: 'Asia/Calcutta' })).getTime()))/(1000 * 3600 * 24))) < 7*weeks) && (inlength > -1) && (today - new Date(data.login[inlength])) >= 0){
		        	intime = new Date(data.login[inlength]).toLocaleTimeString('en-GB', { timeZone: 'Asia/Calcutta' });
		        	if(sheetAll.getRow(diff+2).getCell('intime').value == null){
		        		sheetAll.getRow(diff+2).getCell('intime').value= intime;
		        		sheetDay.getRow(diff+2).getCell('intime').value= intime;
		        	}
		        	else{
		        		sheetAll.getRow(diff+2).getCell('intime').value+= (", " + intime);
		        		sheetDay.getRow(diff+2).getCell('intime').value= intime;
		        	}
		        	inlength--;
		        }
		        var outlength = data.logout.length;
		        outlength--;
		        while ( ((diff=Math.ceil(Math.abs(( todaytime -new Date(new Date(data.logout[outlength]).toLocaleDateString('en-GB', { timeZone: 'Asia/Calcutta' })).getTime()))/(1000 * 3600 * 24))) < 7*weeks) && (outlength > -1) && (today - new Date(data.logout[outlength])) >= 0){
		        	outtime = new Date(data.logout[outlength]).toLocaleTimeString('en-GB', { timeZone: 'Asia/Calcutta' });
		        	if(sheetAll.getRow(diff+2).getCell('outtime').value == null){
		        		sheetAll.getRow(diff+2).getCell('outtime').value= outtime;
		        		sheetDay.getRow(diff+2).getCell('outtime').value= outtime;
		        	}
		        	else{
		        		sheetAll.getRow(diff+2).getCell('outtime').value+=( ", " + outtime);
		        	}
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