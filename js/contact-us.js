

export class ContactUs {
  constructor() {
    this.asideSlider = document.getElementById('asideSlider')
    this.slidesUl = this.asideSlider.querySelector('ul')
    this.slides = this.asideSlider.querySelectorAll('li')
    this.animateSlide(this.slides.length - 1)
  }

  animateSlide(index) {
    const slide = this.slides[index]    

    Velocity(slide, {translateX: '-50vw'}, {
      duration: 2000,
      complete: () => { 
        this.slidesUl.insertBefore(slide, this.slidesUl.firstChild)
        Velocity(slide, {translateX: '0vw'}, {
          duration: 1
        })

        const nextIndex = index - 1 > -1 ? index - 1 : this.slides.length -1

        setTimeout(() => {
          if (!this.isSleeping) {
            this.animateSlide(nextIndex)
          }
        }, 2000)
      }
    })
  }

  sleep() {
    this.isSleeping = true
  }

  awake() {
    this.isSleeping = false
    this.asideSlider = document.getElementById('asideSlider')
    this.slides = this.asideSlider.querySelectorAll('li')
    this.animateSlide(this.slides.length - 1)
  }
}