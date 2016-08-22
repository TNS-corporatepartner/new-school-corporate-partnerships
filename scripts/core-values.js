import Flickity from 'flickity'
import {Observable} from 'rxjs'
import {app} from './index'

let sections = {}

export class CoreValues {

  constructor() {
    this.section = document.getElementById('coreValues')
    this.sectionIntro = this.section.querySelector('.section-intro')
    this.sectionHeadlines = this.section.querySelector('.section-headlines')
    this.panels = this.section.querySelectorAll('.panel')
    $('#coreValues .panel').on('mouseenter', this.openPanel)
    $('#coreValues .panel').on('mouseleave', this.closePanel)

    if (window.innerWidth > app.breakpoints.$breakMobile) {
      this.initParticles()
    }

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
      
      setTimeout(() => {
        //enable hardware acceleration after removing section intro
        $(this.panels).addClass('accelerated')

        $(this.sectionHeadlines).removeClass('hidden')
      }, 1800)      
    }, 750)    
  }

  initParticles() {
    if (!window.pJSDom) {
      window.pJSDom = []
    }

    particlesJS.load('visionary-thinking', '/particles/visionary.json')
    particlesJS.load('couragously-innovative', '/particles/innovation.json')
    particlesJS.load('global-diversity', '/particles/diversity.json')    
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

  sleep() {    
    //destroy particles js instances
    if (window.innerWidth > app.breakpoints.$breakMobile) {
      Array.prototype.forEach.call( window.pJSDom, (pjs) => pjs.pJS.fn.vendors.destroypJS() )
    }
  }

  awake() {
    if (window.innerWidth > app.breakpoints.$breakMobile) {
      this.initParticles()
    }
  }
}
