import 'gsap'
import _ from 'lodash'
import {Observable} from 'rxjs'
import Velocity from 'velocity-animate'
import {app} from './index.js'
import Packery from 'packery'
import 'particles.js'

export class OurApproach {
  constructor() {
    this.section = document.getElementById('ourApproach')
    this.canvas = document.getElementById('approachCanvas')
    this.slider = document.querySelector('.approach-slider-inner')
    this.grids = document.querySelectorAll('.approach-grid')
    this.gridWidth = null //defined in positionItems
    this.projects = document.querySelectorAll('.project')
    this.skips = document.querySelectorAll('.hover-area')
    this.timeScaleTween = null // used as a reference to start and stop timescale animations

    //position projects and programs
    this.positionItems()

    //start infinitely looping animation
    this.tl = new TimelineMax({
      repeat: -1,
      smoothChildTiming: true,
      onReverseComplete: () => {
        this.tl.seek('5')
      }
    })

    this.initStreams()
    this.handleClicks()

    if (!Modernizr.touchevents || window.innerWidth >= $breakTablet) {
      this.handleSliderMovement()
      this.handleHover()
    }

    //fade out section intro
    setTimeout(() => {
      $(this.section.querySelector('.section-intro')).addClass('hidden')
      setTimeout(() => {
        $(this.section.querySelector('.section-headlines')).removeClass('hidden')
      }, 1800)
    }, 750)
  }

  initStreams() {
    this.sliderMouse$ = Observable.fromEvent(this.slider, 'mousemove')
    this.sliderLeave$ = Observable.fromEvent(this.slider, 'mouseleave')

    this.projectEnter$ = Observable.fromEvent( this.projects, 'mouseenter' )
    this.projectLeave$ = Observable.fromEvent( this.projects, 'mouseleave' )
    this.projectClick$ = Observable.fromEvent( this.projects, 'click' )

    this.skipEnter$ = Observable.fromEvent( this.skips, 'mouseenter' )
    this.skipLeave$ = Observable.fromEvent( this.skips, 'mouseleave' )
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
    Array.prototype.forEach.call(this.grids, (grid) => {
      Array.prototype.forEach.call(grid.querySelectorAll('.program'), (program, index) => {
        $(program).css(randomPadding[index])
      })
    })

    //initalize three identical packery grids
    Array.prototype.forEach.call(this.grids, (grid) => {
      new Packery(grid, {
        itemSelector: '.program',
        isHorizontal: true,
        stamp: '.project',
      })
    })

    //set width of parent containing isotope grids in order to float: left
    const sliderWidth = document.querySelector('.approach-grid').offsetWidth * 3
    this.gridWidth = document.querySelector('.approach-grid').offsetWidth
    this.slider.style.width = sliderWidth + 'px'
    Array.prototype.forEach.call(this.grids, (grid) => grid.style.left = this.gridWidth * -1 + 'px')

    //reveal programs
    $('.program').removeClass('hidden').css('transition', 'top 1s ease-in-out, left 1s ease-in-out, opacity 1s ease-in-out, font-size 1s ease-in-out')
        
  }

  handleSliderMovement() {
    this.tl.add( new TweenMax(this.slider, '5', {
      left: this.gridWidth * -1,
      ease: Linear.easeNone
    })).timeScale(0.15)

    //reverese panning direction when mouse crosses y-center
    this.sliderMouse$
      .map(e => this.mouseCoords(e))
      .subscribe(e => {
        if ( e.x < 0 && this.tl.reversed() ) {
          this.tl.reversed(false)
        } else if ( e.x > 0 && !this.tl.reversed() ) {
          this.tl.reversed(true)
        }
      })

    this.sliderLeave$.subscribe(() => {
      this.tl.timeScale(0.15)
    })
  }

