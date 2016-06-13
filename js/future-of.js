import {app} from './index.js'
import Flickity from 'flickity'
import 'd3'

export class FutureOf {  
  
  constructor() {
    this.section = document.querySelector('#futureOf') 
    this.imagineEl = document.querySelector('.future-of-header h1')
    this.futureOfEl = document.querySelectorAll('.future-of-header h1')[1]
    this.loadingEl = document.querySelector('.shuffler')
    this.loadingWord = this.loadingEl.querySelector('h1')     
    this.questionEl = document.querySelector('.question')  
    this.slider = document.querySelector('.future-of-slider')

    this.questions = [
      'How can data be human?',
      'How is the gamification of learning reshaping the workforce?'
    ]

    this.words = [
      'Big Data',
      'Learning & Development'
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
      wrapAround: true,
      autoPlay: false
    })  

    var introText = document.getElementById('introText')

    if (!app.componentInstances || !app.componentInstances[0]) {    
      this.initSplashContent()
      .then(() => {

        this.line1  
          .transition()
          .duration(1000)
          .attr('x2', '12%')

        this.line2        
          .transition()
          .duration(1000)
          .attr('x2', '12%')

        this.svgTextEl      
          .transition()
          .duration(1000)
          .attr('y', 71)

        this.fixedLogo
          .transition()
          .duration(1000)
          .attr('transform', 'translate(0, 11)')      

        setTimeout(() => {
          Velocity(introText, {opacity: 1}, {
            duration: 600
          })
        }, 1000)

        setTimeout(() => {
          Velocity(introText, {opacity: 0}, {
            duration: 400
          })
          
          this.redRectContent
            .transition()
            .duration(600)
            .attr('y', 610)
            
            this.line1  
              .transition()
              .duration(800)
              .attr('x2', '12%')

            this.line2        
              .transition()
              .duration(800)
              .attr('x2', '12%')

          setTimeout(() => {
            $('#footerLogo').css('opacity', 1)

            this.redRectContent
              .transition()
              .duration(1200)
              .attr('opacity', 0)      

            this.introSvg
              .transition()
              .duration(1200)
              .attr('width', '120px')
              .attr('height', '52px')                                    
          }, 600)

        }, 2000)


        // setTimeout(() => {
        //   this.svgTextEl      
        //     .transition()
        //     .duration(1000)
        //     .attr('y', -150)

        //   this.fixedLogo
        //     .transition()
        //     .duration(1000)
        //     .attr('transform', 'translate(0, 86)')
          
        //   setTimeout(() => {
        //     this.line1  
        //       .transition()
        //       .duration(800)
        //       .attr('x2', '0%')

        //     this.line2        
        //       .transition()
        //       .duration(800)
        //       .attr('x2', '0%')

        //     this.introSvg
        //       .transition()
        //       .duration(1200)
        //       .attr('width', '120px')
        //       .attr('height', '52px')

        //     this.initVideos()                      
        //   }, 600)        

        // }, 2000)
      })
    }
  }

  initSplashContent() {
    var paddingLR = (window.innerWidth * 0.10).toFixed(0)
    var contentWidth = (window.innerWidth * 0.80).toFixed(0)
    var midY = parseInt( (window.innerHeight / 2).toFixed(0) - 125 )
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
          .attr('fill', '#E82E21')

        this.redRectContent = this.introSvg.append('svg')
          .attr('id', '#redRectContent')
          .attr('x', 20)
          .attr('y', 20)
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


        this.svgTextEl = this.redRectContent.append('foreignObject')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 50)
          .attr('height', 50)
      
        this.svgTextEl.append('p').text('aldjsflkajsdflksj')

        // this.svgTextEl = this.redRectContent.append('text')
        //   .attr('clip-path', 'url(#clip1)')
        //   .attr('x', '20%')
        //   .attr('y', -75)
        //   .attr('fill', 'white')
        //   .attr('font-size', 70)        

        // this.svgTextEl.append('tspan').attr('x', '20%').attr('dy', '1.05em').style('font-family', 'Neue')    .text('Corporate')
        // this.svgTextEl.append('tspan').attr('x', '20%').attr('dy', '1.05em').style('font-family', 'Neue')    .text('Partnerships')    

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

  initVideos() {

    Velocity(this.imagineEl, {opacity: 1}, {
      duration: 1200, display: 'block',
      complete: () => {
        Velocity(this.futureOfEl, {opacity: 1}, {
          duration: 800,
          display: 'block',
          complete: () => {
            this.shuffler({
              limit: 26,
              count: 0,
              index: 0,
              words: ['The Workforce', 'Sustainability', 'Research & Development', 'Big Data']                   
            }).then(() => {
              const cell = this.flkty.cells[ this.flkty.selectedIndex ].element
              Velocity(cell, {opacity: 1})
              this.playCellSequence()
            })
          }
        })
      }
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
        }, 500)
      }, 4500)
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
  
  sleep() {
    $('body').removeClass('show-question')
    window.clearTimeout(this.sliderTimer)
    
  }

  awake() {
    const cell = this.flkty.cells[ this.flkty.selectedIndex ].element
    this.playCellSequence()
  }
}
