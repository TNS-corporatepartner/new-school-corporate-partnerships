import Flickity from 'flickity'

export class ContactUs {
  constructor() {
    this.section = document.getElementById('contactUs')
    this.sectionHeadlines = this.section.querySelector('.section-headlines')
    this.sectionIntro = this.section.querySelector('.section-intro')

    $('#contactUs .panel').on('mouseenter', this.openPanel)
    $('#contactUs .panel').on('mouseleave', this.closePanel)

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')

      setTimeout(() => {
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
