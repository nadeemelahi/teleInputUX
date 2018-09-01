"use strict";
var T =new function(){ 
   var items = [], len;
   this.add=function(item){
      items.push(item);
      len=items.length;
   };
   var rmIdx;
   this.rm=function(item){
      rmIdx=items.indexOf(item);
      items.splice(rmIdx,1);
      len=items.length;
   };
   var dt,ct,lt=Date.now();
   var raf = window.requestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(cb){setTimeout(cb,30);};
   var i,t=0;
   function ticker(){
      ct=Date.now();
      dt=ct-lt;
      t += dt;
      if(t>30){
	 for(i=0;i<len;i++){
	    items[i].tick(t);
	 }
	 t=0;
      } 
      lt=ct;
      raf(ticker);
   } 
   ticker();
};
var NavMobile =new function() {

   var hidden=1,
      height=0,
      heightLimit=129,
      heightIncrement=50,
      busy=0, 
      duration=100,
      navMobile
      =document
      .getElementById("navMobile");

   this.toggle =function(){
      if(busy) 
	 return;

      busy^=1;

      if(hidden) 
	 this.tick
	    =showMobileNav;
      else 
	 this.tick
	    =hideMobileNav;

      T.add(this);

   };

   function showMobileNav(){
      height
	 +=heightIncrement;

      if(height>heightLimit){
	 T.rm(this);
	 height
	    =heightLimit;

	 hidden^=1;
	 busy^=1;
      }
      navMobile
	 .style
	 .height
	 = height + "px";
   }

   function hideMobileNav(){
      height-=heightIncrement;

      if(height<0){
	 T.rm(this);
	 height=0;

	 hidden^=1;
	 busy^=1;
      }
      navMobile
	 .style
	 .height
	 = height + "px";
   }

   this.tick=null;

};
var SmoothScroller=new function(){
   var scrollPos,
      decrStart=175,
      decrEnd=25,
      decrement=decrStart;


   this.scrollToTop=function(){
      scrollPos 
	 = document.documentElement 
	 ? document.documentElement.scrollTop 
	 : document.body.scrollTop;

      T.add(this);
   };

   this.tick=function(t){
      scrollPos-=decrement;
       if(scrollPos < decrement){
	  if(decrement === decrStart){
	     decrement=decrEnd;

	  } else {
	     T.rm(this);
	     scrollPos=0;
	     decrement=decrStart;
	  }
      }
      window.scrollTo(0,scrollPos);
   };
};
var SharedNodes = {

   $nameInput:
   document
   .getElementById(
      "nameInput"),

   $emailInput:
   document
   .getElementById(
      "emailInput"),

   $telInput:
   document
   .getElementById(
      "telInput"),

   $messageTextarea:
   document
   .getElementById(
      "messageTextarea"),

   $submitBtn:
   document
   .getElementById(
      "submitBtn")

};

