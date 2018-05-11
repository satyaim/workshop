//attendance-action.js
$(document).ready(function(){
	console.log("Developed By: Satyavrat Sharma || 2016B4A70322P");
	$(".dropdown-trigger").dropdown();
	$(".sidenav").sidenav();
});

//var url= "http://127.0.0.1:3000/";
var url="https://bits-workshop.herokuapp.com/";
var socket= io.connect(url);

function win(id,name){
	date= new Date();
	M.toast({html: 'Saving!'});
  	socket.emit("win",{
	    wname: name,
	    wid: id,
	    date: date
  	});
}

function wout(id,name){
	date= new Date();
	M.toast({html: 'Saving!'});
  	socket.emit("wout",{
	    wname: name,
	    wid: id,
	    date: date
  	});
}

socket.on("wined",function(data){
  M.toast({html: "Name: "+data.wname+" In Time "+ new Date(data.date).toLocaleDateString('en-GB')+" "+new Date(data.date).toLocaleTimeString('en-GB')});
  document.getElementsByClassName(data.wid+' in')[0].classList.add("disabled");
  document.getElementsByClassName(data.wid+' out')[0].classList.remove("disabled");
});

socket.on("wouted",function(data){
  M.toast({html: "Name: "+data.wname+" Out Time "+ new Date(data.date).toLocaleDateString('en-GB')+" "+ new Date(data.date).toLocaleTimeString('en-GB')});
  document.getElementsByClassName(data.wid+' in')[0].classList.remove("disabled");
  document.getElementsByClassName(data.wid+' out')[0].classList.add("disabled");
});