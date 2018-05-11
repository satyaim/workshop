//app.js
//Express Module
const express= require("express");
//Obtain router of auth-routes.js as authRoutes
const authRoutes= require("./routes/auth-routes");
//Obtain routes of profile-routes as profileRoutes
const profileRoutes= require("./routes/profile-routes");
//Obtain routes of admin-routes as adminRoutes
const adminRoutes= require("./routes/admin-routes");
//Obtain routes of worker-routes as workerRoutes
const workerRoutes= require("./routes/worker-routes");
//Obtain passport-setup.js
const passportSetup= require("./config/passport-setup");
//Obtain socket.io
const socket= require("socket.io");
//Port
const port = process.env.PORT || 3000;
//Express App
const app= express();
//Obtain mongoose
const mongoose= require("mongoose");
//Obtain keys
const keys= require("./config/keys");
//Obtain cookie-session
const cookieSession= require("cookie-session");
//Obtain passport
const passport= require("passport");
//Define session
const session= cookieSession({
	maxAge: 24*60*60*1000,
	keys: [keys.session.cookieKey]
});
//Encrypt with key to browser
app.use(session); 
//Initialise passport
app.use(passport.initialize());
app.use(passport.session());
//Connect to mongoDB
console.log("Connecting to db");
mongoose.connect(keys.mongoose.URI,function(err){
	console.log("Connecting to db");
	if(!err)
		console.log("Connected to db");
	if(err)
		console.log(err);
});
const User= require("./models/user-model");
//const Lecture= require("./models/user-model");
//Set static files location
app.use(express.static("./assets"));
//Set static files location
app.use("/user",express.static("./assets"));
//Set view Engine to EJS
app.set("view engine","ejs");
//All requests made to auth will be controlled by authRoutes
app.use("/auth",authRoutes);
//All requests made to user to be controlled by profile-routes
app.use("/user",profileRoutes);
//All requests made to admin will be controlled by authRoutes
app.use("/admin",adminRoutes);
//All requests made to worker will be controlled by workerRoutes
app.use("/worker",workerRoutes);
//Set index.ejs for request at /
app.get("/",function(req,res){
	console.log("req.user\n")
	console.log(req.user);
	res.render("index",{ user: req.user });
});
app.get("/login",function(req,res){
	res.render("login");
});
//Listen to port
const server= app.listen(port, function(){
	console.log("listening to port 3000");
});

