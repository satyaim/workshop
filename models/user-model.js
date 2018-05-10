//user-model.js
const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const orderinfoSchema= new Schema({
	index: Number,
	shop: String,
	worker: String,
	fromdate: String,
	fromtime: String,
	todate: String,
	totime: String,
	description: String,
	inputs: String,
	workerid: String
});
const orderSchema= new Schema({
	ordername: String,
	orderid: String,
	orderusername: String,
	orderuserid: String,
	orderuserphone: String,
	orderabout: String,
	orderstatus: String,
	ordershopsnum: Number,
	ordercost: Number,
	orderqty: Number,
	orderimage: String,
	orderinfo: [orderinfoSchema],
	imageurl: String
});
const userSchema= new Schema({
	type: String,
	username: String,
	googleId: String,
	thumbnail: String,
	cover: String,
	ordernames: [String],
	orderids: [String],
	orders: [orderSchema],
	workerid: String,
	name: String,
	password: String,
	login: [String],
	logout: [String],
	lastlogin: String,
	lastlogout: String,
	wid: String,
	work_shop: [String],
	work_fromtime: [String],
	work_fromdate: [String],
	work_totime: [String],
	work_todate: [String],
	work_describe: [String],
	work_inputs: [String]
});

const User= mongoose.model('user',userSchema);
module.exports= User;