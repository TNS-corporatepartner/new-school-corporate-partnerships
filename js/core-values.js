import Flickity from 'flickity'
import {Observable} from 'rxjs'

let sections = {}

export class CoreValues {

  constructor() {
    this.section = document.getElementById('coreValues')
    this.sectionIntro = this.section.querySelector('.section-intro')
    $('#coreValues .panel').on('mouseenter', this.openPanel)
    $('#coreValues .panel').on('mouseleave', this.closePanel)

    particlesJS.load('visionary-thinking', '/js/particles/visionary.json')
    particlesJS.load('couragously-innovative', '/js/particles/innovation.json')
    particlesJS.load('global-diversity', '/js/particles/diversity.json')

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
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
