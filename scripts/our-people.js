import {app} from './index'
import {Observable, Subject} from 'rxjs'
import Isotope from 'isotope-layout'
import 'isotope-masonry-horizontal'
import 'gsap'
import _ from 'lodash'
import Hammer from 'hammerjs'


export class OurPeople {
  constructor() {
    this.section = document.getElementById('ourPeople')
    this.sectionHeadlines = this.section.querySelector('.section-headlines')
    this.sectionIntro = this.section.querySelector('.section-intro')
    this.slider = document.getElementById('peopleSlider')
    this.sliderInner = this.slider.querySelector('.slider-inner')


    Array.prototype.forEach.call(document.querySelectorAll('.grid'), (chunk) => {
      new Isotope( chunk, {
        itemSelector: '.person',
        layoutMode: 'masonryHorizontal',
      })
    })    

    //set width of parent containing isotope grids in order to float: left
    const sliderInnerWidth = document.querySelector('.cell').offsetWidth * 3
    this.sliderInner.style.width = sliderInnerWidth + 'px'
    this.cellWidth = this.slider.querySelector('.cell').offsetWidth

    this.tl = new TimelineMax({
      repeat: -1,
      smoothChildTiming: true,
      onReverseComplete: () => {
        this.tl.seek('5')
      }
    })

    const tl = this.tl    

    this.tl.add( new TweenMax(this.sliderInner, '5', {
      left: this.cellWidth * -1,
      ease: Linear.easeNone,
      // timeScale: 5
    }))

    this.tl.timeScale(0.05)

    this.hammer = new Hammer(this.slider, {threshold: 10})
    
    this.hammer.on('pan', (e) => {
      const direction = e.velocityX * -1 >= 0 ? 'right' : 'left"'
      this.tl.timeScale(e.velocityX / -2)

      this.timeScaleTween && this.timeScaleTween.kill()
      const settleSpeed = direction === 'right' ? 0.05 : -0.05
      this.timeScaleTween = TweenMax.to(tl, 1.75, {timeScale: settleSpeed})      
    })

    // this.hammer.on('tap', (e) => {
    //   console.log(e)
    // })

    $('#peopleSlider').removeClass('hidden')

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
      
      setTimeout(() => {
        $(this.sectionHeadlines).removeClass('hidden')
      }, 1800)
    }, 750)


    if (Modernizr.touchevents) {
      this.videos = this.slider.querySelectorAll('video')
      this.overlays = this.slider.querySelectorAll('.person.video .overlay')

      Array.prototype.forEach.call(this.overlays, overlay => {
        new Hammer(overlay).on('tap', function(e) {
          this.timeScaleTween && this.timeScaleTween.kill()
          this.timeScaleTween = TweenMax.to(tl, 0.5, {timeScale: 0})

          const video = e.target.parentNode.children[0]          
          video.play()
        })
      })

      Array.prototype.forEach.call(this.videos, vid => {
        vid.addEventListener('webkitendfullscreen', (e) => {
          console.log(e.currentTarget)
          console.log(this)
          e.currentTarget.pause()        
          e.currentTarget.currentTime = 0

          this.timeScaleTween && this.timeScaleTween.kill()
          this.timeScaleTween = TweenMax.to(tl, 1.75, {timeScale: 0.05})          
        })
      })

    } else {
      $('.person.video').on('mouseenter', () => {
        this.timeScaleTween && this.timeScaleTween.kill()
        this.timeScaleTween = TweenMax.to(tl, 1.75, {timeScale: 0})
      })

      $('.person.video').on('mouseleave', () => {
        this.timeScaleTween && this.timeScaleTween.kill()
        this.timeScaleTween = TweenMax.to(tl, 1.75, {timeScale: 0.05})
      })

      $('.hover-area').on('mouseenter', (e) => {      
        const isScrollingForward = e.currentTarget.id === 'hoverRight'
        const isReversed = this.tl.reversed()

        if (isScrollingForward && isReversed) {
          this.tl.reversed(false)
        } else if( !isScrollingForward && !isReversed ) {
          this.tl.reverse()
        }

        this.timeScaleTween && this.timeScaleTween.kill()
        this.timeScaleTween = TweenMax.to(this.tl, 2, {timeScale: 1})
      });

      $('.hover-area').on('mouseleave', () => {
        this.timeScaleTween && this.timeScaleTween.kill()
        this.timeScaleTween = TweenMax.to(this.tl, 1.75, {timeScale: 0.05})
      })

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

        if (window.innerWidth >= 700) {
          $('#ourPeople').one('click', closeVideo)        
        } else {
          $('#closePersonModal').one('click', closeVideo)
        }
      })
    }

    function closeVideo(e) {
      e.stopPropagation();
      const modalContent = personModal.querySelector('.content')
      tl.play()

      $('#ourPeople').removeClass('modal-open');
      $('body').removeClass('people-modal-open')

      modalContent.innerHTML = ''      
    }
  }


  // mouseCoords(e) {
  //   const xPercent = e.clientX / window.innerWidth * 100
  //   const x = xPercent >= 50 ? (xPercent - 50) * -1 : 50 - xPercent

  //   const yPercent = e.clientY / window.innerHeight * 100
  //   const y = yPercent >= 50 ? (yPercent - 50) * -1 : 50 - yPercent

  //   //returns x and y with positive or negative 50 depending on distance from center
  //   return {
  //     x: x,
  //     y: y
  //   }
  // }

  handleErr(err) {
    console.log(err)
  }
}
