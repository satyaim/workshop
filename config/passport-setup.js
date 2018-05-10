//passport-setup.js
// Modules
const passport= require("passport");
const GoogleStrategy= require("passport-google-oauth20");
const LocalStrategy = require('passport-local').Strategy;
const key= require("./keys");
const User= require("../models/user-model");
// Tell Passport We're using Google Strategy
passport.serializeUser(function(user,done){
	console.log("serializeUser");
	done(null,user.id);
});
passport.deserializeUser(function(id,done){
	console.log("deserializeUser");
	//console.log(id);
	User.findById(id).then(function(user){
		done(null,user);
	});
});
passport.use("google-adm",new GoogleStrategy(
	{
		callbackURL: "/admin/google/redirectadm",
		clientID: key.google.clientID,
		clientSecret: key.google.clientSecret
	},
	function(accessToken,refreshToken,profile,done){
		console.log("passport callback function fired");
		console.log(profile);
		console.log(accessToken);
		console.log(refreshToken);
		//Match one user from User
		User.findOne({ googleId: profile.id, type: "admin"}).then(function(curr_user){
			if(curr_user){
				console.log("current user is" + curr_user);
				done(null,curr_user);
			}
			else{
				console.log("adding new user");
				new User({
					type: "admin",
					username: profile.displayName,
					googleId: profile.id,
					thumbnail: profile._json.image.url
				}).save().then(function(new_user){
					console.log("new user is" + new_user);
					done(null,new_user);
				});
			}
		});
	}
));
passport.use("google-work",new GoogleStrategy(
	{
		callbackURL: "/admin/google/redirectadm",
		clientID: key.google.clientID,
		clientSecret: key.google.clientSecret
	},
	function(accessToken,refreshToken,profile,done){
		console.log("passport callback function fired");
		console.log(profile);
		console.log(accessToken);
		console.log(refreshToken);
		//Match one user from User
		User.findOne({ googleId: profile.id, type: "admin"}).then(function(curr_user){
			if(curr_user){
				console.log("current user is" + curr_user);
				done(null,curr_user);
			}
			else{
				console.log("adding new user");
				new User({
					type: "admin",
					username: profile.displayName,
					googleId: profile.id,
					thumbnail: profile._json.image.url
				}).save().then(function(new_user){
					console.log("new user is" + new_user);
					done(null,new_user);
				});
			}
		});
	}
));
passport.use("google-worker",new GoogleStrategy(
	{
		callbackURL: "/auth/google/redirectworker",
		clientID: key.google.clientID,
		clientSecret: key.google.clientSecret
	},
	function(accessToken,refreshToken,profile,done){
		console.log("passport callback function fired");
		console.log(profile);
		console.log(accessToken);
		console.log(refreshToken);
		//Match one user from User
		User.findOne({ googleId: profile.id, type: "worker"}).then(function(curr_user){
			if(curr_user){
				console.log("current user is" + curr_user);
				var date= new Date();
				User.updateOne({googleId: profile.id, type: "worker"},{$push : {login: date}}, function(err,res){
				    if (err)  console.log(err);
				    else console.log("logged in")
				});
				done(null,curr_user);
			}
			else{
				console.log("not found")
				done(null,null);
			}
		});
	}
));
passport.use("google-cus",new GoogleStrategy(
	{
		callbackURL: "/auth/google/redirectcus",
		clientID: key.google.clientID,
		clientSecret: key.google.clientSecret
	},
	function(accessToken,refreshToken,profile,done){
		console.log("passport callback function fired");
		console.log(profile);
		console.log(accessToken);
		console.log(refreshToken);
		//Match one user from User
		User.findOne({ googleId: profile.id, type: "customer"}).then(function(curr_user){
			if(curr_user){
				console.log("current user is" + curr_user);
				done(null,curr_user);
			}
			else{
				console.log("adding new user");
				new User({
					type: "customer",
					username: profile.displayName,
					googleId: profile.id,
					thumbnail: profile._json.image.url
				}).save().then(function(new_user){
					console.log("new user is" + new_user);
					done(null,new_user);
				});
			}
		});
	}
));
