import Flickity from 'flickity'

export class OurUniversity {

  constructor() {
    this.section = document.getElementById('ourUniversity')
    this.sectionInto = this.section.querySelector('.section-intro')
    this.slider = document.querySelector('.our-university-slider')
    this.dynamicHeadline = this.section.querySelector('.section-headlines .dynamic-text')
    this.cells = this.slider.childNodes    
    this.activeCell = null     
    const instance = this
        
    $(this.cells).on('mouseenter', function() { $(this.cells).not(this).addClass('sibling-is-hovered') })
    $(this.cells).on('mouseleave', function() { $(this.cells).removeClass('sibling-is-hovered') })
    $(this.cells).on('click', function() { instance.openCell(this) })
    $('span.close-cell').on('click', function(e) { e.stopPropagation(); instance.closeCell() })

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

      }, 250)
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