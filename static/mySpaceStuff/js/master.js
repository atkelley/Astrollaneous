var slideIndex = 1;
showSlide(slideIndex);

function nextSlide(n) {
  slideIndex += n;
  showSlide(slideIndex);
}

function showSlide(n) {
  var slides = document.getElementsByClassName("nasa-slides");

  if (n < 1) { slideIndex = slides.length; }
  if (n > slides.length) { slideIndex = 1; }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex - 1].style.display = "block";
} 