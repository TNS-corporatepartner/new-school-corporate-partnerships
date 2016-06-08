import Flickity from 'flickity'
import 'd3'

export class FutureOf {  
  
  constructor() {
    this.futureOfCells = document.querySelectorAll('.future-of-cell')
    this.activeFutureOfCellIndex = 0     
    this.imagineEl = document.querySelector('.future-of-header h1')
    this.futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
    this.loadingEl = document.querySelector('.shuffler')
    this.loadingWord = this.loadingEl.querySelector('h1')     
    this.questionEl = document.querySelector('.question')  
    this.slider = document.querySelector('.future-of-slider')

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

    this.shufflerConfig = {
      limit: 26,
      count: 0,
      index: 0,
      words: ['The Workforce', 'Sustainability', 'Research & Development', 'Big Data']   
    }     
    
    this.flkty = new Flickity( this.slider, {
      cellAlign: 'left',
      contain: true,
      wrapAround: true
    })  

    this.initSplashContent().then(() => {

      this.line1  
        .transition()
        .duration(1000)
        .attr('x2', '100%')

      this.line2        
        .transition()
        .duration(1000)
        .attr('x2', '20%')

      this.svgTextEl      
        .transition()
        .duration(1000)
        .attr('y', 71)


      this.fixedLogo
        .transition()
        .duration(1000)
        .attr('transform', 'translate(0, 11)')

      setTimeout(() => {
        this.svgTextEl      
          .transition()
          .duration(1000)
          .attr('y', -150)

        this.fixedLogo
          .transition()
          .duration(1000)
          .attr('transform', 'translate(0, 86)')
        
        setTimeout(() => {
          this.line1  
            .transition()
            .duration(800)
            .attr('x2', '0%')

          this.line2        
            .transition()
            .duration(800)
            .attr('x2', '0%')

          this.introSvg
            .transition()
            .duration(1200)
            .attr('width', '120px')
            .attr('height', '52px')                      
        }, 600)

        this.playVideos()

      }, 2000)
    })



    // window.addEventListener('resize', () => {
    //   console.log(this.introSvg)
    //   this.introSvg
    //     .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
    //     .attr('width', window.innerWidth + 'px')
    //     .attr('height', window.innerHeight + 'px')        

    //   // this.redRect      
    //   //   .attr('width', window.innerWidth)
    //   //   .attr('height', window.innerHeight)
    // })
  }

  initSplashContent() {
    var paddingLR = (window.innerWidth * 0.10).toFixed(0)
    var contentWidth = (window.innerWidth * 0.80).toFixed(0)
    var midY = parseInt( (window.innerHeight / 2).toFixed(0) )
    var lineY = parseInt( (window.innerHeight / 2).toFixed(0) )

    return new Promise(resolve => {

      d3.xml('/images/tns-logo.svg', 'image/svg+xml', (error, xml) => {
        if (error) throw error;            

        this.introSvg = d3.select('#futureOf')
          .append('svg')
            .attr('id', 'redRect')
            .attr('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
            .attr('preserveAspectRatio', 'xMidYMid slice')
            .attr('width', window.innerWidth + 'px')
            .attr('height', window.innerHeight + 'px')
            .style('position', 'absolute')      
            .style('top', 0)      

        this.redRect = this.introSvg.append('rect')      
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', window.innerWidth + 'px')
          .attr('height', window.innerHeight + 'px')
          .attr('fill', 'red')

        this.redRectContent = this.introSvg.append('svg')
          .attr('id', '#redRectContent')
          .attr('x', paddingLR)
          .attr('y', midY)
          .attr('width', '80%')

        this.redRectContent[0][0].appendChild(xml.documentElement)
        this.fixedLogo = d3.select('#fixedLogo')
          .select('#Page-1')
          .attr('transform', 'translate(0, 75)')          
          
      
        this.redRectContent.append('clipPath')
          .attr('id', 'clip1')
          .append('rect')
            .attr('x', 0)
            .attr('y', 87)
            .attr('height', 150)
            .attr('width', '100%')

        /** DEBUG **/
        // this.redRectContent.append('rect')
        //   .attr('stroke', 'yellow')
        //   .attr('fill', 'none')      
        //   .attr('x', 0)
        //   .attr('y', 87)
        //   .attr('height', 150)
        //   .attr('width', '100%') 
        /** END DEBUG **/

        this.svgTextEl = this.redRectContent.append('text')
          .attr('clip-path', 'url(#clip1)')
          .attr('x', '20%')
          .attr('y', -75)
          .attr('fill', 'white')
          .attr('font-size', 70)        

        this.svgTextEl.append('tspan').attr('x', '20%').attr('dy', '1.05em').style('font-family', 'Neue')    .text('Corporate')
        this.svgTextEl.append('tspan').attr('x', '20%').attr('dy', '1.05em').style('font-family', 'Neue')    .text('Partnerships')    

        this.line1 = this.redRectContent
          .append('line')
            .attr('stroke-width', '5px')
            .attr('stroke', 'white')
            .attr('x1', 0)
            .attr('y1', 79)
            .attr('x2', 0)
            .attr('y2', 79)

        this.line2 = this.redRectContent
          .append('line')
            .attr('stroke-width', '5px')
            .attr('stroke', 'white')
            .attr('x1', 0)
            .attr('y1', 89)
            .attr('x2', 0)
            .attr('y2', 89)
      
        resolve()
      })

    })

  }

  playVideos() {
    $('.future-of-slider video').each(function(i, video) {
      video.play()
    })
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


    // $('video').each(function(i, vid) {
    //   vid.play()
    // }) 
           
            
    // Velocity(this.imagineEl, {opacity: 1}, {
    //   duration: 1200, display: 'block',
    //   complete: () => {
    //     Velocity(this.futureOfEl, {opacity: 1}, {
    //       duration: 800,
    //       display: 'block',
    //       complete: () => {
    //         this.shuffler(shufflerConfig).then( () => {
              
    //           setTimeout(() => {
    //             Velocity(this.imagineEl, {opacity: 0.2})
    //             Velocity(this.futureOfEl, {opacity: 0.2}, {
    //               complete: () => showQuestion.call(this) 
    //             })
    //             Velocity(this.loadingWord, {opacity: 0.2})                
    //           }, 1000)

    //         })
    //       }
    //     })
    //   }
    // })     



    // $('video').each(function(i, vid) {
    //   vid.play()
    // }) 
           
            
    // Velocity(this.imagineEl, {opacity: 1}, {
    //   duration: 1200, display: 'block',
    //   complete: () => {
    //     Velocity(this.futureOfEl, {opacity: 1}, {
    //       duration: 800,
    //       display: 'block',
    //       complete: () => {
    //         this.shuffler(shufflerConfig).then( () => {
              
    //           setTimeout(() => {
    //             Velocity(this.imagineEl, {opacity: 0.2})
    //             Velocity(this.futureOfEl, {opacity: 0.2}, {
    //               complete: () => showQuestion.call(this) 
    //             })
    //             Velocity(this.loadingWord, {opacity: 0.2})                
    //           }, 1000)

    //         })
    //       }
    //     })
    //   }
    // })




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