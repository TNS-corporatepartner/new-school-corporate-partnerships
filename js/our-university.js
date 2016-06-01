import Flickity from 'flickity'

export class OurUniversity {

  constructor() {
    this.slider = document.querySelector('.our-university-slider')    
    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      // wrapAround: true,
      prevNextButtons: true
    })
    
    this.flkty.on('staticClick', () => {
      const isFullWidth = this.slider.classList.value.includes('full-width')
      if (isFullWidth) {
        this.slider.classList.remove('full-width')
      } else {
        this.slider.classList.add('full-width')  
      }
      
      this.flkty.resize()
    })      
  }

}