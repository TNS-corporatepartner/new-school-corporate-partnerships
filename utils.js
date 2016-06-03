export function frame$(increment = 1, reversed = false, startCount = 0, maxCount = 100) {
  return Observable.create(observer => {             
          
    (function getFrame(c) {     
      window.requestAnimationFrame( () => {

        if (reversed && c > startCount) {
          observer.next(c -= increment)
          reversed = c.toFixed(0) == startCount ? false : true
        } else if (!reversed && c < maxCount) {
          observer.next(c += increment)
          reversed = c.toFixed(0) == maxCount ? true : false
        }
        
        getFrame(c)
      })
    })(reversed ? maxCount : startCount)
     
  })
}   