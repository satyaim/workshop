//addorder-action.js
$(document).ready(function(){
	console.log("here");
	$(".dropdown-trigger").dropdown();
	$(".sidenav").sidenav();
	$('input#iname, textarea#iabout, input#cusphone').characterCounter();
});

var iname;
var iqty;
var iabout;
var cusname;
var cusphone;
var imageurl;

function place(){
	if(!document.getElementById("iname").classList.contains("valid")||!document.getElementById("iqty").classList.contains("valid")||!document.getElementById("iabout").classList.contains("valid")||!document.getElementById("cusname").classList.contains("valid")||!document.getElementById("cusphone").classList.contains("valid"))
		{M.toast({html: 'Invalid Fields!'}); return;} 
	document.getElementsByClassName("btn-place")[0].classList.add("disabled")
	iname= document.getElementById("iname").value;
	iqty= document.getElementById("iqty").value;
	iabout= document.getElementById("iabout").value;
	cusname= document.getElementById("cusname").value;
	cusphone= document.getElementById("cusphone").value;
	imageurl= document.getElementById("imageurl").value;
	placeorder();
}

//var url= "http://127.0.0.1:3000/";
var url="https://bits-workshop.herokuapp.com/";
var socket= io.connect(url);
function placeorder(i){
	M.toast({html: 'Placing Order!'});
	orderid= Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  	socket.emit("placeorder",{
	    iname: iname,
	    iqty: iqty,
	    iabout: iabout,
	    cusname: cusname,
	    cusphone: cusphone,
	    orderid: orderid,
	    imageurl: imageurl
  	});
}
socket.on("orderplaced",function(data){
  //console.log(data);  //orderplaced
  M.toast({html: 'Order Placed!'});
  document.getElementById("orderlink").href="./myorders/"+data.orderid;
  document.getElementById("placed-id").innerHTML=data.orderid;
  document.getElementById("placed-name").innerHTML=data.ordername;
  document.getElementById("placed-qty").innerHTML=data.orderqty;
  document.getElementsByClassName("modal")[0].style.display="block";
});