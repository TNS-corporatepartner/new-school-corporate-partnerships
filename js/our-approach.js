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
  }


  handlePanning() {
    const mousemove$ = Observable
      .fromEvent(window, 'mousemove')
      .map(this.mouseCoords) //returns {x, y}

    const painter$ = Observable
      .interval(15)
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


  handleHover() {
    const projectTargets = []

    $('.project').on('mouseenter', function() {
      const projectTop = parseInt(this.style.top)
      const projectLeft = parseInt(this.style.left)
      const programEls = $(this).data('programs').map( pId => document.querySelector(`.program[data-id="${pId}"]`) )
        
      programEls.forEach( (el, index) => {
        el.lastLeft = el.style.left 
        el.lastTop = el.style.top 
        el.style.left = projectLeft + (index % 2 == 0 ? -5 : 5) + '%'
        el.style.top = projectTop + (index % 2 == 0 ? -5 : 5) + '%'
      })

      $(this).one('mouseleave', function() {
        programEls.forEach(el => {
          el.style.left = el.lastLeft
          el.style.top = el.lastTop
        })
      })      
    })
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


