import {Observable} from 'rxjs'

export class OurPeople {
  constructor() {
    const slider = document.getElementById('peopleSlider')
    const moving = Observable.fromEvent(window, 'mousemove')
    this.scrollPos = 0


    // const movingRight = moving
    //   .filter(e => e.clientX > window.innerWidth / 2)
    //   // .debounceTime(100)
    //   .subscribe(e => {        
    //     this.scrollPos += 10
    //     slider.scrollLeft = this.scrollPos
    //   })

    // const movingLeft = moving
    //   .filter(e => e.clientX < window.innerWidth / 2)
    //   // .debounceTime(50)
    //   .subscribe(e => {        
    //     this.scrollPos -= 10
    //     slider.scrollLeft = this.scrollPos
    //   })
  }
}