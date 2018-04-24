//order-action.js
$(document).ready(function(){
	console.log("here");
	$(".dropdown-trigger").dropdown();
	$(".sidenav").sidenav();
  $('select').formSelect();
  $('.datepicker').datepicker();
  $('.timepicker').timepicker();
});

//var url= "http://127.0.0.1:3000/";
var url="https://bits-workshop.herokuapp.com/";
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
  	location.reload()
  }
  else
  	M.toast({html: 'Could Not Rejects Order!'});
});

function addman(ele){

  $(ele).parent().after('<div class="input-field row grey-text text-darken-4 white worker"><select class="col s6"><option value="" disabled selected>Choose Worker</option><option value="1">Worker 1</option><option value="2">Worker 2</option><option value="3">Worker 3</option><option value="4">Worker 4</option><option value="5">Worker 5</option><option value="6">Worker 6</option><option value="7">Worker 7</option></select><span class="col s2">From</span><input type="text" class="datepicker col s5 validate" placeholder="Date [From]"><input type="text" class="timepicker col s5 validate" placeholder="Time [From]"><span class="col s2">To</span><input type="text" class="datepicker col s5 validate" placeholder="Date [To]"><input type="text" class="timepicker col s5 validate" placeholder="Time [To]"><div class="input-field col s12"><textarea id="job" class="materialize-textarea"></textarea><label for="job">Job Description</label></div><div class="input-field col s12"><textarea id="req" class="materialize-textarea"></textarea><label for="req">Inputs</label></div><a class="waves-effect waves-light btn grey darken-4 col s6 offset-s3" onclick="addman(this)"><i src=""></i>Add Worker</a></div>');
  $(ele).addClass('disabled');
  $('select').formSelect();
  $('.datepicker').datepicker();
  $('.timepicker').timepicker();
}

function addshop(ele){
  $(ele).parent().parent().parent().after('<div class="card horizontal grey darken-4"><div class="card-stacked"><div class="card-content card-shop"><div class="input-field row white" style="padding:2vh 2vw;"><select class="col s12 l6"><option value="" disabled selected>Choose Shop</option><option value="1">Shop 1</option><option value="2">Shop 2</option><option value="3">Shop 3</option><option value="4">Shop 4</option><option value="5">Shop 5</option><option value="6">Shop 6</option><option value="7">Shop 7</option></select></div><div class="input-field row grey-text text-darken-4 white worker"><select class="col s6"><option value="" disabled selected>Choose Worker</option><option value="1">Worker 1</option><option value="2">Worker 2</option><option value="3">Worker 3</option><option value="4">Worker 4</option><option value="5">Worker 5</option><option value="6">Worker 6</option><option value="7">Worker 7</option></select><span class="col s2">From</span><input type="text" class="datepicker col s5 validate" placeholder="Date [From]"><input type="text" class="timepicker col s5 validate" placeholder="Time [From]"><span class="col s2">To</span><input type="text" class="datepicker col s5 validate" placeholder="Date [To]"><input type="text" class="timepicker col s5 validate" placeholder="Time [To]"><div class="input-field col s12"><textarea id="job" class="materialize-textarea"></textarea><label for="job">Job Description</label></div><div class="input-field col s12"><textarea id="req" class="materialize-textarea"></textarea><label for="req">Inputs</label></div><a class="waves-effect waves-light btn grey darken-4 col s6 offset-s3" onclick="addman(this)"><i src=""></i>Add Worker</a></div></div><div class="card-action"><a onclick="addshop(this);" class="white-text">Add Another Shop</a></div></div></div>');
  $(ele).addClass('disabled');
  $('select').formSelect();
  $('.datepicker').datepicker();
  $('.timepicker').timepicker();
}

function view(){
  var Cost= document.getElementById("icost").value;
  document.getElementById("add").innerHTML="Cost: "+Cost+"<br/><br/><br/>";
  var Shops=[];
  document.getElementsByClassName("view")[0].style.display="block";
  i=0;
  while(document.getElementsByClassName("card-shop")[i]){
    console.log(i);
    j=0;
    while(document.getElementsByClassName("card-shop")[i].getElementsByClassName("worker")[j]){
      Shops.push(document.getElementsByClassName("card-shop")[i].getElementsByTagName("input")[0].value);
      document.getElementById("add").innerHTML=document.getElementById("add").innerHTML+"Shop: "+Shops[Shops.length-1]+"<br/>";
      var Workers=[];
      for(k=0;k<7;k++){
        if(k<5){
          Workers.push(document.getElementsByClassName("card-shop")[i].getElementsByClassName("worker")[j].getElementsByTagName("input")[k].value);
        }
        else{ 
          Workers.push(document.getElementsByClassName("card-shop")[i].getElementsByClassName("worker")[j].getElementsByTagName("textarea")[k-5].value);     
        }
        console.log(Workers);
      }
      document.getElementById("add").innerHTML=document.getElementById("add").innerHTML+"Worker: "+Workers[0]+"<br/>";
      document.getElementById("add").innerHTML=document.getElementById("add").innerHTML+"From: "+Workers[1]+" "+Workers[2]+"<br/>";
      document.getElementById("add").innerHTML=document.getElementById("add").innerHTML+"To: "+Workers[3]+" "+Workers[4]+"<br/>";
      document.getElementById("add").innerHTML=document.getElementById("add").innerHTML+"Description:"+Workers[5]+"<br/>";
      document.getElementById("add").innerHTML=document.getElementById("add").innerHTML+"Inputs: "+Workers[6]+"<br/><br/>";
      Shops.push(Workers);
      j++;
    }
    i++;
  }
  console.log(Shops);
}
function closeit(){
  console.log("close");
  document.getElementsByClassName("view")[0].style.display="none";  
}
function confirm(){
  var Cost= document.getElementById("icost").value;
  if(Cost==""){
    M.toast({html: 'Enter Total Order Cost'});
    return;
  }
  var Shops=[];
  i=0;
  while(document.getElementsByClassName("card-shop")[i]){
    console.log(i);
    j=0;
    while(document.getElementsByClassName("card-shop")[i].getElementsByClassName("worker")[j]){
      Shops.push(document.getElementsByClassName("card-shop")[i].getElementsByTagName("input")[0].value);
      if(Shops[Shops.length-1]=="Choose Shop"){
        M.toast({html: 'Select Shop Name for Shop '+(i+1)});
        return;
      }
      var Workers=[];
      for(k=0;k<7;k++){
        if(k<5){
          Workers.push(document.getElementsByClassName("card-shop")[i].getElementsByClassName("worker")[j].getElementsByTagName("input")[k].value);
        }
        else{ 
          Workers.push(document.getElementsByClassName("card-shop")[i].getElementsByClassName("worker")[j].getElementsByTagName("textarea")[k-5].value);     
        }
        console.log(Workers);
      }
      if(Workers[0]=='Choose Worker'){
        M.toast({html: 'Select Worker Name for Shop '+(i+1)});
        return;
      }
      Shops.push(Workers);
      j++;
    }
    i++;
  }
  console.log(Shops);
  M.toast({html: 'Confirming Plan!'});
  userid=document.getElementById("userid").innerHTML;
  orderid=document.getElementById("orderid").innerHTML;
  socket.emit("confirm",{
    userid: userid,
    orderid: orderid,
    icost: Cost,
    shops: Shops
  });
}
socket.on("confirmed",function(data){
  //console.log(data);  //orderplaced
  M.toast({html: 'Plan Saved!'});
  M.toast({html: 'Refreshing Page!'});
  location.reload();
});