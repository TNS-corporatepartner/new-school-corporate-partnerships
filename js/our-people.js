import {Observable, Subject} from 'rxjs'
import Isotope from 'isotope-layout'
import 'isotope-masonry-horizontal'
import 'gsap'
import _ from 'lodash'

export class OurPeople {
  constructor() {
    this.section = document.getElementById('ourPeople')
    this.sectionInto = this.section.querySelector('.section-intro')

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)

    this.slider = document.getElementById('peopleSlider')
    this.sliderInner = this.slider.querySelector('.slider-inner')
    this.walkDirection = 'right'
    this.lastLeft = 0
    this.tl = new TimelineMax({
      repeat: -1,
      smoothChildTiming: true,
      onReverseComplete: () => {
        this.tl.seek('5')
      }
    })
    this.timeScale = 5

    document.querySelectorAll('.grid').forEach(chunk => {
      new Isotope( chunk, {
        itemSelector: '.person',
        layoutMode: 'masonryHorizontal',

      })
    })

    //set width of parent containing isotope grids in order to float: left
    const sliderInnerWidth = document.querySelector('.cell').offsetWidth * 3
    this.sliderInner.style.width = sliderInnerWidth + 'px'
    this.cellWidth = this.slider.querySelector('.cell').offsetWidth

    const tl = this.tl

    $('.person.video').on('click', function(e) {
      e.stopPropagation()

      tl.timeScale(0)

      const personModal = document.getElementById('personModal')
      const modalContent = personModal.querySelector('.content')
      const videoSrc = $(this).data('src');
      const video = $('<video />')

      video.attr('src', videoSrc)
      video.attr('autoplay', true)

      $('#ourPeople').addClass('modal-open');
      $(modalContent).append(video)

      $('#ourPeople').one('click', (e) => {
        e.stopPropagation()

        tl.timeScale(0.45)

        $('#ourPeople').removeClass('modal-open');
        modalContent.innerHTML = ''
      })
    })

    $('.person.video').on('mouseenter', () => {
      this.tl.timeScale(0.09)

    })

    $('.person.video').on('mouseleave', () => {
      console.log('leave');
      this.tl.timeScale(0.45)
    })


    this.tl.add( new TweenMax(this.sliderInner, '5', {
      left: this.cellWidth * -1,
      ease: Linear.easeNone,
      timeScale: this.timeScale
    }))

    this.tl.timeScale(0.45)

    const mouseleave$ = Observable.fromEvent(this.slider, 'mouseleave')
      .subscribe(() => {
        this.tl.timeScale(0.45)
      })



    const mousemove$ = Observable.fromEvent(this.slider, 'mousemove')
      .map(e => this.mouseCoords(e))
      .repeat()
      .subscribe(e => {
        if ( e.x < 0 && this.tl.reversed() ) {
          this.tl.reversed(false)
        } else if ( e.x > 0 && !this.tl.reversed() ) {
          this.tl.reversed(true)
        }

        //this.tl.timeScale( Math.abs(e.x / 50) )
      })
  }


  mouseCoords(e) {
    const xPercent = e.clientX / window.innerWidth * 100
    const x = xPercent >= 50 ? (xPercent - 50) * -1 : 50 - xPercent

    const yPercent = e.clientY / window.innerHeight * 100
    const y = yPercent >= 50 ? (yPercent - 50) * -1 : 50 - yPercent

    //returns x and y with positive or negative 50 depending on distance from center
    return {
      x: x,
      y: y
    }
  }

  handleErr(err) {
    console.log(err)
  }
}
