import {Observable} from 'rxjs'
import {Intro} from './intro.js'
import { FutureOf } from './future-of.js'
import { CoreValues } from './core-values.js'
import { OurSchool } from './our-school.js'
import { OurPeople } from './our-people.js'
import { OurApproach } from './our-approach.js'
import { ContactUs } from './contact-us.js'

export let app = {}

window.addEventListener('DOMContentLoaded', init)

function init() {
  let splashContent$ = null, initSplash = true
  var header = document.getElementById('header')
  var contactModal = document.getElementById('contactModal')
  var partnerBtn = header.querySelector('a')
  var fixedLogo = document.getElementById('fixedLogo')
  var fixedLogoText = document.getElementById('fixedLogoText')
  var introText = document.getElementById('introText')
  var introBg = document.getElementById('introBg')
  var line1 = document.getElementById('svgLine1')
  var line2 = document.getElementById('svgLine2')

  app.variables = {
    $red: '#E82E21',
    $grayDarker: '#222' 
  }

  app.constructors = {
    1: Intro,
    2: FutureOf,
    3: CoreValues,
    4: OurSchool,
    5: OurApproach,
    6: OurPeople,
    7: ContactUs
  }

  app.instances = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null
  } 

  $('main').fullpage({
    anchors:['intro', 'future', 'difference', 'schools', 'approach', 'people', 'partner'],
    navigation: true,
    onLeave: function(lastIndex, nextIndex, direction) {
      if (!app.instances[nextIndex]) {
        app.instances[nextIndex] = new app.constructors[nextIndex]()
      }

      app.activeScrollIndex = nextIndex
      app.activeInstance = app.instances[nextIndex]

    }
  })

  if (!window.location.hash) {
    $.fn.fullpage.silentMoveTo('future', 1)
  } else {
    $.fn.fullpage.silentMoveTo(window.location.hash.slice(1), 1)
  }
  
  $.fn.fullpage.setAllowScrolling(false)

  app.intro$ = initSplashContent().subscribe(
    () => console.log(null),
    err => console.error(err),
    () => {
      //executes when initSplashContent stream completes
      app.activeScrollIndex = 1
      app.instances[1] = new app.constructors[1]()
      app.activeInstance = app.instances[1]

      initGlobalStreams()
      $.fn.fullpage.setAllowScrolling(true)
      window.removeEventListener('click', skipSplashAnimation)
    }
  )


  app.showContactModal = function() {
    Velocity(header, {opacity: 0}, {
      duration: 125,
      complete: function() {
        Velocity(contactModal, {
          width: '100%',
          height: '100%',
          backgroundColor: app.variables.$grayDarker
        }, {
          duration: 500,
          display: 'flex',
          complete: function() {
            Velocity(contactModal.querySelector('.content'), {
              opacity: 1
            }, {
              display: 'flex'
            })

            $(contactModal).one('click', app.hideContactModal)
          }
        })
      }
    })
  }

  app.hideContactModal = function() {

    Velocity(contactModal.querySelector('.content'), {opacity: 0}, {
      display: 'none',
      complete: function() {
        Velocity(contactModal, {
          width: 140,
          height: 64,
          backgroundColor: app.variables.$red
        }, {
          duration: 450,
          display: 'none'
        })

        Velocity(header, {opacity: 1}, {duration: 200})                       
      }
    })    
  }

  function initSplashContent() {
    return Observable.create(obs => {

      $('body').addClass('intro-in-progress')      

      //logo animate in
      Velocity(line1, {x1: 4.501, y1: 64.81, x2: 109.524, y2: 64.81}, {duration: 500})
      Velocity(line2, {x1: 4.501, y1: 71.5, x2: 109.524, y2: 71.5}, {duration: 500})
      Velocity(fixedLogoText, {translateX: 0, translateY: 0}, {duration: 2000})

      //logo animate down
      Velocity(fixedLogo, {
        bottom: 20,
        width: 150
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

            setTimeout(function() {
              $('body').removeClass('intro-in-progress')
            }, 500)
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
        Velocity(introBg, { opacity: 0 }, { display: 'none' })
        obs.complete()
      }, 8800)

      window.addEventListener('click', skipSplashAnimation)
    })
  }
}

function skipSplashAnimation() {
  app.intro$.complete()

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
    width: 150
  }, {
    duration: 800
  })

  Velocity(introBg, { opacity: 0 }, { display: 'none' })
}


function initGlobalStreams() {
  $('#header, #header a').on('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    // $('body').addClass('partner-tray')
    app.showContactModal()
  })

  $('#partnerTray').on('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    $('body').removeClass('partner-tray')
  })

  var move$ = Observable.fromEvent(window, 'mousemove')

  var moveUp$ = move$
    .filter(e => e.clientY < window.innerHeight / 2 )
    .mapTo('up')

  var moveDown$ = move$
    .filter(e => e.clientY >= window.innerHeight / 2 )
    .mapTo('down')

  var cursor$ = Observable.merge(moveUp$, moveDown$).startWith('load').publish()

  cursor$.subscribe( d => {
    if (app.activeScrollIndex == 1) {
      document.body.style.cursor = 'url(/images/next-cursor-red.svg), auto'
    } else if (app.activeScrollIndex == 7) {
      document.body.style.cursor = 'url(/images/prev-cursor-red.svg), auto'
    } else if (d === 'up' ) {
      document.body.style.cursor = 'url(/images/prev-cursor-red.svg), auto'
    } else if (d === 'down') {
      document.body.style.cursor = 'url(/images/next-cursor-red.svg), auto'
    } else if (d === 'load') {
      document.body.style.cursor = 'url(/images/next-cursor-black.svg), auto'
    }
  })

  var click$ = Observable
    .fromEvent(document, 'click')
    .withLatestFrom(cursor$)
    .subscribe(v => {
      const event = v[0]
      const direction = v[1]

      app.intro$.complete()
      $('body').removeClass('partner-tray')

      if (app.activeScrollIndex == 1) {
        $.fn.fullpage.moveSectionDown();
      } else if (app.activeScrollIndex == 7) {
        $.fn.fullpage.moveSectionUp();
      } else if (direction === 'up') {
          $.fn.fullpage.moveSectionUp();
      } else if (direction === 'down') {
        $.fn.fullpage.moveSectionDown();
      }
    })

  cursor$.connect()
}