var io= socket(server);
io.on('connection', function(socket) {
  	var cookieString = socket.request.headers.cookie;
    var req = {connection: {encrypted: false}, headers: {cookie: cookieString}};
    var res = {getHeader: () =>{}, setHeader: () => {}};
    var id;
	socket.on('placeorder', function(data) {
		var iname= data.iname;
    	var iqty= data.iqty;
    	var iabout= data.iabout;
    	var cusname= data.cusname;
    	var cusphone= data.cusphone;
    	var orderid= data.orderid;
    	var imageurl= data.imageurl;
    	console.log('j');
    	session(req, res, () => {
	        console.log(req.session);
	        id= req.session.passport.user;
    	});
    	console.log('j');
    	socket.join(id);
		User.updateOne({_id: id},{$push : {ordernames: iname, orderids: orderid, orders: {orderuserphone: cusphone, orderstatus: "placed", orderabout: iabout, orderqty: iqty, orderid: orderid, ordername: iname, orderuserid: id, imageurl: imageurl}}}, function(err,res){
		    if (err)  console.log(err);
		    else{
		    	console.log(res);
		    	io.sockets.in(id).emit('orderplaced', {
		    		ordername: iname,
		    		orderqty: iqty,
		    		orderid: orderid
		    	});
		    }
		});
	});
	socket.on('acceptorder', function(data){
		orderid= data.orderid;
		userid= data.userid;
		User.findOne({_id: userid, orderids: orderid},function(err,result){
			if(err)
				socket.emit('acceptedorder', {
					yn: 'no'
				});
			else{
				console.log(result);
				index= result.orderids.indexOf(orderid);
				console.log(index);
				var setModifier = { $set: {} };
			    setModifier.$set['orders.' + index + '.orderstatus'] = 'accepted';
			    setModifier.$set['orders.' + index + '.ordershopsnum'] = -1;
				User.updateOne({_id: userid, "orders.orderid": orderid}, setModifier, function(err,result){
				    if(err) 
				    	socket.emit('acceptedorder', {
				    		yn: 'no'
				    	});
				    else
				    	socket.emit('acceptedorder', {
				    		yn: 'yes'
				    	});
				});
			}
		});
	});
	socket.on('rejectorder', function(data){
		orderid= data.orderid;
		userid= data.userid;
		User.findOne({_id: userid, orderids: orderid},function(err,result){
			if(err)
				socket.emit('rejectedorder', {
					yn: 'no'
				});
			else{
				console.log(result);
				index= result.orderids.indexOf(orderid);
				infoindex= 0;
				console.log(index);
				var setModifier = { $set: {} };
			    setModifier.$set['orders.' + index + '.orderstatus'] = 'rejected';
				User.updateOne({_id: userid, "orders.orderid": orderid}, setModifier, function(err,result){
				    if(err) 
				    	socket.emit('rejectedorder', {
				    		yn: 'no'
				    	});
				    else
				    	socket.emit('rejectedorder', {
				    		yn: 'yes'
				    	});
				});
			}
		});
	});
	socket.on('confirm',function(data){
		userid= data.userid;
		orderid= data.orderid;
		cost= parseInt(data.icost)
		User.findOne({_id: userid, orderids: orderid},function(err,result){
			if(err)
				socket.emit('confirmed', {
					yn: 'no'
				});
			else{
				console.log(result);
				index= result.orderids.indexOf(orderid);
				console.log(index);
				var setModifier = { $set: {} };
			    setModifier.$set['orders.' + index + '.ordercost'] = cost;
				setModifier.$set['orders.' + index + '.orderstatus'] = 'running';
				//pushModifier.$push['orders.'+ index + '.orderinfo' + infoindex + '.shop'] = 'dumb';
			    for(infoindex=0; infoindex<data.shops.length-1; infoindex++){
			    	iter=infoindex;
			    	console.log(data);
			    	User.updateOne({_id: userid, "orders.orderid": orderid},{$push : {"orders.$.orderinfo" : { shop: data.shops[iter], index: iter/2, workerid: data.shops[iter+1][0], worker: data.shops[iter+1][7], fromdate: data.shops[iter+1][1], fromtime: data.shops[iter+1][2], todate: data.shops[iter+1][3], totime: data.shops[iter+1][4], description: data.shops[iter+1][5], inputs: data.shops[iter+1][6]  }}}, function(err,res){
			    		if(err){
			    			console.log("err");
			    			socket.emit('confirmed', {
				    			yn: 'no'
				    		});
			    			return;
			    		}
				    	else {
				    		console.log("ok");
				    	}
			    	});
			    	User.updateOne({_id: data.shops[iter+1][0], type: "worker"}, {$push: { work_shop: data.shops[iter], work_fromtime: data.shops[iter+1][2], work_fromdate: data.shops[iter+1][1], work_totime: data.shops[iter+1][4], work_todate: data.shops[iter+1][3],work_describe: data.shops[iter+1][5], work_inputs: data.shops[iter+1][6]}}, function(err,res){
			    		if(err){
			    			console.log("err")
			    		}
			    		else{
			    			console.log("ok")
			    		}
			    	});
			    	infoindex++;
			    }
				User.updateOne({_id: userid, "orders.orderid": orderid}, setModifier, function(err,result){
				    if(err) 
				    	socket.emit('confirmed', {
				    		yn: 'no'
				    	});
				    else
				    	socket.emit('confirmed', {
				    		yn: 'yes'
				    	});
				});
			}
		});
		console.log(data);
	});
	socket.on('addworker', function(data) {
		var wname= data.wname;
    	var wid= data.wid;
    	session(req, res, () => {
	        console.log(req.session);
	        id= req.session.passport.user;
    	});
    	socket.join(id);
		new User({
					type: "worker",
					username: wname,
					wid: wid
				}).save().then(function(new_user){
					console.log("new user is" + new_user);
					socket.emit('workeradded', new_user);
				});
	});
	socket.on('win', function(data) {
		var wname= data.wname;
    	var wid= data.wid;
    	var date= data.date;
    	session(req, res, () => {
	        console.log(req.session);
	        id= req.session.passport.user;
    	});
    	socket.join(id);
    	User.updateOne({_id: wid},{$push : {login: date}}, {$update : {lastlogin: date}}, function(err,res){
			if (err)  console.log(err);
		    else socket.emit('wined', {wid: wid, wname: wname, date: date});
		});
		
	});
	socket.on('wout', function(data) {
		var wname= data.wname;
    	var wid= data.wid;
    	var date= data.date;
    	session(req, res, () => {
	        console.log(req.session);
	        id= req.session.passport.user;
    	});
    	socket.join(id);
		User.updateOne({_id: wid},{$push : {logout: date}}, {$update : {lastlogout: date}}, function(err,res){
			if (err)  console.log(err);
		    else socket.emit('wouted', {wid: wid, wname: wname, date: date});
		});
	});
	socket.on('completed', function(data){
		orderid= data.orderid;
		userid= data.userid;
		User.findOne({_id: userid, orderids: orderid},function(err,result){
			if(err)
				console.log(err);
			else{
				console.log(result);
				index= result.orderids.indexOf(orderid);
				infoindex= 0;
				console.log(index);
				var setModifier = { $set: {} };
			    setModifier.$set['orders.' + index + '.orderstatus'] = 'completed';
				User.updateOne({_id: userid, "orders.orderid": orderid}, setModifier, function(err,result){
				    if(err) 
				    	socket.emit('completedorder', {
				    		yn: 'no'
				    	});
				    else
				    	socket.emit('completedorder', {
				    		yn: 'yes'
				    	});
				});
			}
		});
	});
	
	socket.on('startrate', function(data) {
		var lecid= data.lecture_id;
    	var lecname= data.lecture_name;
    	var rateid= data.id;
    	var userid;
    	var ques= data.ques;
    	var idrtu= lecid+rateid;
    	session(req, res, () => {
	        console.log(req.session);
	        userid= req.session.passport.user;
    	});
		User.updateOne({"lectures.lectureid": lecid},{$push : {"lectures.$.ratereviews" : {status: 1, idrt: rateid, ratesum: 0, count: 0, ques: ques, idrtu: idrtu }}}, function(err,res){
		    if (err)  console.log(err);
		    else{
			    console.log(res);
			    socket.broadcast.to(lecid).emit('startedrate', {
			   	//io.sockets.in(lecid).emit('startedrate', {
		    		lecture_name: lecname,
		    		lecture_id: lecid,
		    		rateid: rateid,
		    		rateques: ques,
		    		idrtu: idrtu
				});
				socket.emit('startedrateself', {
					lecture_name: lecname,
		    		lecture_id: lecid,
		    		rateid: rateid,
		    		rateques: ques,
		    		idrtu: idrtu
				})
		    }
		}); 
	});
	socket.on('startyn', function(data) {
		var lecid= data.lecture_id;
    	var lecname= data.lecture_name;
    	var ynid= data.id;
    	var userid;
    	var ques= data.ques;
    	session(req, res, () => {
	        console.log(req.session);
	        userid= req.session.passport.user;
    	});
		User.updateOne({"lectures.lectureid": lecid},{$push : {"lectures.$.ynreviews" : {status: 1, idyn: ynid, yes: 0, no: 0,ques: ques }}}, function(err,res){
		    if (err)  console.log(err);
		    else{
			    console.log(res);
			    socket.broadcast.to(lecid).emit('startedyn', {
			   	//io.sockets.in(lecid).emit('startedyn', {
		    		lecture_name: lecname,
		    		lecture_id: lecid,
		    		ynid: ynid,
		    		ynques: ques
				});
				socket.emit('startedynself', {
					lecture_name: lecname,
		    		lecture_id: lecid,
		    		ynid: ynid,
		    		ynques: ques
				});
		    }
		}); 
	});
	socket.on('attendlec', function(data) {
		var lecid= data.lecture_id;
    	var lecname;
    	/*
    	socket.join(lecid);
    	io.sockets.in(lecname).emit('join', data.lecture_id);
    	console.log("lecid=" + lecid);
    	session(req, res, () => {
	        console.log(req.session);
	        id= req.session.passport.user;
    	}); */
    	
		User.findOne({"lectures.lectureid": lecid},function(err,res){
			if(err)
				console.log("not found");
			else{
				i= res.lecids.indexOf(lecid);
				console.log(res.lectures[i]);
				socket.join(lecid);
		    	socket.emit('attendinglec', res.lectures[i]);
			}
		});
	});
	socket.on('rate', function(data){
		var lecid= data.lecture_id;
		var idrt= data.idrt;
		var lecturerid;
		var rating= data.rating;
		var count; var sum;
		User.findOne({lecids: lecid},function(err,result){
			if(err)
				console.log("not found");
			else{
				console.log(result);
				index= result.lecids.indexOf(lecid);
				// lecture index
				console.log(index);
				// rt index
				console.log(data.idrt);
				var trind= data.idrt;
				lecturerid= result.lectures[index].lecturerid;
				sum= result.lectures[index].ratereviews[idrt].ratesum+rating;
				count= result.lectures[index].ratereviews[idrt].count+1;
				var setModifier = { $inc: {} };
			    setModifier.$inc['lectures.' + index + '.ratereviews.' + trind + '.count'] = 1;
			    setModifier.$inc['lectures.' + index + '.ratereviews.' + trind + '.ratesum'] = rating;
				User.updateOne({_id: lecturerid, "lectures.lectureid": lecid, "lectures.ratereviews.idrt": trind}, setModifier, function(err,result){
				    if(err) console.log(err)
				    else{
				    	console.log(result);
				    	io.sockets.in(lecid).emit('rated', {
				    		lecture_id: lecid,
				    		rateid: idrt,
				    		sum: sum,
				    		count: count
				    	});
				    	socket.emit('rateded', {
				    		lecture_id: lecid,
				    		rateid: idrt,
				    		sum: sum,
				    		count: count
				    	});
				    }
				});
			}
		});
	});
	socket.on('yn', function(data){
		var lecid= data.lecture_id;
		var idyn= data.idyn;
		var lecturerid;
		var yes= data.yes;
		
		User.findOne({lecids: lecid},function(err,result){
			if(err)
				console.log("not found");
			else{
				console.log(result);
				index= result.lecids.indexOf(lecid);
				// lecture index
				console.log(index);
				// yn index
				console.log(data.idyn);
				var ynind= data.idyn;
				lecturerid= result.lectures[index].lecturerid;
				var yes_total= result.lectures[index].ynreviews[idyn].yes;
				var no_total= result.lectures[index].ynreviews[idyn].no;
				var setModifier = { $inc: {} };
				if(yes==1){
			    	setModifier.$inc['lectures.' + index + '.ynreviews.' + ynind + '.yes'] = 1;
			    	yes_total++;
			    }
			    else{
			    	setModifier.$inc['lectures.' + index + '.ynreviews.' + ynind + '.no'] = 1;
			    	no_total++;
			    }
				User.updateOne({_id: lecturerid, "lectures.lectureid": lecid, "lectures.ynreviews.idyn": ynind}, setModifier, function(err,result){
				    if(err) console.log(err)
				    else{
				    	console.log(result);
				    	io.sockets.in(lecid).emit('yned', {
				    		lecture_id: lecid,
				    		ynid: idyn,
				    		yes: yes_total,
				    		no: no_total
				    	});
				    	socket.emit('yneded', {
				    		lecture_id: lecid,
				    		ynid: idyn,
				    		yes: yes_total,
				    		no: no_total
				    	});
				    }
				});
			}
		});
	});
});