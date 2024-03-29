/*!
=========================================================
* Creative Studio Landing page
=========================================================

* Copyright: 2019 DevCRUD (https://devcrud.com)
* Licensed: (https://devcrud.com/licenses)
* Coded by www.devcrud.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/ 

// smooth scroll 
$(document).ready(function(){
    $(".navbar .nav-link").on('click', function(event) {

        if (this.hash !== "") {

            event.preventDefault();

            var hash = this.hash;

            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 700, function(){
                window.location.hash = hash;
            });
        } 
    });
}); 

function lesMer() {
    var dots = document.getElementById("dots");
    var moreText = document.getElementById("more");
    var btnText = document.getElementById("lesMerBtn");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Les mer";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Les mindre";
      moreText.style.display = "inline";
    }
  }

function lesMerRevysjef() {
  var dots = document.getElementById("dotsRevysjef");
  var moreText = document.getElementById("moreRevysjef");
  var btnText = document.getElementById("lesMerBtnRevysjef");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Les mer";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Les mindre";
    moreText.style.display = "inline";
  }
}

function lesMerNestled() {
    var dots = document.getElementById("dotsNestled");
    var moreText = document.getElementById("moreNestled");
    var btnText = document.getElementById("lesMerBtnNestled");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Les mer";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Les mindre";
      moreText.style.display = "inline";
    }
  }

function lesMerOkans() {
    var dots = document.getElementById("dotsOkans");
    var moreText = document.getElementById("moreOkans");
    var btnText = document.getElementById("lesMerBtnOkans");
  
    if (dots.style.display === "none") {
      dots.style.display = "inline";
      btnText.innerHTML = "Les mer";
      moreText.style.display = "none";
    } else {
      dots.style.display = "none";
      btnText.innerHTML = "Les mindre";
      moreText.style.display = "inline";
    }
  }

function lesMerTopp() {
  var dots = document.getElementById("dotsTopp");
  var moreText = document.getElementById("moreTopp");
  var btnText = document.getElementById("lesMerBtnTopp");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Les mer";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Les mindre";
    moreText.style.display = "inline";
  }
}

  document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    var age = (currentYear - 2018).toString();
    document.getElementById('baby').textContent = '0' + age;
   });
