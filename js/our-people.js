import {Observable, Subject} from 'rxjs'
import Isotope from 'isotope-layout'
import 'isotope-masonry-horizontal'
import 'gsap'
import _ from 'lodash'

export class OurPeople {
  constructor() {
    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)

    this.section = document.getElementById('ourPeople')
    this.sectionInto = this.section.querySelector('.section-intro')    
    this.slider = document.getElementById('peopleSlider')
    this.sliderInner = this.slider.querySelector('.slider-inner')
    this.walkDirection = 'right'
    this.lastLeft = 0      
    this.tl = new TimelineMax({repeat: -1})
    this.timeScale = 5  

    var chunks = document.querySelectorAll('.grid').forEach(chunk => {
      new Isotope( chunk, {
        itemSelector: '.person',
        layoutMode: 'masonryHorizontal',
        masonryHorizontal: {
          rowHeight: 300
        }
      });
    })

    this.cellWidth = this.slider.querySelector('.cell .grid').offsetWidth
    this.slideWidth = this.cellWidth * 1;

    $('.person.video').on('click', function(e) {
      e.stopPropagation()
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
        $('#ourPeople').removeClass('modal-open');
        modalContent.innerHTML = ''
      })      
    })      

    

    this.tl.add( new TweenMax(this.sliderInner, '5', {
      left: this.cellWidth * -1,
      ease: Linear.easeNone, 
      timeScale: this.timeScale
    }))

    const mouseleave$ = Observable.fromEvent(this.slider, 'mouseleave')
      .subscribe(() => {
        this.tl.timeScale(0.25)
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

        this.tl.timeScale( Math.abs(e.x / 15) )          
      })



    // const run$ = mousemove$
    //   .take(1) 
    //   .switchMap((e) => this.animateToPoint$(e))      
    //   .repeat()

    // const walk$ = (direction) => 
    //   Observable.interval(15).mapTo(direction)

    // walk$('right')
    //   .takeUntil(mousemove$)
    //   .subscribe( (direction) => this.animateSlowly(direction) )    

    // run$
    //   .switchMap( () => walk$().takeUntil(mousemove$) )       
    //   .subscribe(
    //     (direction) => this.animateSlowly(direction), 
    //     this.handleErr, 
    //     () => { console.log('RUN DONE') }
    //   )
  }

  animateSlowly(direction) {
    const step = direction === 'right' ? -1 : 1
    var newLeft = this.lastLeft += step   

    Velocity(this.sliderInner, 'stop')
    Velocity(this.sliderInner, {
      left: this.setNewLeft(newLeft)
    }, {
      duration: 0
    })            
  }

  animateToPoint$(e) {
    return Observable.create(obs => {
        Velocity(this.sliderInner, 'stop')
        Velocity(this.sliderInner, {
          left: e.sliderDest
        }, {
          duration: e.duration,
          complete: () => {
            obs.next(e.direction)
            obs.complete()
          },
          easing: 'easeInSine'
        })
    })
  } 
  
  mouseCoords(e) {
    const xPercent = e.clientX / window.innerWidth * 100
    const x = xPercent >= 50 ? (xPercent - 50) * -1 : 50 - xPercent

    const yPercent = e.clientY / window.innerHeight * 100
    const y = yPercent >= 50 ? (yPercent - 50) * -1 : 50 - yPercent

    const lastLeft = this.lastLeft || 0
    const unfilteredNewLeft = lastLeft + (x * 0.01 * window.innerWidth)

    const newLeft = this.setNewLeft( unfilteredNewLeft ) 
    const isLeftReset = unfilteredNewLeft.toFixed(0) != newLeft.toFixed(0)      
    this.lastLeft = newLeft

    //returns x and y with positive or negative 50 depending on distance from center
    return {
      x: x,
      y: y,
      sliderDest: newLeft,
      direction: newLeft < lastLeft ? 'right' : 'left',
      duration: isLeftReset ? 0 : 1000
    }
  }

  setNewLeft(newLeft) {
    var sliderPosition = ( ( ( newLeft - this.cellWidth ) % this.slideWidth ) + this.slideWidth ) % this.slideWidth;
    var newLeft = sliderPosition += -this.slideWidth + this.cellWidth;    
    return newLeft
  }

  handleErr(err) {
    console.log(err)
  }  
}

