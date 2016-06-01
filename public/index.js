// import 'd3'
// import {Observable} from 'rxjs'
// import {frame$} from './utils.js'
import Flickity from 'flickity'

window.addEventListener('DOMContentLoaded', init)


function init() {      
  var elem = document.querySelector('.future-of-slider');
  var flkty = new Flickity( elem, {
    cellAlign: 'left',
    contain: true,
    // autoPlay: true,
    wrapAround: true
  });  
  
 
  const futureOfCells = document.querySelectorAll('.future-of-cell')
  let activeFutureOfCellIndex = 0;
  
  (function playFutureOfSlider(cell) {    
    const imagineEl = document.querySelector('.future-of-header h1')
    const futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
    const loadingEl = document.querySelector('.shuffler')
    const loadingWord = loadingEl.querySelector('h1')

    Velocity(imagineEl, 'reverse')
    Velocity(futureOfEl, 'reverse')
    Velocity(loadingWord, 'reverse')

    setTimeout(() => {
      playFutureOfCell(cell).then(() => {  
        if ( ++activeFutureOfCellIndex >= futureOfCells.length ) {
          activeFutureOfCellIndex = 0
        }            
        
        flkty.next(true)      
        playFutureOfSlider( futureOfCells[activeFutureOfCellIndex] )          
      })      
    }, 1500)

        
  })(futureOfCells[activeFutureOfCellIndex])  
}

function playFutureOfCell(cell) {
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
      duration: 1200, display: 'block',
      complete: () => {
        Velocity(futureOfEl, {opacity: 1}, {
          duration: 800,
          display: 'block',
          complete: () => {
            shuffler(shufflerConfig).then( () => {
              const video = cell.querySelector('video')             
              
              setTimeout(video.play.bind(video), 200)              

              Velocity( cell, {opacity: 1}, {
                duration: 1000,
                display: 'block',
                complete: () => playVideo(video).then(() => {
                  Velocity(cell, 'reverse')
                  setTimeout(resolve, 200)
                })
              })              
            })             
          }
        })
      }
    })  
  })
  
  function playVideo(video) {
    const limit = 2
    let count = 0
    let nextCalled = false
    
    video.addEventListener('ended', () => { if (++count < limit) video.play() })
    
    return new Promise(resolve => {            
      video.addEventListener('timeupdate', function checkProgress() {        
        const percentComplete = video.currentTime / video.duration * 100
        
        if (count + 1 == limit && percentComplete >= 50 && !nextCalled) {
          video.removeEventListener(video, checkProgress)
          nextCalled = true
          resolve()
        }      
      })           
    })          
    
  }  
}


function shuffler(o) {
  const loadingEl = document.querySelector('.shuffler')
  const loadingWord = loadingEl.querySelector('h1')
  
  Velocity(loadingWord, {opacity: 1}, {duration: 300})
  
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

