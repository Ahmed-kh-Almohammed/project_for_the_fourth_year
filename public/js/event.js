function toggle(){
 let ec=document.querySelector('.ad');
 let ce= document.querySelector('.vd');
 let blur=document.querySelector('#blur');
 let popup=document.querySelector('#popup');
 let body=document.querySelector('#body');

 blur.classList.toggle('active');
  
 
  
  popup.classList.toggle('active');
  
 
 
  body.classList.toggle('active');
  
    

 ec.addEventListener("click",function(){
  ce.style.display='grid';
 
 
 
 
 
    
 });}

 function toggle5(){
   var blur=document.getElementById('blur');
   blur.classList.toggle('active');
 
   var popup5=document.getElementById('popup5');
   popup5.classList.toggle('active');
 
   var body=document.getElementById('body');
   body.classList.toggle('active');
 }
 function toggle6(){
   var blur=document.getElementById('blur');
   blur.classList.toggle('active');
 
   var popup6=document.getElementById('popup6');
   popup6.classList.toggle('active');
 
   var body=document.getElementById('body');
   body.classList.toggle('active');
 }
 function toggle4(){
   var ul=document.querySelector('.ul');
   var toggle=document.querySelector('.toggle');
   var dropdown=document.querySelector('.dropdown-menu');
   var menu=document.querySelector('.menu-bar');
   
      ul.classList.toggle("active");
      dropdown.classList.toggle("active");
      menu.classList.toggle("active");
 }
 function toggle7(){
   var blur=document.getElementById('blur');
   blur.classList.toggle('active');
   var popup7=document.getElementById('popup7');
   popup7.classList.toggle('active');
   var body=document.getElementById('body');
   body.classList.toggle('active');
 }
    