import {Observable} from 'rxjs'
import Isotope from 'isotope-layout'
import 'isotope-masonry-horizontal'

export class OurPeople {
  constructor() {
    this.section = document.getElementById('ourPeople')
    this.sectionInto = this.section.querySelector('.section-intro')    
    const slider = document.getElementById('peopleSlider')
    const sliderInner = slider.querySelector('.slider-inner')
    
    this.center = slider.scrollWidth / 2 - window.innerWidth
    this.xPos = 0
    var sliderX = 0
    var lastX = 0
    var sliderPosition = 0
    // var cellWidth = slider.querySelector('.cell .grid').offsetWidth
    var cellWidth = 1804
    console.log(cellWidth)
    var slideWidth = cellWidth * 1;

    var chunks = document.querySelectorAll('.grid').forEach(chunk => {
      new Isotope( chunk, {
        itemSelector: '.person',
        layoutMode: 'masonryHorizontal',
        masonryHorizontal: {
          rowHeight: 300
        }
      });
    })

    const moving = Observable.fromEvent(window, 'mousemove')

    const movingRight = moving
      .filter(e => e.clientX > window.innerWidth / 2)
      .subscribe(e => {
        const velocity = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)                  
        sliderX -= velocity * 20

        var sliderPosition = ( ( ( sliderX - cellWidth ) % slideWidth ) + slideWidth ) % slideWidth;
        sliderPosition += -slideWidth + cellWidth;        
        console.log(sliderPosition.toFixed(0))
        slider.style.left = sliderPosition + 'px';
      }) 

    const movingLeft = moving
      .filter(e => e.clientX < window.innerWidth / 2)
      .subscribe(e => {
        const velocity = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2) * -1      
        sliderX += velocity * 20

        var sliderPosition = ( ( ( sliderX - cellWidth ) % slideWidth ) + slideWidth ) % slideWidth;
        sliderPosition += -slideWidth + cellWidth;
        slider.style.left = sliderPosition + 'px';
      })
  
    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)
  }
}