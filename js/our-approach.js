import _ from 'lodash'
import {Observable} from 'rxjs'
import Isotope from 'isotope-layout'
import 'gsap'

export class OurApproach {
  constructor() {
    this.section = document.getElementById('ourApproach')
    this.sectionIntro = this.section.querySelector('.section-intro')
    this.canvas = document.getElementById('approachCanvas')
    this.sliderInner = document.querySelector('.approach-slider-inner')
    this.grids = document.querySelectorAll('.approach-grid')    

    this.random = {
      variance: 3,
      min: 0,
      max: 100,
      step: 100 / $('.program, .project').length,
      xIndex: 0,
      yIndex: 0
    }

    this.tl = new TimelineMax({
      repeat: -1,
      smoothChildTiming: true,
      onReverseComplete: () => {
        this.tl.seek('5')
      }
    })    

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
    }, 1600)

    this.positionItems()
    // this.handlePanning()
    this.handleHover()
    this.handleClick()    
  }

  positionItems() {
    //generate random padding from programs in first grid
    var randomPadding = Array.prototype.map.call(document.querySelector('.approach-grid').querySelectorAll('.program'), program => {
      return {
        paddingTop: (Math.random() * 50) + 1,        
        paddingRight: (Math.random() * 50) + 1,
        paddingLeft: (Math.random() * 50) + 1,
        paddingBottom: (Math.random() * 50) + 1,
      }
    })

    //apply same randomized padding to programs in each grid
    this.grids.forEach(grid => {
      grid.querySelectorAll('.program').forEach( (program, index) => {
        $(program).css(randomPadding[index])
      })
    })

    //initalize three identical packery grids
    this.grids.forEach(grid => {
      new Packery(grid, {
        itemSelector: '.program',
        isHorizontal: true,
        stamp: '.project',
      })
    })

    //set width of parent containing isotope grids in order to float: left
    const sliderInnerWidth = document.querySelector('.approach-grid').offsetWidth * 3    
    this.cellWidth = document.querySelector('.approach-grid').offsetWidth
    this.sliderInner.style.width = sliderInnerWidth + 'px'
    this.grids.forEach(grid => grid.style.left = this.cellWidth * -1 + 'px')
  }


  handlePanning() {
    Observable.fromEvent(this.sliderInner, 'mouseleave')
      .subscribe(() => {
        this.tl.timeScale(0.15)
      })

    Observable.fromEvent(this.sliderInner, 'mousemove')
      .map(e => this.mouseCoords(e))
      .repeat()
      .subscribe(e => {  
        if ( e.x < 0 && this.tl.reversed() ) {
          this.tl.reversed(false)
        } else if ( e.x > 0 && !this.tl.reversed() ) {
          this.tl.reversed(true)
        }

        this.tl.timeScale( Math.abs(e.x / 25) )          
      })

    this.tl.add( new TweenMax(this.sliderInner, '5', {
      left: this.cellWidth * -1,
      ease: Linear.easeNone, 
      timeScale: 5
    }))

    this.tl.timeScale(0.15)

    // this.raf$.withLatestFrom(this.mousemove$)
    // .subscribe(v => {
    //   const mouse = v[1]
    //   this.canvas.style.transform = `perspective(3000px) translate3d(${mouse.x}%, 0%, 0) rotateX(${0}deg) rotateY(${mouse.rotateY}deg) scale(0.9)`
    // })
  }


  handleHover() {
    const sliderInner = this.sliderInner
    const cellWidth = this.cellWidth
    
    $('.project').on('mouseenter', function() {
      const bounds = this.getBoundingClientRect() 
      const parent = this.offsetParent.getBoundingClientRect()
      const projectLeft = bounds.left + 25 //25 paddingLeft
      const projectTop = bounds.top - parent.top + 15 //15 paddingTop
      const projectBottom = bounds.bottom - bounds.height + 15 //15 paddingTop
      const projectWidth = this.offsetWidth         //px
      const projectHeight = this.offsetHeight       //px
      const programEls = $(this).data('programs')
        .split(',')
        .map( pId => {
          return this.offsetParent.querySelector(`.program[data-id="${pId}"]`)
        })
        .filter(p => p)

      const programPositions = getProgramPositions(projectTop, projectBottom, projectLeft, projectWidth, projectHeight, programEls)
    
      $('.project').not(this).addClass('sibling-hover')
      $('.program').not(programEls).addClass('sibling-hover')

      programEls.forEach( (el, index) => {
        $(el).addClass('hover')

        //save last original position to reset on mouseleave
        el.lastLeft = el.style.left
        el.lastTop = el.style.top

        //position programs around project        
        el.style.left = programPositions[index].left - el.offsetWidth + Math.abs(sliderInner.offsetLeft) + 'px'
        el.style.top = programPositions[index].top - el.offsetHeight + 'px'
        // el.textContent = el.textContent.slice(0, -2) + programPositions[index].place //for debugging
      })

      $(this).one('mouseleave', function() {
        $('.project').removeClass('sibling-hover')
        $('.program').removeClass('sibling-hover')

        programEls.forEach(el => {
          $(el).removeClass('hover')
          el.style.left = el.lastLeft
          el.style.top = el.lastTop
          el.style.transform = el.lastTransform
        })
      })
    })

    function getProgramPositions(top, bottom, left, width, height, programEls) {
      const position1 = {
        left: left + width + 200,
        top: top,
        place: '01'
      }

      const position2 = {
        left: left + width / 1.5,
        top: top - 75,     
        place: '02'
      }

      const position3 = {
        left: left + 25,
        top: top - 75,             
        place: '03'
      }

      const position4 = {
        left: left - 25,
        top: top + 25,
        place: '04'
      }

      const position5 = {
        left: left,
        top: top + 150,        
        place: '05'
      }

      const position6 = {
        left: left,
        top: top + height + 30,        
        place: '06'
      }

      const position7 = {
        left: left + 100,
        top: top + height + 100,
        place: '07'
      }

      const position8 = {
        left: left + 300, //300 program width
        top: top + height + 50,
        place: '08'
      }

      const position9 = {
        left: left + width,
        top: top + height + 100,
        place: '09'
      }

      const position10 = {
        left: left + width + 150,
        top: top + height,  
        place: '10'
      }

      // const positions = [position1, position1, position1, position1, position1, position1, position1, position1, position1, position1]
      const positions = [position1, position2, position3, position4, position5, position6, position7, position8, position9, position10]
      const randomPositions = _.shuffle(positions).slice(0, programEls.length)
      return randomPositions
    }
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


  handleClick() {
    const tl = this.tl

    $('.project').on('click', function(e) {      
      e.stopPropagation()
      tl.timeScale(0)

      const modal = document.getElementById('ourApproachModal')
      const modalContent = modal.querySelector('.content')
      const projectImg = this.querySelector('.project-image').getBoundingClientRect()

      modalContent.querySelector('.title-content').textContent = $(this).data('title')
      modalContent.querySelector('.label-group').textContent = $(this).data('programs').replace(/-/g, ' ').split(',').join(', ')
      modalContent.querySelector('blockquote').textContent = $(this).data('blockquote')
      modalContent.querySelector('.text-content').innerHTML = $(this).data('content')

      modal.querySelector('img').src = '/images/music.jpg'
      $.fn.fullpage.setAllowScrolling(false)

      Velocity(modal, {
        left: projectImg.left,
        top: projectImg.top,
        width: projectImg.width,
        height: projectImg.height,
        opacity: 1,
        scale: 1
      }, {
        duration: 0,
        display: 'block',
        complete: function() {
          Velocity(modal, {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }, {
            duration: 400,
            complete: function() {
              Velocity(modalContent, {
                opacity: 1
              }, {
                display: 'flex'
              })
            }
          })
        }
      })


      $(modal).one('click', function(e) {
        e.stopPropagation()

        tl.timeScale(0.1)

        $.fn.fullpage.setAllowScrolling(true)

        Velocity(modalContent, 'reverse', {
          complete: function() {
            Velocity(modal, {
              opacity: 0,
              scale: 0.5
            }, {
              display: 'none',
              duration: 400
            })
          }
        })
      })
    })
  }
}