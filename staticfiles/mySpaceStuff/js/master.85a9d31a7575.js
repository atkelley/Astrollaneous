var slideIndex = 1;
showSlide(slideIndex);

function nextSlide(n) {
  slideIndex += n;
  showSlide(slideIndex);
}

function showSlide(n) {
  var slides = document.getElementsByClassName("nasa-slides");

  if (slides.length != 0) {
    if (n < 1) { slideIndex = slides.length; }
    if (n > slides.length) { slideIndex = 1; }
  
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
  
    slides[slideIndex - 1].style.display = "block";
  }
} 

function openTab(evt, tabName) {
  var tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
  truncateText();
}

function truncateText() {
  $('.nasa-description-container').each(function () {
    var maxheight = 100;
    var text = $(this);
  
    if (text.height() > maxheight){
      text.css({ 'overflow': 'hidden','height': maxheight + 'px' });
  
      var link = $('<a href="#">Show More</a>');
      var linkDiv = $('<div></div>');
      linkDiv.append(link);
      $(this).after(linkDiv);
  
      link.click(function (event) {
        event.preventDefault();
  
        if (text.height() > maxheight) {
            $(this).html("Show More");
            text.css('height', maxheight + 'px');
        } else {
            $(this).html("Show Less");
            text.css('height', 'auto');
        }
      });
    }
  });
}

$(document).ready(function() {
  $('#nasa-submit').on('click', function() {   
    if ($('.nasa-search-input').val()) {
      $('.nasa-main-content').css('display', 'none');
      $('#loader-container').css('display', 'block');
    }
  });
});




var sPath = window.location.pathname;
if(sPath == "/satellites/"){
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NjY4YmUzMC1jMTViLTRlMDQtYTVjYy1iNjM3ZGJmMjY5YzkiLCJpZCI6MjkyNzksInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1OTE4OTEwMjJ9.MFPIy6lQ2Q7TeTvlXSIGU37XseGxBb8Xl84taslmIms';
  var viewer = new Cesium.Viewer("cesiumContainer", {
    shouldAnimate: true,
  });

  viewer.dataSources.add(
    Cesium.CzmlDataSource.load('/static/mySpaceStuff/js/simple.czml')
    // Cesium.CzmlDataSource.load('/static/mySpaceStuff/tle_active.czml')
  );
  
  
  // for (i of viewer.dataSources) {
  //   if (i == '_dataSources') {
  //     console.log('hi');
  //   }
  // }
  
  //.entityCollection._entities[4]._description
  
  // Sandcastle.addDefaultToolbarButton("Satellites", function () {
    // viewer.dataSources.add(
    //   Cesium.CzmlDataSource.load("../SampleData/simple.czml")
    // );
  
  //   viewer.camera.flyHome(0);
  // });
}








