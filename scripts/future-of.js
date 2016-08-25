import {app} from './index.js'
import Flickity from 'flickity'
import Velocity from 'velocity-animate'
import _ from 'lodash'
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
    this.videos = document.querySelectorAll('#futureOf video')

    Array.prototype.forEach.call(this.section.querySelectorAll('.future-of-cell'), (el, i) => {
      if (i === 0) {
        this.questionEl.textContent = el.dataset.question
      }
      this.questions.push($(el).data('question'))
      this.words.push($(el).data('title'))
    })

    this.shufflerConfig = {
      limit: 26,
      count: 0,
      index: 0,
      words: ['The Workforce', 'Online', 'Research & Development', 'Big Data']
    }

    setTimeout(() => {
      $(this.sectionIntro).addClass('hidden')
      
      setTimeout(this.initVideos.bind(this), 2200)

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
      if (!this.hasSlept) {
        this.initFlickity()
      }
    })
  }

  initFlickity() {
    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      wrapAround: true,
      autoPlay: 6000,
      initialIndex: 6,
      pauseAutoPlayOnHover: false
    })

    this.flkty.on('scroll', this.handleFlktyScroll.bind(this))

    this.flkty.next()    
    
    setTimeout(() => {
      const cell = this.flkty.cells[this.flkty.cells.length - 1].element
      Velocity(cell, {opacity: 1})
    }, 1000)   
  }

  handleFlktyScroll(prog, xpos) {
    $('body').removeClass('show-question')

    const targetDistances = this.flkty.slides
      .map( (slide, index) => slide.target - xpos)

    const closestIndex = targetDistances
      .map(dist => Math.abs(dist))
      .indexOf(
        Math.min.apply(null, targetDistances.map(dist => Math.abs(dist)))
      )

    const closestDistance = targetDistances.splice(closestIndex, 1)[0]        
    const scrub = (0.22 / (closestDistance / 100 >= 1 ? closestDistance / 100 : 1)).toFixed(2)    

    if (this.scrub !== scrub && scrub > 0.18 ) {
      this.handleFlktySettle(closestIndex)
    } else if (scrub <= 0.18) {
      this.videos[closestIndex].currentTime = scrub
    }

    this.scrub = scrub  
  }

  handleFlktySettle(index) {
    if (!Modernizr.touchevens) {

      if (this.playingVideo) {
        this.playingVideo.pause()
      }

      // this.playingVideo = this.flkty.selectedElement.querySelector('video')
      this.playingVideo = this.videos[index]

      if (this.playingVideo) {
        this.playingVideo.play()        
      }
    }

    setTimeout(() => { 
    this.loadingWord.textContent = this.words[ index ]
    this.questionEl.textContent = this.questions[index]
      $('body').addClass('show-question')     
    }, 750)
  }

  shuffler(o) {
    this.loadingWord.classList.add('show-override')

    return new Promise(resolve => {
      const wordSwitcher = setInterval(() => {
        this.loadingWord.textContent = o.words[o.index]
        o.index = o.index > o.words.length ? 0 : o.index

        if (o.count === o.limit) {
          clearInterval(wordSwitcher)
          this.loadingWord.textContent = o.words[o.words.length - 1]
          resolve()
          this.loadingWord.classList.remove('show-override')
        } else {
          o.count++
          o.index++
        }

      }, 400)
    })
  }

  sleep() {
    $('body').removeClass('show-question')
    this.hasSlept =  true

    if (this.flkty) {
      this.flkty.player.pause()
    }    
  }

  awake() {
    if (this.flkty) {
      this.flkty.next()
      this.flkty.player.play()
    } else {
      this.initFlickity()
    }
  }
}
