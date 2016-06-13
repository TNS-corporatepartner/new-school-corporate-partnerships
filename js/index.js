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
  let splashContent$ = null, initSplash = true
  var fixedLogo = document.getElementById('fixedLogo')
  var fixedLogoText = document.getElementById('fixedLogoText')
  var introText = document.getElementById('introText')
  var introBg = document.getElementById('introBg')
  var line1 = document.getElementById('svgLine1')
  var line2 = document.getElementById('svgLine2')

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

  scroller.debounceTime(700).subscribe(e => handleNav(e))

  function handleNav(e) {                
    //handle nav fired before splash animation completes
    if (splashContent$ && !splashContent$.isUnsubscribed) {       
      splashContent$.complete()
      splashContent$.unsubscribe()
      skipSplashAnimation()
      loadComponent(e.index - 1)      
      $('main').moveUp()

    //handle nav normally
    } else if (splashContent$) {       

      if (e.lastActiveInstance && e.lastActiveInstance.sleep) {
        e.lastActiveInstance.sleep.call(e.lastActiveInstance)
      }

      loadComponent(e.index)
    
    //handle nav before splash animation initialized
    } else if (initSplash) {           
      splashContent$ = initSplashContent().subscribe( () => {        
        loadComponent(e.index)
        splashContent$.complete()
        splashContent$.unsubscribe()
      }, err => console.error(err), () => initSplash = false)
    }

    function loadComponent(index) { 
      console.log(index)     
      app.activeScrollIndex = index
      app.activeInstance = app.componentInstances[ index ]

      if (!app.activeInstance && app.componentConstructors[index]) {
        const instance = new app.componentConstructors[index]()
        app.activeInstance = instance
        app.componentInstances[ index ] = instance
      } else if (app.activeInstance && app.activeInstance.awake) {
        app.activeInstance.awake.call(app.activeInstance)
      }      
    }
  }   


  function initSplashContent() {      
    return Observable.create(obs => {
      //logo animate in
      Velocity(line1, {x1: 4.501, y1: 64.81, x2: 109.524, y2: 64.81}, {duration: 500})
      Velocity(line2, {x1: 4.501, y1: 70.5, x2: 109.524, y2: 70.5}, {duration: 500})
      Velocity(fixedLogoText, {translateX: 0, translateY: 0}, {duration: 2000})

      //logo animate down
      Velocity(fixedLogo, {
        top: window.innerHeight - 100,
        width: 120
      }, {
        duration: 1000,
        delay: 1500
      })

      //intro text animate in
      Velocity(introText, {opacity: 1}, {
        duration: 1000,
        delay: 2000,
        complete: () => {
          setTimeout(() => {
            Velocity(introText, {opacity: 0}, {duration: 400})
          }, 3000)
        }
      })

      //intro red-background animate to corner
      Velocity(introBg, {
        width: '120px',
        height: '52px'
      }, {
        duration: 800,
        delay: 6500
      })

      setTimeout(() => {
        obs.next()
      }, 7300)
    })    
  }
}

function skipSplashAnimation() {  
  Velocity(introText, 'stop')            
  Velocity(introText, {opacity: 0}, {duration: 200})      
  
  Velocity(introBg, 'stop')
  Velocity(introBg, {
    width: '120px',
    height: '52px'
  }, {
    duration: 800
  })

  Velocity(fixedLogoText, 'stop')
  Velocity(fixedLogoText, {translateX: 0, translateY: 0}, {duration: 2000})
  
  Velocity(fixedLogo, 'stop')
  Velocity(fixedLogo, {
    top: window.innerHeight - 100,
    width: 120
  }, {
    duration: 800
  })        
}


