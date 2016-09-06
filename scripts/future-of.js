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
        $('body').addClass('show-question')
      }
    })
  }

  initFlickity() {
    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      wrapAround: true,
      autoPlay: 5450,
      initialIndex: 6,
      pauseAutoPlayOnHover: false
    })

    // this.flkty.on('dragStart', this.handleFlktyDragStart.bind(this))

    this.flkty.on('select', this.playNextVideo.bind(this))

    this.flkty.on('settle', () => {
      this.loadingWord.textContent = this.words[ this.flkty.selectedIndex ]
      this.questionEl.textContent = this.questions[ this.flkty.selectedIndex ]
      $('body').addClass('show-question')

      this.hideQuestionTimer = setTimeout(() => {
        if (this.flkty.player.state === 'playing') {
          $('body').removeClass('show-question')
        }        
      }, 4000)      
    })        

    this.flkty.next()

    setTimeout(() => {
      const cell = this.flkty.cells[this.flkty.cells.length - 1].element
      Velocity(cell, {opacity: 1})
    }, 1000)
  }

  // handleFlktyDragStart() {
  //   $('body').removeClass('show-question')

  //   if (!Modernizr.touchevents) {
  //     this.handleDragStartDragMove = _.throttle(this.handleFlktyDragMove.bind(this), 15)
  //     this.flkty.on('dragMove', this.handleDragStartDragMove)
  //   }
  // }

  handleFlktyDragMove(e, p, v) {
    const cellWidth = this.flkty.selectedElement.offsetWidth
    const startScrubPos = cellWidth * 0.15
    const scrubSeconds = 2        
    let scrubToTime
    let scrubToIndex

    if ( v.x < 0 && Math.abs(v.x) > startScrubPos ) {
      scrubToIndex = this.flkty.selectedIndex + 1 < this.flkty.cells.length ?
        this.flkty.selectedIndex + 1 : 0

      scrubToTime = scrubSeconds * Math.abs(v.x) / cellWidth

    } else if (v.x > 0 && v.x > startScrubPos ) {      
      scrubToIndex = this.flkty.selectedIndex - 1 >= 0 ?
        this.flkty.selectedIndex - 1 : this.flkty.cells.length - 1

      scrubToTime = scrubSeconds * v.x / cellWidth      
    }

    if (scrubToIndex) {
      this.videos[scrubToIndex].currentTime = scrubToTime.toFixed(3)
    }
  }

  playNextVideo() {  
    if (this.flkty.player.state !== 'playing') {
      $('body').removeClass('show-question')
    }
        
    clearTimeout(this.hideQuestionTimer)

    if (!Modernizr.touchevens) {
      // this.flkty.off('dragMove', this.handleDragStartDragMove)
      
      if (this.playingVideo) {
        this.playingVideo.pause()
      }

      this.playingVideo = this.videos[this.flkty.selectedIndex]

      if (this.playingVideo) {
        this.playingVideo.play()
      }
    }
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
