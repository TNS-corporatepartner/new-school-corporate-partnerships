import {Observable} from 'rxjs'
// import {frame$} from './utils.js'
import { FutureOf } from './future-of.js'
import { CoreValues } from './core-values.js'
import { OurUniversity } from './our-university.js'
import { OurPeople } from './our-people.js'
import { ContactUs } from './contact-us.js'

export let app = {}

window.addEventListener('DOMContentLoaded', init)

function init() {   

  app.componentConstructors = {
    0: FutureOf,
    1: CoreValues,
    2: OurUniversity,
    3: OurPeople,
    4: ContactUs
  }

  app.componentInstances = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null
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
          lastActiveInstance: app.activeInstance
        })
      }, 
      afterMove: function(index) {},  
      loop: false,                    
      keyboard: true,                 
      responsiveFallback: false,                        
      direction: 'vertical'             
    });

  })

  if (!window.location.hash || window.location.hash === '#1') {
    handleNav({
      direction: null,
      index: 0,
      lastActiveInstance: null
    })
  }

  scroller.debounceTime(100).subscribe(e => handleNav(e))

  function handleNav(e) {
    if (e.lastActiveInstance && e.lastActiveInstance.sleep) {
      e.lastActiveInstance.sleep.call(e.lastActiveInstance)
    }

    app.activeScrollIndex = e.index
    app.activeInstance = app.componentInstances[ e.index ]


    if (!app.activeInstance && app.componentConstructors[e.index]) {
      const instance = new app.componentConstructors[e.index]()
      app.activeInstance = instance
      app.componentInstances[ e.index ] = instance
    } else if (app.activeInstance && app.activeInstance.awake) {
      app.activeInstance.awake.call(app.activeInstance)
    }   
      
  } 
}



