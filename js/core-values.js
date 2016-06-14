import Flickity from 'flickity'
import {Observable} from 'rxjs'

export class CoreValues {

  constructor() {
    this.section = document.getElementById('coreValues')
    this.sectionInto = this.section.querySelector('.section-intro')
    this.slider = document.querySelector('.core-values-slider')
    this.cells = this.slider.childNodes
    this.activeCell = null
    this.dynamicHeadline = this.section.querySelector('.section-headlines .dynamic-text')
    const instance = this

    $(this.cells).on('mouseenter', function() { $(this.cells).not(this).addClass('sibling-is-hovered') })
    $(this.cells).on('mouseleave', function() { $(this.cells).removeClass('sibling-is-hovered') })
    $(this.cells).on('click', function() { instance.openCell(this) })
    $('span.close-cell').on('click', function(e) { e.stopPropagation(); instance.closeCell() })

    Observable.fromEvent(window, 'resize').debounceTime(100).subscribe(() => this.resizeParticles())
    
    particlesJS.load('designDna', '/js/particles/design-dna.json')
    particlesJS.load('statusQuo', '/js/particles/status-quo.json')
    particlesJS.load('fearless', '/js/particles/fearless.json')
    particlesJS.load('diversity', '/js/particles/diversity.json')

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)
  }

  openCell(cell) {
    if (!this.activeCell) {      
      this.dynamicHeadline.textContent = $(cell).data('headline')
      $(this.cells).not(cell).addClass('sibling-is-opening')
      $(cell).addClass('opening')
      $(cell.parentNode).removeClass('content-closed')

      setTimeout(() => {
        $(this.slider).removeClass('uninitialized')
        $(this.cells).removeClass('sibling-is-opening opening')

        this.initFlkty( $(cell).index() )
        this.activeCell = cell
        this.resizeParticles()
      }, 800)
    }
  }

  closeCell() {
    if (this.activeCell) {      
      const h1 = this.flkty.selectedCell.element.querySelector('h1')
      const dynamicText = this.flkty.selectedCell.element.querySelector('.dynamic-text')          
      
      Velocity(dynamicText, {opacity: 0}, {
        duration: 250,
        complete: () => {
          $(this.activeCell).parents('.global-slider').addClass('content-closed')          
        }
      })

      setTimeout(() => {
        this.flkty.destroy()
        $(this.cells).not(this.activeCell).addClass('sibling-is-opening')
        $(this.activeCell).addClass('opening')
        $(this.slider).addClass('uninitialized')

        setTimeout(() => {
          $(this.cells).removeClass('sibling-is-opening')
          $(this.activeCell).removeClass('opening')
          this.activeCell = null
          Velocity(h1, {opacity: 1})
        })
      }, 300)

      setTimeout( () => {
        this.resizeParticles()
      }, 550)
    }
  }

  initFlkty(initialIndex) {
    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      initialIndex: initialIndex
    })

    this.startCellAnimation(this.flkty)
    this.flkty.on('settle', this.startCellAnimation.bind(this, this.flkty))
  }

  startCellAnimation(flkty) {
    const h1 = flkty.selectedCell.element.querySelector('h1')
    const dynamicText = flkty.selectedCell.element.querySelector('.dynamic-text')
    console.log(flkty.selectedCell.element)
    console.log(dynamicText)
    const phrases = ['We are driven to question everything', 'Since 1919, we have been constantly reinventing what it means to be a progressive university'];    

    //called recursively until phrases array is empty
    (function changeWord(phrase, firstPhrase) {    
      const fadeOutEl = firstPhrase ? h1 : dynamicText

      Velocity(fadeOutEl, {opacity: 0}, {
        duration: 1000,
        complete: () => {
          dynamicText.textContent = phrase

          Velocity(dynamicText, {opacity: 1}, {
            duration: 1500,
            complete: () => {
              if (phrases.length) changeWord( phrases.splice(0, 1)[0] )
            }
          })
        }
      })
    })( phrases.splice(0, 1)[0], true )
  }

  resizeParticles() {
    $('canvas').css({
      width: window.innerWidth,
      height: window.innerHeight
    })

    $('#statusQuo canvas').css({
      height: window.innerWidth
    })

    pJSDom.forEach(pjs => {
      window.particlesJS.layout(null, pjs.pJS)
    })
  }
}
