import Flickity from 'flickity'

export class ContactUs {
  constructor() {
    this.asideSlider = document.getElementById('asideSlider')
    this.slidesUl = this.asideSlider.querySelector('ul')
    this.slides = this.asideSlider.querySelectorAll('li')

    var flkty = new Flickity( '#contactSlider', {
      autoPlay: true
    });

    console.log('test')

    $('#contactUs .content').on('mouseenter', function() {
      $(this).addClass('show-invisible')
    })

    $('#contactUs .content').on('mouseleave', function() {
      $(this).removeClass('show-invisible')
    })
  }

  sleep() {
    this.isSleeping = true
  }

  awake() {
    this.isSleeping = false
    this.asideSlider = document.getElementById('asideSlider')
    this.slides = this.asideSlider.querySelectorAll('li')
    this.animateSlide(this.slides.length - 1)
  }
}