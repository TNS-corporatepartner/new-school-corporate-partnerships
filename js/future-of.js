import Flickity from 'flickity'

export class FutureOf {  
  
  constructor() {
    this.futureOfCells = document.querySelectorAll('.future-of-cell')
    this.activeFutureOfCellIndex = 0     
    this.imagineEl = document.querySelector('.future-of-header h1')
    this.futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
    this.loadingEl = document.querySelector('.shuffler')
    this.loadingWord = this.loadingEl.querySelector('h1')       

    var slider = document.querySelector('.future-of-slider')    
    this.flkty = new Flickity( slider, {
      cellAlign: 'left',
      contain: true,
      wrapAround: true,
      prevNextButtons: false
    })  
    
    this.playFutureOfSlider( this.futureOfCells[this.activeFutureOfCellIndex] ) 
  }
 
  playFutureOfSlider(cell) {
    Velocity(this.imagineEl, 'reverse')
    Velocity(this.futureOfEl, 'reverse')
    Velocity(this.loadingWord, 'reverse')

    setTimeout(() => {
      this.playFutureOfCell(cell).then(() => {  
        if ( ++this.activeFutureOfCellIndex >= this.futureOfCells.length ) {
          this.activeFutureOfCellIndex = 0
        }            
        
        this.flkty.next(true)      
        this.playFutureOfSlider( this.futureOfCells[this.activeFutureOfCellIndex] )          
      })      
    }, 1500)     
  }
 
 
  playFutureOfCell(cell) {
    this.imagineEl = document.querySelector('.future-of-header h1')
    this.futureOfEl = document.querySelectorAll('.future-of-header h1')[1]    
    const shufflerConfig = {
      limit: 26,
      count: 0,
      index: 0,
      words: ['The Workforce', 'Sustainability', 'Research & Development', 'Big Data']   
    }  
    
    return new Promise(resolve => {
      Velocity(this.imagineEl, {opacity: 1}, {
        duration: 1200, display: 'block',
        complete: () => {
          Velocity(this.futureOfEl, {opacity: 1}, {
            duration: 800,
            display: 'block',
            complete: () => {
              this.shuffler(shufflerConfig).then( () => {
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


  shuffler(o) {
    this.loadingEl = document.querySelector('.shuffler')
    this.loadingWord = this.loadingEl.querySelector('h1')
    
    Velocity(this.loadingWord, {opacity: 1}, {duration: 300})
    
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
        
      }, 100)    
    })  
  }
  
}