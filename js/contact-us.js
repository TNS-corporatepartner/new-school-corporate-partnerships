import Flickity from 'flickity'

export class ContactUs {
  constructor() {
    $('#contactUs .panel .content').on('mouseenter', this.openPanel)
    $('#contactUs .panel').on('mouseleave', this.closePanel)
    $('#contactUs').on('click', '.panel.hover', this.closePanel)
  }

  openPanel(e) {
    e.stopPropagation()
    const $panel = $(this).parents('.panel')      
    $('.panel-group .panel').not($panel).addClass('hover-sibling')
    $panel.addClass('hover')
  }

  closePanel(e) {
    e.stopPropagation()
    $('.panel-group .panel').removeClass('hover hover-sibling')  
  }

  sleep() {
    this.isSleeping = true
  }

  awake() {
    this.isSleeping = false
  }
}