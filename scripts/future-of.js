import {app} from './index.js'
import Flickity from 'flickity'
import Velocity from 'velocity-animate'
import 'd3'

export class FutureOf {

  constructor() {
    this.section = document.querySelector('#futureOf')
    this.sectionHeadlines = this.section.querySelector('.section-headlines')
    this.sectionIntro = this.section.querySelector('.section-intro')
    this.imagineEl = document.querySelector('.future-of-header h1')
    this.futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
    this.loadingWord = this.section.querySelector('.section-headlines .dynamic-text')
    this.questionEl = document.querySelector('.question')
    this.slider = document.querySelector('.future-of-slider')
    this.words = []
    this.questions = []

    Array.prototype.forEach.call(this.section.querySelectorAll('.future-of-cell'), (el) => {
      this.questions.push($(el).data('question'))
      this.words.push($(el).data('title'))
    })

    this.shufflerConfig = {
      limit: 26,
      count: 0,
      index: 0,
      words: ['The Workforce', 'Online', 'Research & Development', 'Big Data']
    }

    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      wrapAround: true,
      autoPlay: false
    })

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
      
      setTimeout(() => {
        this.initVideos()
      }, 2200)

      setTimeout(() => {
        $(this.sectionHeadlines).removeClass('hidden')
      }, 1800)

    }, 750)    
  }

  initVideos() {
    this.shuffler({
      limit: 6,
      count: 0,
      index: 0,
      words: ['The Workforce', 'Online', 'Research & Development', 'Personalization', 'Data Privacy', 'Big Data']
    }).then(() => {
      const cell = this.flkty.cells[ this.flkty.selectedIndex ].element
      Velocity(cell, {opacity: 1})
      this.playCellSequence()      
    })
  }

  playCellSequence() {
    const video = this.flkty.selectedElement.querySelector('video')

    if (!Modernizr.touchevents) {      
      if (!video.src) {
        video.src = video.dataset.src
      }      

      //wait for asynchronus play method to complete
      const promise = video.play()

      if (promise) {
        promise.then(handleVideoSliderEvents.bind(this))
      } else {
        //handle firefox because firefox play method does not return a promise
        video.play()
        handleVideoSliderEvents.call(this)  
      }
        
    } else {       
      handleVideoSliderEvents.call(this) //touch-enabled devices
    }          

    function handleVideoSliderEvents() {
      this.loadingWord.textContent = this.words[ this.flkty.selectedIndex ]
      this.questionEl.textContent = this.questions[this.flkty.selectedIndex]
      
      $('body').addClass('show-question')
      
      this.autoPlay = setTimeout(() => {
        $('body').removeClass('show-question')
        
        setTimeout(() => {
          this.flkty.next()
        }, 1500) // 5 seconds until next slide is called (1500ms + 3500ms)
        
      }, 3500) // 3.5 seconds until question is hidden

      const previousVideo = this.flkty.selectedElement.querySelector('video')

      this.flkty.once('scroll', ( progress ) => {
        clearInterval(this.autoPlay)
                      
        if (!Modernizr.touchevents) { 
          previousVideo.pause()
        }      
        
        this.flkty.once('settle', () => {        
          if (!Modernizr.touchevents) { 
            previousVideo.currentTime = 0
            previousVideo.load()
          }

          this.playCellSequence()        
        })
      })
    }    
  }

  shuffler(o) {
    this.loadingWord = this.section.querySelector('.section-headlines .dynamic-text')

    Velocity(this.loadingWord, {opacity: 1}, {duration: 1000})

    return new Promise(resolve => {
      const wordSwitcher = setInterval(() => {
        this.loadingWord.textContent = o.words[o.index]
        o.index = o.index > o.words.length ? 0 : o.index

        if (o.count === o.limit) {
          clearInterval(wordSwitcher)
          this.loadingWord.textContent = o.words[o.words.length - 1]
          resolve()
        } else {
          o.count++
          o.index++
        }

      }, 400)
    })
  }

  sleep() {
    $('body').removeClass('show-question')
  }

  awake() {
    this.playCellSequence()
  }
}