var RippleBtnCircleAction =new function(){

   var $submitBtn
      =SharedNodes["$submitBtn"],

      submitBtnDims 
      =$submitBtn
      .getBoundingClientRect(),

      $rippleBtnEffectCircle
      =document
      .getElementById("rippleBtnEffectCircle");

   $rippleBtnEffectCircle.style.width
      =$rippleBtnEffectCircle.style.height
      =submitBtnDims.width + "px";

   this.addScaleUpBurst=function(e){

      $rippleBtnEffectCircle
	 .style.left 
	 =e.offsetX - 80 + "px"; 

      $rippleBtnEffectCircle
	 .style.top 
	 =e.offsetY - 85 + "px"; 

      $rippleBtnEffectCircle
	 .classList
	 .add("scaleUp");

      T.add(this);
   };

   var delay=600,time=0;

   this.tick =function (t){
      time+=t;

      // pause
      if(time<delay) return;

      // remove
      T.rm(this);
      $rippleBtnEffectCircle
	 .classList
	 .remove("scaleUp");
      time=0;
   };

};
var TelFormat = new function(){

   var $telInput
      =SharedNodes["$telInput"],

      idx=0,

      key, code,

      currentValue,

      digitRegex
      =/[0-9]/,

      $messageTextarea
      =SharedNodes["$messageTextarea"];

   this.clickInit =clickInitInsertMode; 

   function clickInitReplaceMode(){

      idx = $telInput.selectionStart;
      if(idx>11){
	 //last char needs to be selected
	 
	 $telInput
	    .setSelectionRange(11,12);
      } else {
	 if(idx===3 || idx===7){
	    idx++;
	 }

	 $telInput
	    .setSelectionRange(idx,idx+1);
      }

   }

   function clickInitInsertMode(){

      $telInput.value 
	 ="XXX-XXX-XXXX";

      $telInput
	 .setSelectionRange(0,1);

      idx=0;

   }

   this.validate = insertModeValidation;

   function replaceModeValidation(e){

      key = e.key;
      code = e.keyCode;

      idx = $telInput.selectionStart;

      currentValue = $telInput.value;

      if(digitRegex.test(key)){

	 if(idx===12){
	    $telInput
	       .setSelectionRange(11,12);

	 } else {
	    if(idx===3 || idx===7){
	       idx++;
	    }
	    $telInput
	       .setSelectionRange(idx,idx+1);
	 }

      } else { //Not a digit

	 if(code===37){ //ArrowLeft  

	    if(idx===0) {
	       console.log("already first char");
	       $telInput
		  .setSelectionRange(0,1);

	    } else {
	       idx--;
	       if(idx===3 || idx===7){
		  idx--;
	       }
	       $telInput
		  .setSelectionRange(idx,idx+1);
	    }

	 } else if(code === 39 ){ //ArrowRight

	    if(idx===12){
	       $telInput
		  .setSelectionRange(11,12);

	    } else {
	       if(idx===3 || idx===7){
		  idx++;
	       }
	       $telInput
		  .setSelectionRange(idx,idx+1);
	    }

	 } else if(code === 46 || code === 8){
	    //Delete or Backspace
	    this.validate=insertModeValidation;
	    this.clickInit=clickInitInsertMode;
	    this.clickInit();

	 } else { 
	    //reset value
	    $telInput.value = currentValue;
	 }

      }

   }

   function insertModeValidation(e){

      key = e.key;
      code = e.keyCode;

      if(digitRegex.test(key)){

	 if(idx > 10) {

	    $messageTextarea.focus();

	    $telInput.value
	       =$telInput.value.slice(0,-1);

	    //DONE, switch to replace mode
	    this.validate = replaceModeValidation;
	    this.clickInit = clickInitReplaceMode;

	 } else if(idx===0) {

	    idx=1;

	 } else {

	    idx=$telInput.selectionStart;

	    if(idx===3 || idx===7) {

	       $telInput.value
		  =$telInput.value.substr(0,idx)
		  +$telInput.value.substr(idx+1);

	       idx++;
	       $telInput.selectionEnd =idx;

	    } else {

	       $telInput.value
		  =$telInput.value.substr(0,idx)
		  +$telInput.value.substr(idx+1);

	       $telInput.selectionEnd =idx;
	    }

	 }

      } else {
	 this.clickInit();
      }
   }


};

var Keyups =new function(){

   var $emailInput
      =SharedNodes["$emailInput"],

      $telInput
      =SharedNodes["$telInput"],

      $messageTextarea
      =SharedNodes["$messageTextarea"];

   this.checker =function(e){
      if(!e) var e = window.event;

      var d = e.target.id,
	 kc = e.keyCode;

      if(d==="nameInput" && kc===13){
	 $emailInput.focus();

      } else if(d==="emailInput" && kc===13){
	 $telInput.focus();
	 TelFormat.clickInit();


      } else if(d==="telInput"){
	 if(kc===13)
	    $messageTextarea.focus();
	 else 
	    TelFormat.validate(e);

      } else {
	 console.log("un-handled keyUp evt");
      }

   };
};
document.body.addEventListener("keyup",
   Keyups.checker,false);


var Clicks =new function(){

   var i,
      SubmitD=[
	 "submitBtn", 
	 "submitBtnIcon", 
	 "rippleBtnEffectCircle", 
	 "submitBtnP"
      ],
      NavD=[
	 "myNavbarToggleBtn",
	 "myNavbarToggleBtnIcon", 
	 "link_about", 
	 "link_portfolio",
	 "link_contact"
      ];

   this.checker =function(e){
      if(!e) var e = window.event;
      var d = e.target.id;

      if(d === "scrollToHome"){
	 SmoothScroller.scrollToTop();

      } else if (d === "telInput"){
	 TelFormat.clickInit();

      } else {

	 for(i=0;i<4;i++){
	    if(d === SubmitD[i]){
	       e.preventDefault();
	       RippleBtnCircleAction
		  .addScaleUpBurst(e);
	       return;
	    }
	 }

	 for(i=0;i<5;i++){
	    if(d === NavD[i]){
	       NavMobile.toggle();
	       return;
	    }
	 }
      }

   };
};

document.body.addEventListener("click",
   Clicks.checker,false);




var Ajax =new function(){
   var serverScript 
      ="contactForm.php",

      Req 
      =new XMLHttpRequest();

   this.makePostRequest 
      =function(serial){
	 Req.open("POST", 
	    serverScript,  
	    "application/x-www-form-urlencoded");
	 Req.send(serial);
      }

   var ResTxt;
   function Response(){
      if(this.readyState == 4 && this.status == 200){
	 ResTxt = JSON.parse(this.responseText);
      }
   }
};



var App = function(){

}
window.addEventListener("load",App,false);


