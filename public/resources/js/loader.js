$(document).ready(function(){

  $(this).scrollTop(0);

  setTimeout(function(){
    $('.loader-box').css('opacity', '0');
  }, 1150);

  setTimeout(function(){
    $('html').css('overflow-y', 'auto');
  }, 1250);

  setTimeout(function(){
    $('.loader-box').css('display', 'none');
  }, 1600);
  
});