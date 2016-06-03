import Flickity from 'flickity'


export class FutureOf {  
  
  constructor() {
    this.futureOfCells = document.querySelectorAll('.future-of-cell')
    this.activeFutureOfCellIndex = 0     
    this.imagineEl = document.querySelector('.future-of-header h1')
    this.futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
    this.loadingEl = document.querySelector('.shuffler')
    this.loadingWord = this.loadingEl.querySelector('h1')     
    this.questionEl = document.querySelector('.question')  
    this.questions = [
      'How can data be human?',
      'How is the gamification of learning reshaping the workforce?',
      'question 3'
    ]
    this.words = [
      'Big Data',
      'Learning & Development',
      'three'
    ]


    var slider = document.querySelector('.future-of-slider')    
    this.flkty = new Flickity( slider, {
      cellAlign: 'left',
      contain: true,
      wrapAround: true
    })  
    
    // this.playFutureOfSlider( this.futureOfCells[this.activeFutureOfCellIndex] )
    
    
    $('video').each(function(i, vid) {
      vid.play()
    }) 
    
       
    const shufflerConfig = {
      limit: 26,
      count: 0,
      index: 0,
      words: ['The Workforce', 'Sustainability', 'Research & Development', 'Big Data']   
    }      
            
    Velocity(this.imagineEl, {opacity: 1}, {
      duration: 1200, display: 'block',
      complete: () => {
        Velocity(this.futureOfEl, {opacity: 1}, {
          duration: 800,
          display: 'block',
          complete: () => {
            this.shuffler(shufflerConfig).then( () => {
              
              setTimeout(() => {
                Velocity(this.imagineEl, {opacity: 0.2})
                Velocity(this.futureOfEl, {opacity: 0.2}, {
                  complete: () => showQuestion.call(this) 
                })
                Velocity(this.loadingWord, {opacity: 0.2})                
              }, 1000)

            })
          }
        })
      }
    })
        
    function showQuestion() {
      this.questionEl.textContent = this.questions[this.flkty.selectedIndex]
      Velocity(this.futureOfCells[0], { opacity: 1}, {
        duration: 600,
        complete: () => {
          this.questionEl.textContent = this.questions[this.flkty.selectedIndex]
          
          Velocity(this.questionEl, {opacity: 1},  {
            duration: 1000,
            complete: () => {
              setTimeout(() => {
                Velocity(this.questionEl, {opacity: 0}, {
                  complete: () => {
                    
                    startInterval.call(this)
                  }
                })
              }, 2000)
            }
          })
        }
      })      
    }
    
    
    function startInterval() {
      this.flkty.next()      
      Velocity(this.loadingWord, { opacity: 0}, {
        complete: () => {
          this.loadingWord.textContent = this.words[this.flkty.selectedIndex]
          this.questionEl.textContent = this.questions[this.flkty.selectedIndex]
          
          Velocity(this.loadingWord, {opacity: 1}, {
            complete: () => {
              setTimeout( () => {
                Velocity(this.loadingWord, {opacity: 0.2})
                setTimeout(() => {
                  Velocity(this.questionEl, {opacity: 1}, {
                    complete: () => {
                      setTimeout(() => {
                        startInterval.call(this)
                      }, 4000)
                    }
                  })  
                }, 600)
                
              }, 1000)
              
            }
          })
        }
      })
                        
    }
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