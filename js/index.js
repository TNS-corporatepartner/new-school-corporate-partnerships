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

  var move$ = Observable.fromEvent(window, 'mousemove') 
  
  var moveUp$ = move$
    .filter(e => e.clientY < window.innerHeight / 2 )
    .mapTo('up')

  var moveDown$ = move$
    .filter(e => e.clientY >= window.innerHeight / 2 )
    .mapTo('down')

  var cursor$ = Observable.merge(moveUp$, moveDown$).publish()
  
  cursor$.subscribe( d => {
    if (d === 'up' && app.activeScrollIndex) {
      document.body.style.cursor = 'url(/images/prev-cursor.svg), auto'
    } else if (d === 'down' && app.activeScrollIndex !== 4) {
      document.body.style.cursor = 'url(/images/next-cursor.svg), auto'
    } else {
      document.body.style.cursor = 'auto'
    }
  })

  var click$ = Observable
    .fromEvent(document, 'click')
    .withLatestFrom(cursor$)
    .subscribe(v => {
      const event = v[0]
      const direction = v[1]

      if (direction === 'up' && app.activeScrollIndex !== 0) {
        $('main').moveUp()
      } else if (direction === 'down' && app.activeScrollIndex !== 4) {
        $('main').moveDown()
      }
    })

  cursor$.connect()

  scroller.debounceTime(700).subscribe(e => handleNav(e))

  function handleNav(e) {
    //handle nav fired before splash animation completes
    if (splashContent$ && !splashContent$.isUnsubscribed) {
      splashContent$.complete()
      splashContent$.unsubscribe()
      skipSplashAnimation()
      loadComponent(e.index - 1)

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
        delay: 2500
      })

      //intro text animate in
      Velocity(introText, {opacity: 1}, {
        duration: 1000,
        delay: 3300,
        complete: () => {
          setTimeout(() => {
            Velocity(introText, {opacity: 0}, {
              duration: 500,
              display: 'none'
            })
          }, 3000)
        }
      })

      //intro red-background animate to corner
      Velocity(introBg, {
        width: '140px',
        height: '62px'
      }, {
        duration: 800,
        delay: 8000
      })

      setTimeout(() => {
        obs.next()
      }, 8800)
    })
  }
}

function skipSplashAnimation() {
  Velocity(introText, 'stop')
  Velocity(introText, {opacity: 0}, {
    duration: 200,
    display: 'none'
  })

  Velocity(introBg, 'stop')
  Velocity(introBg, {
    width: '140px',
    height: '62px'
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
