import {Observable, Subject} from 'rxjs'
import Isotope from 'isotope-layout'
import 'isotope-masonry-horizontal'
import 'gsap'
import _ from 'lodash'

export class OurPeople {
  constructor() {
    this.section = document.getElementById('ourPeople')
    this.sectionHeadlines = this.section.querySelector('.section-headlines')
    this.sectionInto = this.section.querySelector('.section-intro')

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
      
      setTimeout(() => {
        $(this.sectionHeadlines).removeClass('hidden')
      }, 1800)      
    }, 750)

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

      tl.pause()

      const personModal = document.getElementById('personModal')
      const modalContent = personModal.querySelector('.content')
      const videoSrc = `https://player.vimeo.com/video/${$(this).data('src')}?autoplay=1&color=e82e21&title=0&byline=0&portrait=0`;
      const video = $('<iframe frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>')

      video.attr('src', videoSrc)
      video.attr('autoplay', true)

      $('#ourPeople').addClass('modal-open');
      $('body').addClass('people-modal-open')

      $(modalContent).append(video)

      $('#ourPeople').one('click', (e) => {
        e.stopPropagation();
        tl.play()

        $('#ourPeople').removeClass('modal-open');
        $('body').removeClass('people-modal-open')

        modalContent.innerHTML = ''
      })
    })
    let stopTween
    
    $('.person.video').on('mouseenter', () => {
      this.tl.timeScale(0.09)
      stopTween = TweenMax.to(tl, 3, {timeScale:0})
    })

    $('.person.video').on('mouseleave', () => {
      stopTween.kill()
      this.tl.timeScale(0.05)
    })

    $('.hover-area').on('mouseenter', () => {
      this.tl.timeScale(1)
    });

    $('.hover-area').on('mouseleave', () => {
      this.tl.timeScale(0.05)
    })


    this.tl.add( new TweenMax(this.sliderInner, '5', {
      left: this.cellWidth * -1,
      ease: Linear.easeNone,
      timeScale: this.timeScale
    }))

    this.tl.timeScale(0.05)

    // const mouseleave$ = Observable.fromEvent(this.slider, 'mouseleave')
    //   .subscribe(() => {
    //     this.tl.timeScale(0.05)
    //   })


    const mousemove$ = Observable.fromEvent(this.slider, 'mousemove')
      .map(e => this.mouseCoords(e))
      .repeat()
      .subscribe(e => {
        if ( e.x < 0 && this.tl.reversed() ) {
          this.tl.reversed(false)
        } else if ( e.x > 0 && !this.tl.reversed() ) {
          this.tl.reversed(true)
        }

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
