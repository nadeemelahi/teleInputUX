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

var Fader = function(node){
   this.$node = node;
   this.elapsed; this.duration = 500;
   this.tick = this.dummy;
   this.cb = null;
   T.add(this);
};
Fader.prototype.in = function(cb){
   this.cb = null;
   if(cb) this.cb = cb;
   this.tick = this.dummy;
   this.elapsed = 0;
   this.$node.style.opacity = 0;
   this.tick = this.showing;
};
Fader.prototype.out = function(cb){
   this.cb = null;
   if(cb) this.cb = cb;
   this.tick = this.dummy;
   this.elapsed = 0;
   this.$node.style.opacity = 1;
   this.tick = this.hiding;
};
Fader.prototype.showing = function(dt){
   this.elapsed += dt;
   if(this.elapsed > this.duration){
      this.$node.style.opacity = 1;
      this.tick = this.dummy;
      if(this.cb !== null) this.cb();
   } else {
      this.$node.style.opacity = this.elapsed/this.duration;
   }
};
Fader.prototype.hiding = function(dt){
   this.elapsed += dt;
   if(this.elapsed > this.duration){
      this.$node.style.opacity = 0;
      this.tick = this.dummy;
      if(this.cb !== null) this.cb();
   } else {
      this.$node.style.opacity = 1 - this.elapsed/this.duration;
   }
};
Fader.prototype.dummy = function(){};
Fader.prototype.tick = null; 
function empty($){
   while($.firstChild)
      $.removeChild(
	 $.firstChild)
}
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
var SharedData = {

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
      "submitBtn"),

   telNumRegex:/^\d{3}-\d{3}-\d{4}$/

};

