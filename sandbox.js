// const blocks = {
//   context: null,
//   frame$: frame$(),
//   canvas: d3.select('main')
//     .append('canvas')
//     .attr('id', 'blocksCanvas')
//     .attr('width', window.innerWidth)
//     .attr('height', window.innerHeight)
//     .node(),

//   host: d3.select("body").append("custom:sketch")
//     .attr("width", window.innerWidth)
//     .attr("height", window.innerHeight),
    
//   modifyHost: function() {
        
//     blocks.host.selectAll('rect')
//       .data(fitBlocksToScreen)
//       .enter()
//       .append('custom:rect')
//       .attr('x', (d, i) => {
//         // console.log(d[i].x, d[i].y)
//         return d[i].x
//       })      
//       .attr('y', (d, i) => d[i].y)
//       .attr('width', 100)
//       .attr('height', 100)
//       .attr('fill', 'blue')

//     function fitBlocksToScreen() {
//       const columns = window.innerWidth / 100 + 1
//       const rows = window.innerHeight / 100 + 1
      
//       return d3.range(rows).map(r => {

//         return d3.range(columns).map(c => {
//           console.log(c, r)
//           return {
//             x: c * 100,
//             y: r * 100
//           }
//         })
        
//       })
//     }
    
//     // fitBlocksToScreen().forEach(d => console.log(d))


//     d3.select(window).on("mousemove", function() {        
//       // blocks.host.append("custom:circle")
//       //   .attr("x", d3.event.clientX)
//       //   .attr("y", d3.event.clientY)
//       //   .attr("radius", 0)
//       //   .attr("strokeStyle", "red")
//       //   .transition()
//       //     .duration(2000)
//       //     .ease(Math.sqrt)
//       //     .attr("radius", 200)
//       //     .attr("strokeStyle", "white")
//       //     .remove();
//     });    
//   },
    
//   draw: function() {    
//     const host = this.host[0][0], c = this.context       

//     for (var child = host.firstChild; child; child = child.nextSibling) {      
//       c.strokeStyle = child.getAttribute("strokeStyle")
//       c.beginPath()
//       // c.arc(child.getAttribute("x"), child.getAttribute("y"), child.getAttribute("radius"), 0, 2 * Math.PI)
//       c.rect(
//         child.getAttribute('x'),
//         child.getAttribute('y'),
//         child.getAttribute('width'),
//         child.getAttribute('height')
//       )      
      
//       c.fillStyle = child.getAttribute('fill')
      
      
//       c.fill()
//     }

//     // requestAnimationFrame(this.draw.bind(this))
//   }
// }

// // blocks.context = blocks.canvas.getContext('2d')
// // blocks.modifyHost()
// // blocks.draw()

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

// // blocks.frame$.subscribe(v => {
// //   const c = blocks.context
// //   // console.log(v)  
// //   c.clearRect(0, 0, window.innerWidth, window.innerHeight)
  
// //   c.beginPath()
  
// //   c.rect(0 + v, 50, 200, 200)
// //   c.fillStyle = 'red'
// //   c.fill()
  
// //   c.closePath()  
// // })




 