  handleHover() {
    const sliderInner = this.slider
    const gridWidth = this.gridWidth

    this.skipEnter$.subscribe(() => {
      this.timeScaleTween && this.timeScaleTween.kill()
      this.timeScaleTween = TweenMax.to(this.tl, 2, {timeScale: 0.65})
    })

    this.skipLeave$.subscribe(() => {
      this.timeScaleTween && this.timeScaleTween.kill()
      this.timeScaleTween = TweenMax.to(this.tl, 2, {timeScale: 0.15})
    })

    this.projectEnter$.subscribe((e) => {
      const project = e.target
      const projectBounds = project.getBoundingClientRect()
      const parent = project.offsetParent.getBoundingClientRect()
      const projectLeft = projectBounds.left + 25  + (parent.left * -1) //25 paddingLeft
      const projectTop = projectBounds.top - parent.top + 15 //15 paddingTop
      const projectBottom = projectBounds.bottom - projectBounds.height + 15 //15 paddingTop
      const projectWidth = project.offsetWidth         //px
      const projectHeight = project.offsetHeight       //px
      const programEls = $(project).data('programs')
        .split(',')
        .map( pId => project.offsetParent.querySelector(`.program[data-id="${pId}"]`) )
        .filter(p => p)

      const programPositions = getProgramPositions(projectTop, projectBottom, projectLeft, projectWidth, projectHeight, programEls)

      //slow scroll to a stop
      this.timeScaleTween && this.timeScaleTween.kill()
      this.timescaleTween = TweenMax.to(this.tl, 3, {timeScale:0})

      $('.project').not(project).addClass('sibling-hover')
      $('.program').not(programEls).addClass('sibling-hover')

      Array.prototype.forEach.call(programEls, (program, index) => {
        $(program).addClass('hover')

        //save last original position to reset on mouseleave
        program.lastLeft = program.style.left
        program.lastTop = program.style.top


        //position programs around project
        const parentIndex = $(program.offsetParent).index()
        let programLeft

        program.style.left = programPositions[index].left - program.offsetWidth + 'px'
        program.style.top = programPositions[index].top - program.offsetHeight + 'px'
        // program.textContent = program.textContent.slice(0, -2) + programPositions[index].place //for debugging
      })

      $(project).one('mouseleave', () => {
        $('.project').removeClass('sibling-hover')
        $('.program').removeClass('sibling-hover')

        Array.prototype.forEach.call(programEls, (el) => {
          $(el).removeClass('hover')
          el.style.left = el.lastLeft
          el.style.top = el.lastTop
          el.style.transform = el.lastTransform
        })

        this.timeScaleTween && this.timeScaleTween.kill()
        this.timescaleTween = TweenMax.to(this.tl, 1, {timeScale: 0.15})
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

  handleClicks() {

    this.projectClick$.subscribe((e) => {
      const project = e.currentTarget
      e.stopPropagation()
      this.timeScaleTween && this.timeScaleTween.kill()
      this.timescaleTween = TweenMax.to(this.tl, 1, {timeScale: 0})

      const modal = document.getElementById('ourApproachModal')
      const modalContent = modal.querySelector('.content')
      const projectImg = project.querySelector('.project-image').getBoundingClientRect()

      modalContent.querySelector('.title-content').textContent = $(project).data('title')
      modalContent.querySelector('.label-group').textContent = $(project).data('programs').replace(/-/g, ' ').split(',').join(', ')
      modalContent.querySelector('blockquote').textContent = $(project).data('blockquote')
      modalContent.querySelector('.text-content').innerHTML = $(project).data('content')

      modal.querySelector('img').src = $(project).data('image')
      $.fn.fullpage.setAllowScrolling(false)

      $('body').addClass('approach-modal-open')

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
              modalContent.scrollTop = 0

              Velocity(modalContent, {
                opacity: 1
              }, {
                display: 'flex'
              })
            }
          })
        }
      })

      $(modal).one('click', (e) => {
        e.stopPropagation()

        this.timeScaleTween && this.timeScaleTween.kill()
        this.timescaleTween = TweenMax.to(this.tl, 1, {timeScale: 0.15})

        $.fn.fullpage.setAllowScrolling(true)
        $('body').removeClass('approach-modal-open')

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
