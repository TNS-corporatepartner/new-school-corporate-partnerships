import Flickity from 'flickity'
import {Observable} from 'rxjs'

export class CoreValues {

  constructor() {
    this.slider = document.querySelector('.core-values-slider')
    this.cells = this.slider.childNodes
    this.activeCell = null     
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
      this.resizeParticles()
    }, 1500)

    // new Canvas({
    //   canvasParentSelector: '#designDna'
    // })
    
    // new Canvas({
    //   canvasParentSelector: '#statusQuo'
    // })
    
    // new Canvas({
    //   canvasParentSelector: '#fearless'
    // })
    
    // new Canvas({
    //   canvasParentSelector: '#diversity'
    // })        
  }
  
  openCell(cell) {
    if (!this.activeCell) {

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

      $(this.activeCell).parents('.global-slider').addClass('content-closed')
        
      setTimeout(() => {
        this.flkty.destroy()
        $(this.cells).not(this.activeCell).addClass('sibling-is-opening')
        $(this.activeCell).addClass('opening')
        $(this.slider).addClass('uninitialized')

        setTimeout(() => {
          $(this.cells).removeClass('sibling-is-opening')
          $(this.activeCell).removeClass('opening')
          this.activeCell = null                
        })
        
        setTimeout( () => {
          this.resizeParticles()
        }, 500)        
      }, 250)    
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
    const words = ['test', 'sample', 'something', 'else'];
    

    (function changeWord(word) {

      Velocity(h1, {opacity: 0}, { 
        complete: () => {
          h1.textContent = word
          
          Velocity(h1, {opacity: 1}, {
            complete: () => {
              if (words.length) changeWord( words.splice(0, 1)[0] ) 
            }
          })
        }
      })
      
    })( words.splice(0, 1)[0] )

    
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