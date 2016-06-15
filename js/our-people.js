import {Observable} from 'rxjs'
import Flickity from 'flickity'

export class OurPeople {
  constructor() {
    this.section = document.getElementById('ourPeople')
    this.sectionInto = this.section.querySelector('.section-intro')
    const slider = document.getElementById('peopleSlider')
    const moving = Observable.fromEvent(slider, 'mousemove')
    this.center = slider.scrollWidth / 2 - window.innerWidth
    this.personModal = document.getElementById('personModal')
    this.modalContent = this.personModal.querySelector('.content')
    // slider.scrollLeft = this.center

    $('.slider-cell').each(function(i, el) {
      console.log(el)
      // el.parentNode
    })

    var flkty = new Flickity('#peopleSlider', {
      wrapAround: true,
      // cellAlign: 'left',
      freeScroll: true,
      percentPosition: false,
      // autoPlay: 8000,
      selectedAttraction: 0.0001,
      friction: 0.15
    })

    

    setTimeout(() => {
      //wait for flickity to initialize
      $(slider).removeClass('out')
      this.flktySliderEl = slider.querySelector('.flickity-slider')
      flkty.next()
    }, 1200)


    $('.person.video').on('click', function() {
      const personModal = document.getElementById('personModal')
      const modalContent = personModal.querySelector('.content')
      const videoSrc = $(this).data('src');

      const video = $('<video />')
      video.attr('src', videoSrc)
      video.attr('autoplay', true)
      
      $('#ourPeople').addClass('modal-open');
      // $(personModal).addClass('active')
      $(modalContent).append(video)
    })

    $('#closePersonModal').on('click', () => {
      // $(this.personModal).removeClass('active')
      $('#ourPeople').removeClass('modal-open');

      this.modalContent.innerHTML = ''
    })

    let x = 0

    const movingRight = moving
      .filter(e => e.clientX > window.innerWidth / 2)
      .subscribe(e => {
        if (window.lastX !== e.clientX || window.lastY !== e.clientY){
          const velocity = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) / 2
          const pos = e.clientX - window.innerWidth / 2

          // this.flktySliderEl.style.transform = 'translateX(' + (x += 5) + '%)'
          // slider.scrollLeft = slider.scrollLeft + pos * velocity
        }


        window.lastX = e.clientX
        window.lastY = e.clientY
      })

    const movingLeft = moving
      .filter(e => e.clientX < window.innerWidth / 2)
      .subscribe(e => {
        if (window.lastX !== e.clientX || window.lastY !== e.clientY){
          const velocity = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)  / 2
          const pos = window.innerWidth / 2 - e.clientX

          // this.flktySliderEl.style.transform = 'translateX(' + (x -= 5) + '%)'
          // slider.scrollLeft = slider.scrollLeft + pos * velocity
        }

        window.lastX = e.clientX
        window.lastY = e.clientY
      })

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)
  }
}
