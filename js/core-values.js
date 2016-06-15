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
    $('span.close-cell').on('click', function(e) { e.stopPropagation(); instance.closeCell() })

    $('.core-values-cell').on('click', (e) => {
      e.stopPropagation()
      this.closeCell()
    })

    $('.content-inner h1').on('click', function(e) { 
      e.stopPropagation()
      instance.openCell( $(this).parents('.core-values-cell').get(0) )
    })    

    Observable.fromEvent(window, 'resize').debounceTime(100).subscribe(() => this.resizeParticles())

    particlesJS.load('designDna', '/js/particles/design-dna.json')
    particlesJS.load('statusQuo', '/js/particles/status-quo.json')
    particlesJS.load('fearless', '/js/particles/fearless.json')
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

    const key = $(flkty.selectedCell.element).data('headline');

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


    const phrases = sections[key];

    //called recursively until phrases array is empty
    (function changeWord(phrase, firstPhrase) {
      const fadeOutEl = firstPhrase ? h1 : dynamicText

      Velocity(fadeOutEl, {opacity: 0}, {
        duration: 1000,
        complete: () => {
          dynamicText.textContent = phrase

          Velocity(dynamicText, {opacity: 1}, {
            duration: 3000,
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
