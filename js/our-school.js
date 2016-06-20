import Flickity from 'flickity'

export class OurSchool {

  constructor() {
    this.section = document.getElementById('ourSchool')
    this.sectionInto = this.section.querySelector('.section-intro')
    this.paragraphIntro = this.section.querySelector('.intro-paragraph')
    this.schoolLinks = this.section.querySelectorAll('.school')

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)

    setTimeout(() => {
      $(this.paragraphIntro).addClass('hidden')
    }, 3000)
  
    $(this.schoolLinks).on('click', function(e) {
      e.stopPropagation()
      console.log(this)
    })
  }

}
