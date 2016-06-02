import 'd3'
import { frame$ } from './utils'


export class Canvas {
  constructor(opts) {
    this.canvas = d3.select(opts.canvasParentSelector)
      .insert('canvas', ':first-child')
      .attr('id', 'blocksCanvas')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight)
      .node()
      
    this.context = this.canvas.getContext('2d')    
    
    this.host = d3.select('body')
      .append('custom:sketch')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight)
    
    this.hostChanges() 
    this.draw()  

  }
  
  // hostChanges() {
  //   // var test = [ [0, 0], [100, 0], [200, 0] ]    
  //   // var test = [ d3.entries({x: 0, y: 0}), d3.entries({x: 100, y: 0}), d3.entries({x: 200, y: 0}) ]
    
    

    
  //   function makeGrid(cols, row) {
  //     return function makeRows(y) {
        
  //     }
      
      
  //     function makeRow(y) {
  //       return d3.range(10).map(d => [d, y])
  //     }
  //     function makeCol(x) {
  //       return d3.range(x).map(d => [d, y])
  //     }
  //   }
    
  //   var test = makeRow(0)     
    
  //   console.log(fitBlocksToScreen())
  //   console.log(test)
        
        
  //   this.host.selectAll('rect')
  //     // .data(fitBlocksToScreen)
  //     .data( test, d => d[0] )
  //     .enter()
  //     .append('custom:rect')
  //     .attr('x', function(d, i) {
  //       console.log(d)                
  //       return d
  //     })      
  //     .attr('y', function(d, i) {
  //       return d
  //     })
  //     .attr('width', 100)
  //     .attr('height', 100)
  //     .attr('fill', 'blue')

  //   function fitBlocksToScreen() {
  //     const columns = window.innerWidth / 100 + 1
  //     const rows = window.innerHeight / 100 + 1
      
  //     return d3.range(rows).map(r => {
        
  //       // return d3.range(columns).
                
  //       return d3.range(columns).map(c => {
  //         return {
  //           x: r * 100,
  //           y: c * 100
  //         }
          
  //       })
    
  //     })
  //   }

  //   // fitBlocksToScreen().forEach(d => console.log(d))    
  // }
  
  
  draw() {    
    const host = this.host[0][0], c = this.context       

    for (var child = host.firstChild; child; child = child.nextSibling) {      
      c.strokeStyle = child.getAttribute('strokeStyle')            
      c.beginPath()

      c.rect(
        child.getAttribute('x'),
        child.getAttribute('y'),
        child.getAttribute('width'),
        child.getAttribute('height')
      )      
      
      // c.fillStyle = child.getAttribute('fill')            
      // c.fill()
      c.stroke()
    }

    requestAnimationFrame(this.draw.bind(this))
  }
  
  
  hostChanges() {
    d3.select(this.canvas).on('mousemove', () => {        
      this.host.append('custom:circle')
        .attr('x', d3.event.clientX)
        .attr('y', d3.event.clientY)
        .attr('radius', 0)
        .attr('strokeStyle', 'red')
        .transition()
          .duration(2000)
          .ease(Math.sqrt)
          .attr('radius', 200)
          .attr('strokeStyle', 'white')
          .remove();
    });
  }
  
  draw() {
    const host = this.host[0][0], c = this.context       

    for (var child = host.firstChild; child; child = child.nextSibling) {      
      c.strokeStyle = child.getAttribute('strokeStyle')            
      c.beginPath()
      c.arc(child.getAttribute('x'), child.getAttribute('y'), child.getAttribute('radius'), 0, 2 * Math.PI)
      c.stroke()
    }

    requestAnimationFrame(this.draw.bind(this))    
  }  

}











// // d3.select('svg').selectAll('rect').data(d3.range(2000).map(d => d)).enter()
// //   // .append('div').text(d => d)
// //   .append('rect')
// //   .attr('x', d => d * 100)
// //   .attr('y', 20)
// //   .attr('width', 100)
// //   .attr('height', 100)
// //   .attr('fill', 'blue')  

// // Observable.fromEvent(window, 'scroll').subscribe(v => {
// //   console.log(window.scrollY)  
// // })

// // this.frame$.subscribe(v => {
// //   const c = this.context
// //   // console.log(v)  
// //   c.clearRect(0, 0, window.innerWidth, window.innerHeight)
  
// //   c.beginPath()
  
// //   c.rect(0 + v, 50, 200, 200)
// //   c.fillStyle = 'red'
// //   c.fill()
  
// //   c.closePath()  
// // })
