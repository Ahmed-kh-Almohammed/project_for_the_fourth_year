
function toggle(){
    var blur=document.getElementById('blur');
    blur.classList.toggle('active');

    var popup=document.getElementById('popup');
    popup.classList.toggle('active');

    var body=document.getElementById('body');
    body.classList.toggle('active');
}
 function toggle2(id){
    var blur=document.getElementById('blur');
    blur.classList.toggle('active');
    var popup2=document.getElementById('popup2');
    popup2.classList.toggle('active');

    var body=document.getElementById('body');
    body.classList.toggle('active');
    var rr=document.querySelector('#formUpdate').action="/memories/"+id;
    
}
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



/*! Elastic Slider (c) 2014 // Taron Mehrabyan // Ruben Sargsyan
let t=document.querySelector('.bcir');
let s=document.querySelector('.all');
let x=document.querySelector('.space');
if(t){
t.addEventListener("click",function(){
    s.style.display="block";
    
      x.style.left="35%"
});}

 */

var swiper = new Swiper(".mySwiper", {
    effect: "cards",
    grabCursor: true,
  });
  
