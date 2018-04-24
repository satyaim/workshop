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
	inputs: String
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
	orderinfo: [orderinfoSchema]
});
const userSchema= new Schema({
	username: String,
	googleId: String,
	thumbnail: String,
	cover: String,
	ordernames: [String],
	orderids: [String],
	orders: [orderSchema]
});

const User= mongoose.model('user',userSchema);
module.exports= User;