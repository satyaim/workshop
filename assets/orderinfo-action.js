//orderinfo-action.js
$(document).ready(function(){
	console.log("here");
	$(".dropdown-trigger").dropdown();
	$(".sidenav").sidenav();
  	isCompleted();
});

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
  }
}