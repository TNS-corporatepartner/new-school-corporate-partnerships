import Flickity from 'flickity'
import {Observable} from 'rxjs'

const sections =  {
  "Inspiring Visionary Thinking": [
    'We use design to tackle the big question.',
    'We are the only comprehensive university with a world-famous design school at its core.',
    'We design solutions that get to the future first.'
  ],
  "Courageously Innovative": [
    'We rethink the question, not just the answer.',
    'We collaborate with unlikely partners to expand the possibilities.',
    'We innovate with a purpose to improve the human experience.'
  ],
  "Embodying Diversity": [
    'We are a microcosm of the global population and a magnet for talent from all over the world.',
    'We are in one of the most creative and diverse city in the world.',
    'We are a living laboratory for exploring and testing the news.'
  ]
}


export class CoreValues {

  constructor() {
    const instance = this
    this.section = document.getElementById('coreValues')
    this.sectionInto = this.section.querySelector('.section-intro')
    this.slider = document.querySelector('.core-values-slider')
    this.cells = this.slider.childNodes
    this.activeCell = null
    this.dynamicHeadline = this.section.querySelector('.section-headlines .dynamic-text')
    
    Observable.fromEvent(window, 'resize').debounceTime(100).subscribe(() => this.resizeParticles())
    $(this.cells).on('mouseenter', function() { $(this.cells).not(this).addClass('sibling-is-hovered') })
    $(this.cells).on('mouseleave', function() { $(this.cells).removeClass('sibling-is-hovered') })    

    $('#coreValues').on('click', '.core-values-cell.is-selected', (e) => {
      e.stopPropagation()
      this.cancelCellAnimation().then(() => {                
        this.closeCell()
      })
      // this.closeCell()
    })

    $('.content-inner h1').on('click', function(e) { 
      e.stopPropagation()
      instance.openCell( $(this).parents('.core-values-cell').get(0) )
    })    

    particlesJS.load('designDna', '/js/particles/design-dna.json')
    // particlesJS.load('fearless', '/js/particles/fearless.json')
    particlesJS.load('diversity', '/js/particles/diversity.json')

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)

    setTimeout(() => {
      this.resizeParticles()
    }, 1500)    
  }

  openCell(cell) {
    if (!this.activeCell) {
      //remove class to show section header dynamic text
      $(cell.parentNode).removeClass('content-closed')

      //grow selected cell and shrink siblings
      $(this.cells).not(cell).addClass('sibling-is-opening')
      $(cell).addClass('opening')
      
      setTimeout(() => {
        //changes styles for flickity initialization
        $(this.slider).removeClass('uninitialized')
        $(this.cells).removeClass('sibling-is-opening opening')

        //init flickity (and cell animation)
        this.initFlkty( $(cell).index() )        
        this.resizeParticles()
      }, 800)
    }
  }

  initFlkty(initialIndex) {
    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      initialIndex: initialIndex,
      draggable: false
    })

    this.startCellAnimation(this.flkty)

    // this.flkty.on('settle', () => {
    //   this.resetCellText().then(this.startCellAnimation.bind(this, this.flkty))      
    // })    
  }

  cancelCellAnimation() {
    return new Promise(resolve => {
      console.log(this.lastCellAnimated)

      Velocity(this.lastCellAnimated.dynamicText, 'stop')
      Velocity(this.lastCellAnimated.dynamicText, {opacity: 0}, {
        duration: 400,
        display: 'none',
        complete: () => {
          Velocity(this.lastCellAnimated.h1, 'stop')
          Velocity(this.lastCellAnimated.h1, {opacity: 1}, {
            display: 'block',
            duration: 400,
            complete: () => {
              $(this.activeCell).parents('.global-slider').addClass('content-closed')              
              resolve()
            }
          })
        }
      })
    })      
  }

  // resetCellText() {
  //   return new Promise(resolve => {
  //     Velocity(this.lastCellAnimated.dynamicText, {opacity: 0}, {
  //       duration: 200,
  //       display: 'none',
  //       complete: () => {
  //         Velocity(this.lastCellAnimated.h1, {opacity: 1}, {
  //           duration: 200
  //         })
  //       }
  //     })
  //   })
  // }

  startCellAnimation(flkty) {
    const h1 = flkty.selectedCell.element.querySelector('h1')
    const dynamicText = flkty.selectedCell.element.querySelector('.dynamic-text')
    const key = $(flkty.selectedCell.element).data('headline');
    const phrases = sections[key];

    this.activeCell = $(flkty.selectedCell.element).parents('.core-values-cell').get(0)

    //change header text
    this.dynamicHeadline.textContent = $(this.activeCell).data('headline')

    this.lastCellAnimated = {
      h1: h1,
      dynamicText: dynamicText
    };

    //called recursively until phrases array is empty
    (function changeWord(phrase, firstPhrase) {
      const fadeOutEl = firstPhrase ? h1 : dynamicText

      Velocity(fadeOutEl, {opacity: 0}, {
        duration: 1000,
        display: 'none',
        complete: () => {
          dynamicText.textContent = phrase

          Velocity(dynamicText, {opacity: 1}, {
            duration: 2000,
            complete: () => {
              if (phrases.length) {
                changeWord( phrases.splice(0, 1)[0] )
              }
            }
          })
        }
      })
    })( phrases.splice(0, 1)[0], true )
  }

  closeCell() {      
    this.activeCell = this.flkty.selectedCell.element
    this.flkty.destroy()

    $(this.cells).not(this.activeCell).addClass('sibling-is-opening')
    $(this.activeCell).addClass('opening')
    $(this.slider).addClass('uninitialized')

    setTimeout(() => {
      console.log(this.activeCell)
      $(this.cells).removeClass('sibling-is-opening')
      $(this.activeCell).removeClass('opening')
      this.activeCell = null
    })

    setTimeout( () => {
      this.resizeParticles()
    }, 550)
  }

  resizeParticles() {
    $('canvas').css({
      width: window.innerWidth,
      height: window.innerHeight
    })

    pJSDom.forEach(pjs => {
      window.particlesJS.layout(null, pjs.pJS)
    })
  }
}
