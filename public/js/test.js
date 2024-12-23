let prev = document.getElementById("Hprev");
let next = document.getElementById("Hnext");

prev.addEventListener("click", prevImg);
next.addEventListener("click", nextImg);


let second = document.getElementById('Hsecond');

function prevImg() {
    second.style.msTransform = "rotateY(0deg)";
    second.style.webkitTransform = "rotateY(0deg)";
    second.style.transform = "rotateY(0deg)";
    document.getElementById('body').style.backgroundImage="url(/homeImgs/12.jpg)"
    document.querySelector('.menu-bar').style.backgroundColor= "#B8B394";
    var k1=document.querySelectorAll('.k1');
    for(let i=0;i<k1.length;i++)
    {
        k1[i].style.backgroundColor= "#B8B394";
    }
    document.querySelector('.dropdown-menu ').style.background= "#B8B394e3";
    document.querySelector('.userLogedin ').style.color= "#8e5043e3";
    document.querySelector('.text').innerText=
    'save your memories and all your important things in the safest place..this will be the favourite website...'
}
function nextImg() {
    second.style.msTransform = "rotateY(-180deg)";
    second.style.webkitTransform = "rotateY(-180deg)";
    second.style.transform = "rotateY(-180deg)";
    document.getElementById('body').style.backgroundImage="url(/homeImgs/13.jpg)"
    document.querySelector('.menu-bar').style.backgroundColor= "#89483A";
    var k1=document.querySelectorAll('.k1');
    for(let i=0;i<k1.length;i++)
    {
        k1[i].style.backgroundColor= "#89483A";
    }
    document.querySelector('.dropdown-menu ').style.background= "#8e5043e3";
    var kk=document.querySelectorAll('.aNav');
    for(let i=0;i<kk.length;i++)
    {
        kk[i].style.color= "white";
    }
    document.querySelector('.text').innerText=
    'find your ancestors and save your family tree..look for all the important events which happen..'
    document.querySelector('.userLogedin ').style.color= "white";
}