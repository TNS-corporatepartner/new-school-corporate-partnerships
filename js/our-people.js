import {Observable} from 'rxjs'

export class OurPeople {
  constructor() {
    this.section = document.getElementById('ourPeople')
    this.sectionInto = this.section.querySelector('.section-intro')    
    const slider = document.getElementById('peopleSlider')
    const moving = Observable.fromEvent(window, 'mousemove')
    this.center = slider.scrollWidth / 2 - window.innerWidth
    // slider.scrollLeft = this.center

    const movingRight = moving
      .filter(e => e.clientX > window.innerWidth / 2)
      .subscribe(e => {     
        if (window.lastX !== e.clientX || window.lastY !== e.clientY){
          const velocity = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) / 2
          const pos = e.clientX - window.innerWidth / 2          
          slider.scrollLeft = slider.scrollLeft + pos * velocity
        }   

        window.lastX = e.clientX
        window.lastY = e.clientY         
      })

    const movingLeft = moving
      .filter(e => e.clientX < window.innerWidth / 2)
      .subscribe(e => {
        if (window.lastX !== e.clientX || window.lastY !== e.clientY){
          const velocity = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)  / 2
          const pos = window.innerWidth / 2 - e.clientX 
          slider.scrollLeft = slider.scrollLeft + pos * velocity
        }   
        
        window.lastX = e.clientX
        window.lastY = e.clientY               
      })
  
    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)
  }
}