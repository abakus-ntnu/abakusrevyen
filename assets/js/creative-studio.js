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

const dict = {
  revySjef: ["dotsRevysjef", "moreRevysjef", "lesMerBtnRevysjef"], 
  nestLed: ["dotsNestled", "moreNestled", "lesMerBtnNestled"], 
  okAns: ["dotsOkans",  "moreOkans", "lesMerBtnOkans"],
  topp: ["dotsTopp", "moreTopp", "lesMerBtnTopp"],
  spm: ["dotsSpm", "moreSpm", "lesMerSpmBtn"],

  band: ["dotsBand", "moreBand", "lesMerBtnBand"],
  dans: ["dotsDans", "moreDans", "lesMerBtnDans"],
  kostyme: ["dotsKostyme", "moreKostyme", "lesMerBtnKostyme"],
  manus: ["dotsManus", "moreManus", "lesMerBtnManus"],
  pr: ["dotsPR", "morePR", "lesMerBtnPR"],
  scene: ["dotsScene", "moreScene", "lesMerBtnScene"],
  skuespill: ["dotsSkuespill", "moreSkuespill", "lesMerBtnSkuespill"],
  sosial: ["dotsSosial", "moreSosial", "lesMerBtnSosial"],
  teknikk: ["dotsTeknikk", "moreTeknikk", "lesMerBtnTeknikk"],
  regissoer: ["dotsRegissoer", "moreRegissoer", "lesMerBtnRegissoer"],
  musRegissoer: ["dotsMusRegissoer", "moreMusRegissoer", "lesMerBtnMusRegissoer"],
  
  regi1: ["dotsRegi1", "moreRegi1", "lesMerBtnRegi1"],
  regi2: ["dotsRegi2", "moreRegi2", "lesMerBtnRegi2"],
  regi3: ["dotsRegi3", "moreRegi3", "lesMerBtnRegi3"]
};

const grupper = Object.keys(dict).slice(5);



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

const getKeyByValue = (val) => {
  return Object.keys(dict).find(key => dict[key].includes(val))
}

function lesMer(id) {
    var buttonPlace = getKeyByValue(id);

    var dots = document.getElementById(dict[buttonPlace][0]);
    var moreText = document.getElementById(dict[buttonPlace][1]);
    var btnText = document.getElementById(dict[buttonPlace][2]);

    if (dots.style.display === "none") {
      if(buttonPlace in grupper  || btnText.innerHTML == "Lukk beskrivelse") {
        btnText.innerHTML = "Les beskrivelse";
      } else {
        btnText.innerHTML = "Les mer";
      }
      dots.style.display = "inline";
      moreText.style.display = "none";
    } else {
      if(buttonPlace in grupper || btnText.innerHTML == "Les beskrivelse") {
        btnText.innerHTML = "Lukk beskrivelse";
      } else {
        btnText.innerHTML = "Les mindre";
      }
      dots.style.display = "none";
      moreText.style.display = "inline";
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    var age = (currentYear - 2018).toString();
    document.getElementById('baby').textContent = '0' + age;
   });
