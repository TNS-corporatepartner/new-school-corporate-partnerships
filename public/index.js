// import 'd3'
// import {Observable} from 'rxjs'
// import {frame$} from './utils.js'
import Flickity from 'flickity'

window.addEventListener('DOMContentLoaded', init)


function init() {  
  // var elem = document.querySelector('.future-of-slider');
  // var flkty = new Flickity( elem, {
  //   cellAlign: 'left',
  //   contain: true,
  //   // autoPlay: true,
  //   wrapAround: true
  // });  
  
  // console.log(flkty)
  
  
  
  startFutureOf().then( () => {
    const vidEl = document.querySelector('video')
    console.log('show vid')
    Velocity(vidEl, {opacity: 1}, {
      duration: 1000,
      display: 'block'
    })
  })
}

function startFutureOf() {
  const imagineEl = document.querySelector('.future-of-header h1')
  const futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
  
  const shufflerConfig = {
    limit: 26,
    count: 0,
    index: 0,
    words: ['The Workforce', 'Sustainability', 'Research & Development', 'Big Data']   
  }  
  
  return new Promise(resolve => {
    Velocity(imagineEl, {opacity: 1}, {
      duration: 1500, display: 'block',
      complete: () => {
        Velocity(futureOfEl, {opacity: 1}, {
          duration: 1000,
          display: 'block',
          complete: () => {
            shuffler(shufflerConfig).then(resolve)             
          }
        })
      }
    })  
  })
  
}


function shuffler(o) {
  const loadingEl = document.querySelector('.loading-graphic')
  const loadingWord = loadingEl.querySelector('h1')
  return new Promise(resolve => {
    const wordSwitcher = setInterval(() => {
      loadingWord.textContent = o.words[o.index]
      o.index = o.index > o.words.length ? 0 : o.index     
      
      if (o.count === o.limit) {
        clearInterval(wordSwitcher)
        loadingWord.textContent = o.words[o.words.length - 1]
        resolve()
      } else {
        o.count++
        o.index++      
      }
      
    }, 100)    
  })
  
}

