//user-model.js
const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const ynSchema= new Schema({
	status: Number,
	idyn: Number,
	yes: Number,
	no: Number,
	ques: String 
});
const orderinfoSchema= new Schema({
	status: Number,
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
	orderqty: Number
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