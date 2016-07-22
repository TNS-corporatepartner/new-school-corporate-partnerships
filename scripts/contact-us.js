import Flickity from 'flickity'

export class ContactUs {
  constructor() {
    this.section = document.getElementById('contactUs')
    this.sectionHeadlines = this.section.querySelector('.section-headlines')
    this.sectionIntro = this.section.querySelector('.section-intro')
    this.panels = this.section.querySelectorAll('.panel')

    $('#contactUs .panel').on('mouseenter', this.openPanel)
    $('#contactUs .panel').on('mouseleave', this.closePanel)

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
      
      setTimeout(() => {
        //enable hardware acceleration after removing section intro
        $(this.panels).addClass('accelerated')

        $(this.sectionHeadlines).removeClass('hidden')
      }, 1800)      
    }, 750)    
  }



  openPanel(e) {
    e.stopPropagation()
    const $panel = $(this)
    $('.panel-group .panel').not($panel).addClass('hover-sibling')
    $panel.addClass('hover')
  }

  closePanel(e) {
    e.stopPropagation()
    $('.panel-group .panel').removeClass('hover hover-sibling')
  }
}
