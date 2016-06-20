import Flickity from 'flickity'

export class OurSchool {

  constructor() {
    this.section = document.getElementById('ourSchool')
    this.sectionInto = this.section.querySelector('.section-intro')

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)
  }


}
