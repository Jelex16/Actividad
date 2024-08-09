$(document).ready(main);

  let contador = 1;

function main(){
  $('.toggle').click(function(){
    if(contador == 1){
      $('.menu').animate({
        left: '0'
      });
      contador = 0;
    }
    else
    {
      contador = 1;
      $('.menu').animate({
        left: '-100%'
      });
    }
  });
  $('.content').click(function(){
    if(contador == 1){
    } else {
      contador = 1;
      $('.menu').animate({
        left: '-100%'
      });
      toggle.classList.toggle("active");
    };
  });
  $('.content-footer').click(function(){
    if(contador == 1){
    } else {
      contador = 1;
      $('.menu').animate({
        left: '-100%'
      });
      toggle.classList.toggle("active");
    };
  });
}

const toggle = document.getElementById("toggle");

toggle.addEventListener("click", ()=>{
    toggle.classList.toggle("active");
})

