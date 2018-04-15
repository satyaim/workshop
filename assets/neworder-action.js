//neworder-action.js
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

function place(){
	if(!document.getElementById("iname").classList.contains("valid")||!document.getElementById("iqty").classList.contains("valid")||!document.getElementById("iabout").classList.contains("valid")||!document.getElementById("cusname").classList.contains("valid")||!document.getElementById("cusphone").classList.contains("valid"))
		{console.log("Invalid Fields"); return;} 
	document.getElementsByClassName("btn-place")[0].classList.add("disabled")
	iname= document.getElementById("iname").value;
	iqty= document.getElementById("iqty").value;
	iabout= document.getElementById("iabout").value;
	cusname= document.getElementById("cusname").value;
	cusphone= document.getElementById("cusphone").value;
	placeorder();
}

//var url= "http://127.0.0.1:3000/";
var url="https://bits-workshop.herokuapp.com/";
var socket= io.connect(url);
function placeorder(i){
	orderid= Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  	socket.emit("placeorder",{
	    iname: iname,
	    iqty: iqty,
	    iabout: iabout,
	    cusname: cusname,
	    cusphone: cusphone,
	    orderid: orderid
  	});
}
socket.on("orderplaced",function(data){
  console.log(data);  //orderplaced
  document.getElementById("placed-id").innerHTML=data.orderid;
  document.getElementById("placed-name").innerHTML=data.ordername;
  document.getElementById("placed-qty").innerHTML=data.orderqty;
  document.getElementsByClassName("modal")[0].style.display="block";
});