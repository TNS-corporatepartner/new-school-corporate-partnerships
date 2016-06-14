import {app} from './index.js'
import Flickity from 'flickity'
import 'd3'

export class FutureOf {

  constructor() {
    this.section = document.querySelector('#futureOf')
    this.imagineEl = document.querySelector('.future-of-header h1')
    this.futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
    // this.loadingEl = document.querySelector('.shuffler')
    this.loadingWord = this.section.querySelector('.section-headlines .dynamic-text')
    this.questionEl = document.querySelector('.question')
    this.slider = document.querySelector('.future-of-slider')

    this.questions = [
      'How can data be empathetic?',
      'How can you succeed by failing?',
      'How can technology make us more human?',
      'How can we create a better world through better business?'
    ]
    
    this.words = [
      'Big Data',
      'Gamification',
      'Technology',
      'Sustainability'
    ]

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

    this.initVideos()
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


    this.flkty.on('cellSelect', () => {
      this.playCellSequence()
    })
  }

  playCellSequence() {
    if (app.activeInstance == this) {
      const cell = this.flkty.cells[ this.flkty.selectedIndex ].element
      const video = cell.querySelector('video')
      this.questionEl.textContent = this.questions[this.flkty.selectedIndex]

      video.play()
      $('body').addClass('show-question')

      this.sliderTimer = setTimeout(() => {
        $('body').removeClass('show-question')
        setTimeout(() => {
          this.loadingWord.textContent = this.words[ this.flkty.selectedIndex + 1 ] ? this.words[ this.flkty.selectedIndex + 1 ] : this.words[0]
          this.flkty.next()
        }, 1000)
      }, 5000)
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
    window.clearTimeout(this.sliderTimer)

  }

  awake() {
    const cell = this.flkty.cells[ this.flkty.selectedIndex ].element
    this.playCellSequence()
  }
}
