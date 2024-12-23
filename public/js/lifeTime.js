function Ltoggle(){
    var blur=document.getElementById('blur');
    blur.classList.toggle('Lactive');
    var Lpopup=document.getElementById('Lpopup');
    Lpopup.classList.toggle('Lactive');
    var body=document.getElementById('body');
    body.classList.toggle('Lactive');
}


var m=-1;
var tt=document.querySelectorAll('.Lbcir');

for (let i = 0; i < tt.length; i++) {

    tt[i].addEventListener("click",function(){
        var tt=document.querySelectorAll('.Lbcir');
        var s=document.querySelectorAll('.Lform');
        var x=document.querySelectorAll('.Lspace');
        var z=document.querySelector('.Lall');
        if(m!=-1)
        {
            s[m].style.display="none";
            tt[m].style.transform="scale(1)";
        }
        
        s[i].style.display="block";
        tt[i].style.transform="scale(1.5)";
        z.style.left="31%";
        m=i;

},false);
}  
