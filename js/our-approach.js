import _ from 'lodash'
import {Observable} from 'rxjs'

export class OurApproach {
  constructor() {
    this.section = document.getElementById('ourApproach')
    this.sectionIntro = this.section.querySelector('.section-intro')
    this.canvas = document.getElementById('approachCanvas')
    this.translateStep = 0.5
    this.translateMax = 50
    this.lastX = 0
    this.lastY = 0

    this.random = {
      variance: 3,
      min: 0,
      max: 100,
      step: 100 / $('.program, .project').length,
      xIndex: 0,
      yIndex: 0
    }

    this.xPositions = []
    this.yPositions = []

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
    }, 1200)

    this.positionItems()
    this.handlePanning()
    this.handleHover()
    this.handleClick()    
  }

  handlePanning() {
    const raf$ = Observable.create(obs => {
      (function raf() {
        requestAnimationFrame(function(e) {
          obs.next(e)
          raf()
        })
      })()
    })

    const mousemove$ = Observable
      .fromEvent(window, 'mousemove')
      .map(this.mouseCoords) //returns {x, y}

    const painter$ = raf$ 
      .withLatestFrom(mousemove$)
      .subscribe(v => {
        const mouse = v[1]

        Velocity(this.canvas, 'stop')

        Velocity(this.canvas, {
          translateX: mouse.x + '%',
          translateY: mouse.y + '%'
        }, {
          duration: 150,
          easing: 'easeInSine'
        })        
      })
  }


  handleHover() {
    $('.project').on('mouseenter', function() {      
      const projectTop = parseInt(this.style.top)   //percent
      const projectLeft = parseInt(this.style.left) //percent
      const projectWidth = this.offsetWidth         //px    
      const projectHeight = this.offsetHeight       //px    
      const programEls = $(this).data('programs').map( pId => document.querySelector(`.program[data-id="${pId}"]`) )
      const programPositions = getProgramPositions(projectLeft, projectTop, projectWidth, projectHeight, programEls)

      $('.project').not(this).addClass('sibling-hover')
      $('.program').not(programEls).addClass('sibling-hover')

      programEls.forEach( (el, index) => {
        //save last original position to reset on mouseleave
        el.lastLeft = el.style.left 
        el.lastTop = el.style.top 
        
        //position programs around project        
        el.style.left = programPositions[index].left
        el.style.top = programPositions[index].top
        // el.textContent += programPositions[index].place //for debugging
      })

      $(this).one('mouseleave', function() {
        $('.project').removeClass('sibling-hover')
        $('.program').removeClass('sibling-hover')

        programEls.forEach(el => {
          el.style.left = el.lastLeft
          el.style.top = el.lastTop
        })
      })      
    })

    function getProgramPositions(projectLeft, projectTop, projectWidth, projectHeight, programEls) {
      const position1 = {
        left: `calc(${projectLeft}% + ${projectWidth / 2}px)`,
        top: `calc(${projectTop}% - 15px)`,
        place: 'one, '
      } 

      const position2 = {
        left: `calc(${projectLeft}% + ${projectWidth / 8}px)`,
        top: `calc(${projectTop}% - 50px)`,
        place: 'two, '
      } 

      const position3 = {
        left: `calc(${projectLeft}% - ${20}px)`,
        top: `calc(${projectTop}% - 5px)`,
        place: 'three, '
      } 

      const position4 = {
        left: `calc(${projectLeft}% - ${100}px)`,
        top: `calc(${projectTop}% + 70px)`,
        place: 'four, '
      } 

      const position5 = {
        left: `calc(${projectLeft}% - ${130}px)`,
        top: `calc(${projectTop}% + 150px)`,
        place: 'five, '
      }

      const position6 = {
        left: `calc(${projectLeft}% - ${50}px)`,
        top: `calc(${projectTop}% + ${projectHeight}px)`,
        place: 'six, '
      }

      const position7 = {
        left: `calc(${projectLeft - 5}% - ${0}px)`,
        top: `calc(${projectTop}% + ${projectHeight / 2}px)`,
        place: 'sevem, '
      } 

      const position8 = {
        left: `calc(${projectLeft}% - ${0}px)`,
        top: `calc(${projectTop}% + ${projectHeight + 80}px)`,
        place: 'eight, '
      }

      const position9 = {
        left: `calc(${projectLeft}% + ${projectWidth / 4}px)`,
        top: `calc(${projectTop}% + ${projectHeight}px)`,
        place: 'nine, '
      }

      const position10 = {
        left: `calc(${projectLeft}% + ${projectWidth - 100}px)`,
        top: `calc(${projectTop}% + ${projectHeight - 40}px)`,
        place: 'ten, '
      }

      const positions = [position1, position2, position3, position4, position5, position6, position7, position8, position9, position10] 
      const randomPositions = _.shuffle(positions).slice(0, programEls.length)
      return randomPositions
    }
  }

  handleClick() {
    $('.project').on('click', function(e) {
      e.stopPropagation()
      const modal = document.getElementById('ourApproachModal')
      const modalContent = modal.querySelector('.content')
      const projectImg = this.querySelector('img').getBoundingClientRect()      

      modalContent.querySelector('.title-content').textContent = $(this).data('title')
      modalContent.querySelector('.label-group').textContent = $(this).data('programs').join(', ')
      modalContent.querySelector('blockquote').textContent = $(this).data('blockquote')
      modalContent.querySelector('.text-content').textContent = $(this).data('content')

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

        $.fn.fullpage.setAllowScrolling(true)

        Velocity(modalContent, 'reverse', {
          complete: function() {
            // Velocity(modal, 'reverse')
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


  positionItems() {
   $('.program, .project').each( (index, item) => {
      this.xPositions.push(this.randomX())      
      this.yPositions.push(this.randomY())      
    })

    this.xPositions = _.shuffle(this.xPositions) 
    this.yPositions = _.shuffle(this.yPositions) 

    $('.program, .project').each( (index, item) => {
      $(item).css({
        left: this.xPositions[index],
        top: this.yPositions[index]
      })
    })    

    // console.log(
    //   this.xPositions,
    //   this.yPositions      
    // )    
  }


  randomX() {
    const variance = (Math.random() * this.random.variance) + 1 
    const x = (this.random.xIndex + variance) 

    if (this.random.xIndex < this.random.max) {
      this.random.xIndex += this.random.step
    } else {
      this.random.xIndex = 0
    }    
    
    return x.toFixed(0) + '%'
  }


  randomY() {
    const variance = (Math.random() * this.random.variance) + 1 
    const y = (this.random.yIndex + variance) 

    if (this.random.yIndex < this.random.max) {
      this.random.yIndex += this.random.step
    } else {
      this.random.yIndex = 0
    }    
    
    return y.toFixed(0) + '%'
  }
}


