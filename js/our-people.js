import {Observable} from 'rxjs'
import Isotope from 'isotope-layout'
import 'isotope-masonry-horizontal'

export class OurPeople {
  constructor() {
    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)

    this.section = document.getElementById('ourPeople')
    this.sectionInto = this.section.querySelector('.section-intro')    
    this.slider = document.getElementById('peopleSlider')
    this.lastDirection = 'right'        

    var chunks = document.querySelectorAll('.grid').forEach(chunk => {
      new Isotope( chunk, {
        itemSelector: '.person',
        layoutMode: 'masonryHorizontal',
        masonryHorizontal: {
          rowHeight: 300
        }
      });
    })

    this.sliderX = 0
    this.cellWidth = this.slider.querySelector('.cell .grid').offsetWidth
    this.slideWidth = this.cellWidth * 1;

    const mousing$ = Observable.fromEvent(this.slider, 'mousemove')

    const mousingRight = mousing$
      .filter(e => e.clientX > window.innerWidth / 2)

    const mousingLeft = mousing$
      .filter(e => e.clientX < window.innerWidth / 2)

  
    var test = this.section.querySelector('.section-headlines')

    const exit$ = Observable.fromEvent(test, 'mouseleave').subscribe(() => {
      this.slideX = 3
    })
  
    Observable.interval(15)
      
      // .takeUntil(exit$)

      .withLatestFrom( 
        Observable.merge(
          mousingLeft.map(e => ({ e: e, direction: 'left'})), 
          mousingRight.map(e => ({ e: e, direction: 'right'}))
        )
      )

      .map(e => { 
        return { 
          e: e[1].e, 
          direction: e[1].direction
        }
      })
      
      // .repeat()

      .subscribe(event => {
        const e = event.e    
        this.lastDirection = event.direction
        
        //calculates a number between 0 and 1 based on mouse position
        // const velocity = event.direction === 'right' ? 
        //   (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) : 
        //   (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * -1         

        // const sliderX = event.direction === 'right' ? this.sliderX - velocity * 10 : this.sliderX + velocity * 10
        // this.sliderX = sliderX
        
        this.sliderX += this.mouseCoords(e).x / 5
        var sliderPosition = ( ( ( this.sliderX - this.cellWidth ) % this.slideWidth ) + this.slideWidth ) % this.slideWidth;
        sliderPosition += -this.slideWidth + this.cellWidth;        
        this.slider.style.left = sliderPosition + 'px';
        
        // Velocity(this.slider, 'stop')
        // Velocity(this.slider, {
        //   left: sliderPosition + 'px'
        // }, {
        //   duration: 1000,
        //   easing: 'easeInSine'
        // })        

      }, err => console.error(err), () => {
        console.log('done')
        this.sliderX = 0
      }
      )

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
  }

  mouseCoords(e) {
    const xPercent = e.clientX / window.innerWidth * 100
    const x = xPercent >= 50 ? (xPercent - 50) * -1 : 50 - xPercent

    const yPercent = e.clientY / window.innerHeight * 100
    const y = yPercent >= 50 ? (yPercent - 50) * -1 : 50 - yPercent

    return {
      x: x,
      y: y
    }
  }

  scrollAmbiently() {
    const currSliderX = parseInt(this.slider.style.left || 0) 
    const sliderX = this.lastDirection === 'right' ? currSliderX - 2 : currSliderX + 2 
    this.updateSliderPosition(sliderX)
  }

  scrollOnMouseMove(event) {
    const e = event.e    
    this.lastDirection = event.direction
    
    const velocity = event.direction === 'right' ? 
      (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) : 
      (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * -1 

    const sliderX = event.direction === 'right' ? this.sliderX - velocity * 40 : this.sliderX + velocity * 40 
    this.updateSliderPosition(sliderX)
  }

  updateSliderPosition(sliderX) {
    this.sliderX = sliderX

    var sliderPosition = ( ( ( this.sliderX - this.cellWidth ) % this.slideWidth ) + this.slideWidth ) % this.slideWidth;
    sliderPosition += -this.slideWidth + this.cellWidth;        
    // this.slider.style.left = sliderPosition + 'px';
    
    console.log(sliderPosition.toFixed(0) + 'px')

    Velocity(this.slider, 'stop')
    Velocity(this.slider, {
      left: sliderPosition.toFixed(0) + 'px'
    }, {
      duration: 1000,
      easing: 'easeInSine'
    })    
        
  }  
}

