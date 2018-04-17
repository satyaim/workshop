//order-action.js
$(document).ready(function(){
	console.log("here");
	$(".dropdown-trigger").dropdown();
	$(".sidenav").sidenav();
});

var url= "http://127.0.0.1:3000/";
//var url="https://bits-workshop.herokuapp.com/";
var socket= io.connect(url);
function accept(){
	userid= window.location.pathname.split( '/' )[3];
	orderid= window.location.pathname.split( '/' )[4];
	M.toast({html: 'Accepting Order!'});
  	socket.emit("acceptorder",{
	    userid: userid,
	    orderid: orderid
  	});
}
function reject(){
	userid= window.location.pathname.split( '/' )[3];
	orderid= window.location.pathname.split( '/' )[4];
	M.toast({html: 'Rejecting Order!'});
  	socket.emit("rejectorder",{
	    userid: userid,
	    orderid: orderid
  	});
}
socket.on("acceptedorder",function(data){
  if(data.yn=="yes"){
  	M.toast({html: 'Order Accepted! \nReloading Page'});
  	window.location.reload()
  }
  else
  	M.toast({html: 'Could Not Accept Order!'});
});
socket.on("rejectedorder",function(data){
  if(data.yn=="yes"){
  	M.toast({html: 'Order Rejected! \nReloading Page'});
  	window.location.reload()
  }
  else
  	M.toast({html: 'Could Not Rejects Order!'});
});
