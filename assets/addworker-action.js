//addworker-action.js
$(document).ready(function(){
	console.log("Developed By: Satyavrat Sharma || 2016B4A70322P");
	$(".dropdown-trigger").dropdown();
	$(".sidenav").sidenav();
	$('input#iname, textarea#iabout, input#cusphone').characterCounter();
});

var wname;
var wid;
function addworker(){
	if(!document.getElementById("wname").classList.contains("valid"))
		{M.toast({html: 'Invalid Fields!'}); return;} 
	document.getElementsByClassName("btn-place")[0].classList.add("disabled")
	wname= document.getElementById("wname").value;
	adding();
}

//var url= "http://127.0.0.1:3000/";
//var url="https://bits-workshop.herokuapp.com/";
var url= window.location.origin;
var socket= io.connect(url);
function adding(){
	M.toast({html: 'Adding Worker!'});
	wid= Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
  	socket.emit("addworker",{
	    wname: wname,
	    wid: wid
  	});
}
socket.on("workeradded",function(data){
  M.toast({html: 'Worker Added!'});
  document.getElementById("worker-name").innerHTML=data.username;
  document.getElementById("worker-id").innerHTML=data.wid;
  document.getElementsByClassName("modal")[0].style.display="block";
});