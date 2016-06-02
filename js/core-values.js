import Flickity from 'flickity'

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
  }
  
  openCell(cell) {
    if (!this.activeCell) {

      $(this.cells).not(cell).addClass('sibling-is-opening')
      $(cell).addClass('opening')
      
      setTimeout(() => {        
        $(this.slider).removeClass('uninitialized')        
        $(this.cells).removeClass('sibling-is-opening opening')
                        
        this.initFlkty( $(cell).index() )
        this.activeCell = cell
      }, 800)

    }
  }  
  
  closeCell() {
    if (this.activeCell) {              

      this.flkty.destroy()
      
      $(this.cells).not(this.activeCell).addClass('sibling-is-opening')
      $(this.activeCell).addClass('opening')
      $(this.slider).addClass('uninitialized')

      setTimeout(() => {
        $(this.cells).removeClass('sibling-is-opening')
        $(this.activeCell).removeClass('opening')
        this.activeCell = null        
      })      
    
    }
  }
  
  initFlkty(initialIndex) {
    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      initialIndex: initialIndex      
    })
        
  } 

}