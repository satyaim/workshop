//orderinfo-action.js
$(document).ready(function(){
	console.log("Developed By: Satyavrat Sharma || 2016B4A70322P");
	$(".dropdown-trigger").dropdown();
	$(".sidenav").sidenav();
  	isCompleted();
});

//var url= "http://127.0.0.1:3000/";
//var url="https://bits-workshop.herokuapp.com/";
var url= window.location.origin;
var socket= io.connect(url);

function countshops(){
  i=0;
  while(document.getElementsByClassName("shoptime")[i]){
    i++;
  }
  return i;
}

function isCompleted(){
  completed=1;
  for(var i=0;i<countshops();i++){
    // completed
    if(new Date(document.getElementsByClassName("shoptime")[i].getElementsByClassName("todate")[0].innerHTML+' '+document.getElementsByClassName("shoptime")[i].getElementsByClassName("totime")[0].innerHTML)< new Date){
      document.getElementsByClassName("shoptime")[i].getElementsByClassName("timeline-badge")[0].classList.remove("grey");
      document.getElementsByClassName("shoptime")[i].getElementsByClassName("timeline-badge")[0].classList.add("green");
      document.getElementsByClassName("shoptime")[i].getElementsByClassName("material-icons")[0].innerHTML="done";
    }
    // running
    else if(new Date(document.getElementsByClassName("shoptime")[i].getElementsByClassName("fromdate")[0].innerHTML+' '+document.getElementsByClassName("shoptime")[i].getElementsByClassName("fromtime")[0].innerHTML)< new Date){
      document.getElementsByClassName("shoptime")[i].getElementsByClassName("timeline-badge")[0].classList.remove("grey");
      document.getElementsByClassName("shoptime")[i].getElementsByClassName("timeline-badge")[0].classList.add("green");
      completed=0;
    }
    else
      completed=0;
  }
  if(completed==1 && document.getElementsByClassName("completed")[0]){
    document.getElementsByClassName("completed")[0].getElementsByClassName("timeline-badge")[0].classList.remove("grey");
    document.getElementsByClassName("completed")[0].getElementsByClassName("timeline-badge")[0].classList.add("green");
    document.getElementsByClassName("completed")[0].getElementsByClassName("material-icons")[0].innerHTML="done_all";
    tellCompleted();
  }
}

function tellCompleted(){
  userid=document.getElementById("userid").innerHTML;
  orderid=document.getElementById("orderid").innerHTML;
  socket.emit("completed",{
    userid: userid,
    orderid: orderid,
  });
}

socket.on("completedorder",function(data){
  //console.log(data);  //orderplaced
  M.toast({html: 'Order Completed!'});
});