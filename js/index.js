import {Observable} from 'rxjs'
// import {frame$} from './utils.js'
import { FutureOf } from './future-of.js'
import { CoreValues } from './core-values.js'
import { OurUniversity } from './our-university.js'

export let app = {}

window.addEventListener('DOMContentLoaded', init)

function init() {   
  app.componentInstances = {
    0: new FutureOf,
    1: null,
    2: null
  }     

  app.componentConstructors = {
    0: FutureOf,
    1: CoreValues,
    2: OurUniversity
  }

  app.activeScrollIndex = 0
  app.ActiveInstance = app.componentInstances[ app.activeScrollIndex ]
  
  const scroller = Observable.create(observer => {

    $("main").onepage_scroll({
      sectionContainer: "section",    
      easing: "ease",                 
      animationTime: 750,            
      pagination: true,               
      updateURL: false,               
      beforeMove: (i) => {
        const index = i - 1        
        
        observer.next({
          direction: app.activeScrollIndex < index ? 'down' : 'up',
          index: index,
          lastActiveInstance: app.ActiveInstance
        })
      }, 
      afterMove: function(index) {},  
      loop: false,                    
      keyboard: true,                 
      responsiveFallback: false,                        
      direction: "vertical"             
    });

  })


  scroller.debounceTime(100).subscribe(e => {
    if (e.lastActiveInstance.sleep) {
      e.lastActiveInstance.sleep()
    }

    const instance = app.componentInstances[e.index]

    if (!instance) {
      app.ActiveInstance = new app.componentConstructors[e.index]()
    } else if (app.ActiveInstance.awake) {
      app.ActiveInstance.awake.call(app.ActiveInstance)
    }    

  }) 
}



