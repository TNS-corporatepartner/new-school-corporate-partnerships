import {Observable} from 'rxjs'

export class OurPeople {
  constructor() {
    this.section = document.getElementById('ourPeople')
    this.sectionInto = this.section.querySelector('.section-intro')    
    const slider = document.getElementById('peopleSlider')
    const moving = Observable.fromEvent(window, 'mousemove')
    this.scrollPos = 0


    const movingRight = moving
      .filter(e => e.clientX > window.innerWidth / 2)
      // .debounceTime(100)
      .subscribe(e => {        
        this.scrollPos += 10
        slider.scrollLeft = this.scrollPos
      })

    const movingLeft = moving
      .filter(e => e.clientX < window.innerWidth / 2)
      // .debounceTime(50)
      .subscribe(e => {        
        this.scrollPos -= 10
        slider.scrollLeft = this.scrollPos
      })
  
    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)
  }
}