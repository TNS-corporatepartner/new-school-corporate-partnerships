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

    this.painter$;

    this.raf$ = Observable.create(obs => {
      (function raf() {
        requestAnimationFrame(function(e) {
          obs.next(e)
          raf()
        })
      })()
    });

    this.mousemove$ = Observable
      .fromEvent(this.section, 'mousemove')
      .map(this.mouseCoords) //returns {x, y}


    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
    }, 1600)

    this.positionItems()
    this.handlePanning()
    this.handleHover()
    this.handleClick()
  }


  handlePanning() {
    const painter$ =
      this.raf$.withLatestFrom(this.mousemove$)
      .subscribe(v => {
        const mouse = v[1]
        this.canvas.style.transform = `perspective(3000px) translate3d(${mouse.x}%, ${mouse.y}%, 0) rotateX(${0}deg) rotateY(${mouse.rotateY}deg) scale(0.9)`
      })
  }


  handleHover() {
    $('.project').on('mouseenter', function() {
      const projectLeft = parseInt($(this).css('left')) / parseInt($(this).parent().css('width')) * 100
      const projectTop = parseInt($(this).css('top'))
      const projectWidth = this.offsetWidth         //px
      const projectHeight = this.offsetHeight       //px
      const programEls = $(this).data('programs')
        .split(',')
        .map( pId => document.querySelector(`.program[data-id="${pId}"]`) )
        .filter(p => p)

      const programPositions = getProgramPositions(projectLeft, projectTop, projectWidth, projectHeight, programEls)

      $('.project').not(this).addClass('sibling-hover')
      $('.program').not(programEls).addClass('sibling-hover')

      programEls.forEach( (el, index) => {
        $(el).addClass('hover')

        //save last original position to reset on mouseleave
        el.lastTransform = el.style.transform
        el.lastLeft = el.style.left
        el.lastTop = el.style.top

        //position programs around project
        el.style.transform = 'translate3d(0px, 0px, 0)'
        el.style.left = programPositions[index].left
        el.style.top = programPositions[index].top
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

    function getProgramPositions(projectLeft, projectTop, projectWidth, projectHeight, programEls) {
      const position1 = {
        left: `calc(${projectLeft}% + ${projectWidth - 100}px)`,
        top: `${projectTop - 25}px`,
        place: '01'
      }

      const position2 = {
        left: `calc(${projectLeft}% + ${projectWidth - 250}px)`,
        top: `${projectTop - 40}px`,
        place: '02'
      }

      const position3 = {
        left: `calc(${projectLeft}% + ${projectWidth - 500}px)`,
        top: `${projectTop - 60}px`,
        place: '03'
      }

      const position4 = {
        left: `calc(${projectLeft}% + ${projectWidth - 720}px)`,
        top: `${projectTop - 125}px`,
        place: '04'
      }

      const position5 = {
        left: `calc(${projectLeft}% + ${projectWidth - 720}px)`,
        top: `${projectTop - 50}px`,
        place: '05'
      }

      const position6 = {
        left: `calc(${projectLeft}% + ${projectWidth - 900}px)`,
        top: `${projectTop + 100}px`,
        place: '06'
      }

      const position7 = {
        left: `calc(${projectLeft}% + ${projectWidth - 720}px)`,
        top: `${projectTop + 200}px`,
        place: '07'
      }

      const position8 = {
        left: `calc(${projectLeft}% + ${projectWidth - 450}px)`,
        top: `${projectTop + 250}px`,
        place: '08'
      }

      const position9 = {
        left: `calc(${projectLeft}% + ${projectWidth - 200}px)`,
        top: `${projectTop + 200}px`,
        place: '09'
      }

      const position10 = {
        left: `calc(${projectLeft}% + ${projectWidth - 50}px)`,
        top: `${projectTop + 200}px`,
        place: '10'
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


  mouseCoords(e) {
    const xPercent = e.clientX / window.innerWidth * 100
    const x = xPercent >= 50 ? (xPercent * .5 - 25) * -1 : 25 - xPercent * .5

    const yPercent = e.clientY / window.innerHeight * 100
    const y = yPercent >= 50 ? (yPercent - 50) * -1 : 25 - yPercent * .5

    const z = x

    return {
      x: x,
      y: y,
      rotateX: y * -0.3,
      rotateY: x * 0.6,
    }
  }


  positionItems() {
    $('.program').each((index, el) => {
      $(el).css('transform', `translate3d( ${(Math.random() * 25) + 1}%, ${(Math.random() * 25) + 1}px, 0)`)
    })

    var pckry = new Packery( '#approachCanvas', {
      itemSelector: '.grid-item',
      stamp: '.project'
    })
  }
}