var RippleBtnCircleAction =new function(){

   var $submitBtn
      =SharedData["$submitBtn"],

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
var TelFormat =new function(){

   var $telInput
      =SharedData["$telInput"],

      $messageTextarea
      =SharedData["$messageTextarea"],

      number =['X','X','X','-',
	 'X','X','X','-',
	 'X','X','X','X'],

      digitRegex=/[0-9]/,

      numberRegex
      =SharedData["telNumRegex"]

   set_number_value();
   function set_number_value(){
      $telInput.value  
	 =number.join("");
   }
   
   var idx;
   function highlight_idx(){
      $telInput
	 .setSelectionRange(
	    idx,idx+1);
   }
   function skip_dash_right(){
      if(idx>11)idx=11;
      else if(idx===3||idx===7)idx++;
   }
   function skip_dash_left(){
      console.log('skip_dash_left: ' + idx);
      if(idx===3||idx===7)idx--;
   }
   function highlight_right(){//e.key==ArrowRight
      idx=$telInput
	 .selectionStart;
      if(idx===12) idx--;
      else skip_dash_right();
      highlight_idx();
      console.log("highlight_right() idx: " + idx);
   }
   function highlight_left(){//e.key==ArrowLeft
      idx=$telInput
	 .selectionStart;
      idx--;
      if(idx<0) idx=0;
      else skip_dash_left();
      highlight_idx();
      console.log("highlight_left() idx: " + idx);
   }

   function set_idx_right(){
      idx++;
      skip_dash_right();
      number[idx]= 'X'; 
      set_number_value();
      highlight_idx(idx);
   }
   function set_idx_left(){
      idx--;
      if(idx<0) idx=0;
      else skip_dash_left();
      number[idx]= 'X'; 
      console.log("number: " +number);
      set_number_value();
      console.log('set_idx_left: ' +idx);
      highlight_idx(idx);
   }
  
   function first_click_h(e){
      //console.log("first_click()");
      if(!e) var e = window.event;
      if(e.target.id !== "telInput") return;
      idx=0;
      $telInput
	 .setSelectionRange(0,1);
      document.body
	 .removeEventListener("click",
	    first_click_h,false);

      document.body
	 .addEventListener("click",
	    click_h,false);
   }
   function click_h(e){
      //console.log("click()");
      if(!e) var e = window.event;
      if(e.target.id !== "telInput") return;
      highlight_right();
   }
   document.body
   .addEventListener("click",
      first_click_h,false);


   function keyup_h(e){
      console.log("TelFormat keyup_h()");
      //e.key; e.keyCode;
      if(!e) var e = window.event;
      if(e.target.id!=="telInput") return;

      if(e.keyCode===39){//e.key==ArrowRight
	 highlight_right();
      }else if(e.keyCode===37){//e.key==ArrowLeft
	 highlight_left();
      }else if(e.keyCode===46){//e.key==DELETE
	 set_idx_right();
      }else if(e.keyCode===8){//e.key==BACKSPACE
	 set_idx_left();
      }else if(digitRegex.test(e.key)){
	 number[idx]=e.key;
	 set_number_value();
	 idx++;
	 if(idx===12 && numberRegex
	    .test($telInput.value)){
	    $messageTextarea.focus();
	 }
	 else skip_dash_right();
	 highlight_idx();
      }
   }
   document.body
   .addEventListener("keyup",
      keyup_h,false);

};


var Advance_Focus =new function(){
   var $emailInput
      =SharedData["$emailInput"],
      $telInput
      =SharedData["$telInput"],
      $messageTextarea
      =SharedData["$messageTextarea"];

   function on_keyup_h(e){
      if(!e) var e = window.event;
      if(e.keyCode===13){
	 if(e.target.id==="nameInput"){
	    $emailInput.focus();
	 }else if(e.target.id==="emailInput"){
	    $telInput.focus();
	 }else if(e.target.id==="telInput"){
	    $messageTextarea.focus();
	 }
      }
   }
   document.body
      .addEventListener("keyup",
	 on_keyup_h,false);
};
var FadeErrorMsg ={

   nameLabelTooMany:
      new Fader(
	 document
	 .getElementById(
	    "nameLabelTooMany")),

   nameLabel:
      new Fader(
	 document
	 .getElementById(
	    "nameLabel")),

      emailLabel:
      new Fader(
	 document
	 .getElementById(
	    "emailLabel")),

      telLabel:
      new Fader(
	 document
	 .getElementById(
	    "telLabel")),

      messageLabel:
      new Fader(
	 document
	 .getElementById(
	    "messageLabel"))

};

 
var FormValidation =new function(){

   var i,l,
      $nameInput
      =document
      .getElementById(
	 "nameInput"),

      $emailInput
      =SharedData[
	 "$emailInput"],

      $telInput
      =SharedData[
	 "$telInput"],

      $messageTextarea
      =SharedData[
	 "$messageTextarea"],

      $submitBtn
      =SharedData["$submitBtn"],
      
      validNameLen=false,
      validNameEach=false,
      validEmail=false,
      validTel=false,
      validMsg=false;

   var nameVal,
      nameValList=[],
      nameRegex
      =/^[a-zA-Z-]{3,20}$/;
   function readNameData(){
      nameVal 
	 =($nameInput
	 .value)
	 .trim();

      nameValList 
	 =nameVal
	 .split(" ");

      l =nameValList
	 .length;
   }
   function validate_name_len(){

      if(l>3){ 
	 return false; 
      } else {
	 return true;
      }
     
   }
   function validate_name_each(){

      for(i=0;i<l;i++){

	 if(!nameRegex
	    .test(
	       nameValList[i].trim()
	    )){

	    return false;
	 }
      }
      return true;

   }
   var emailVal,
      emailRegex
   =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,25})+$/
   //https://www.w3resource.com/javascript/form/email-validation.php  
   function validate_email(){

      emailVal
      =$emailInput
	 .value;
      console.log(
	 "validate_email(): "
	 +emailVal);

      if(emailRegex.test(emailVal)){
	 console.log(
	    "emailRegex: "
	    + emailRegex.test(emailVal)
	 );
	 return true;

      } else {

	 return false;

	 }
   }
   var telVal,
      telRegex
      =SharedData["telNumRegex"];
   function validate_tel(){

      telVal
      =$telInput
      .value;
      
      if(telRegex.test(telVal)){

	 console.log(
	    "telRegex: "
	    +telRegex.test(telVal)
	 );

	 return true;

      } else {

	 return false;

      }
   }
   var msgVal,
      msgRegex
      =/\w{1,50}/;
   function validate_msg(){
      msgVal
      =$messageTextarea
      .value;

      console.log(
	 "validate_msg(): "
	 + msgVal);

      if(msgRegex.test(msgVal)){

	 return true;

      } else {
	 
	 return false;

      }

   }

   function runAllChecks(){

      readNameData();
      validNameLen = validate_name_len();
      validNameEach = validate_name_each();

      validEmail = validate_email();

      validTel = validate_tel();

      validMsg = validate_msg();
   }

   var validateKeyup=false,
      nameLabelTooManyShown=false,
      nameLabelShown=false,
      emailLabelShown=false,
      telLabelShown=false,
      msgLabelShown=false;
   function keyup_h(){
      runAllChecks();
     
      if(validNameLen && 
	 nameLabelTooManyShown){
	 FadeErrorMsg.nameLabelTooMany.out();
	 nameLabelTooManyShown=false;
      }
      if(validNameEach && 
	 nameLabelShown){
	 FadeErrorMsg.nameLabel.out();
	 nameLabelShown=false;
      }
      if(validEmail &&
	 emailLabelShown){
	 FadeErrorMsg.emailLabel.out();
	 emailLabelShown=false;
	 if(telLabelShown){
	    FadeErrorMsg.telLabel.out();
	 }
      }
      if(validTel &&
	 telLabelShown){
	 FadeErrorMsg.telLabel.out();
	 telLabelShown=false;
	 if(emailLabelShown){
	    FadeErrorMsg.emailLabel.out();
	 }
      }
      if(validMsg &&
	 msgLabelShown){
	 FadeErrorMsg.messageLabel.out();
	 msgLabelShown=false;
      }

      if( validNameLen && validNameEach
	 && (validEmail || validTel)
	 && validMsg ){

	 console.log("validates keyup");

	 validateKeyup=false;

	 document.body
	    .removeEventListener("keyup",
	       keyup_h,false);

      }
   }
   function validation(){
      console.log("validation()");

      if(validateKeyup) return;

      runAllChecks();
      if(!validNameLen){
	 FadeErrorMsg.nameLabelTooMany.in();
	 nameLabelTooManyShown=true;
      } else {
	 if(!validNameEach){
	    FadeErrorMsg.nameLabel.in();
	    nameLabelShown=true;
	 } 
      }
      if(!validEmail && !validTel){
	 FadeErrorMsg.emailLabel.in();
	 emailLabelShown=true;
      }
      if(!validTel && !validEmail){
	 FadeErrorMsg.telLabel.in();
	 telLabelShown=true;
      }
      if(!validMsg){
	 FadeErrorMsg.messageLabel.in();
	 msgLabelShown=true;
      }

      if( validNameLen && validNameEach
	 && (validEmail || validTel)
	 && validMsg ){

	 console.log("validates on submit");

      } else if(!validateKeyup){

	 validateKeyup=true;

	 document.body
	    .addEventListener("keyup",
	       keyup_h,false);
      }


   }

   var busy=false;
   this.click=function(){
      console.log(
	 "FormValidation.click()");

      if(busy) return;

      if(validation()){
	 console.log("validation true");
	 busy=true;
	 T.add(this);
      }

   };

   var processingText, 
      processing_ticks=0,
      processing_ticks_reset=7;
   function resetProcessingText(){
      processingText="processing";
      processing_ticks=0;
   }
   resetProcessingText();

   var processingTextNode;
   function updateProcessingText(){
      processingTextNode
	 =document
	 .createTextNode(
	    processingText); 

      empty($submitBtn);
      $submitBtn
	 .appendChild(
	    processingTextNode);

      processingText +=" .";
      processing_ticks++;
      if(processing_ticks >
	 processing_ticks_reset)
	 resetProcessingText();

   }

   var elapsed=0,
      update_duration=500;
   this.tick=function(t){
      elapsed+=t;
      if(elapsed>update_duration){
	 updateProcessingText();
	 elapsed = 0;
      }

   };

};
var Clicks =new function(){
   var SubmitD=[
      "submitBtn", 
      "submitBtnIcon", 
      "rippleBtnEffectCircle", 
      "submitBtnP" ],
      NavD=[
	 "myNavbarToggleBtn",
	 "myNavbarToggleBtnIcon", 
	 "link_about", 
	 "link_portfolio",
	 "link_contact" ];
   
   var i;
   function click_h(e){
      if(!e) var e = window.event;
      if(e.target.id === "scrollToHome"){
	 SmoothScroller.scrollToTop();
      } else {
	 for(i=0;i<4;i++){
	    if(e.target.id===SubmitD[i]){
	       e.preventDefault();
	       RippleBtnCircleAction
		  .addScaleUpBurst(e);
	       FormValidation.click();
	       return;
	    }
	 }
	 for(i=0;i<5;i++){
	    if(e.target.id===NavD[i]){
	       NavMobile.toggle();
	       return;
	    }
	 }
      }
   }
   document.body
      .addEventListener("click",
	 click_h,false);
};
