import {Observable} from 'rxjs'
// import {frame$} from './utils.js'
import { FutureOf } from './future-of.js'
import { CoreValues } from './core-values.js'
import { OurUniversity } from './our-university.js'
import { OurPeople } from './our-people.js'

export let app = {}

window.addEventListener('DOMContentLoaded', init)

function init() {   

  app.componentConstructors = {
    0: FutureOf,
    1: CoreValues,
    2: OurUniversity,
    3: OurPeople
  }

  app.componentInstances = {
    0: null,
    1: null,
    2: null,
    3: null
  }

  if (!window.location.hash) {
    handleNav({
      direction: null,
      index: 0,
      lastActiveInstance: null
    })
  }
  
  const scroller = Observable.create(observer => {

    $('main').onepage_scroll({
      sectionContainer: 'section',    
      easing: 'ease',                 
      animationTime: 750,            
      pagination: true,               
      updateURL: true,               
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
      direction: 'vertical'             
    });

  })

  scroller.debounceTime(100).subscribe(e => handleNav(e))

  function handleNav(e) {
    if (e.lastActiveInstance && e.lastActiveInstance.sleep) {
      e.lastActiveInstance.sleep.call(e.lastActiveInstance)
    }

    app.activeScrollIndex = e.index
    app.ActiveInstance = app.componentInstances[ app.activeScrollIndex ]

    const instance = app.componentInstances[e.index]

    if (!instance && app.componentConstructors[e.index]) {
      app.ActiveInstance = new app.componentConstructors[e.index]()
    } else if (instance && instance.awake) {
      instance.awake.call(instance)
    }    
      
  } 
}



