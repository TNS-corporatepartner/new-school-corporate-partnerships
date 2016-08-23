import '../scss/styles.scss'

import './modernizr.js'
import Velocity from 'velocity-animate'
import $ from 'jquery'
import 'fullpage.js'

import {Observable} from 'rxjs'
import {Intro} from './intro.js'
import { FutureOf } from './future-of.js'
import { CoreValues } from './core-values.js'
import { OurSchool } from './our-school.js'
import { OurPeople } from './our-people.js'
import { OurApproach } from './our-approach.js'
import { ContactUs } from './contact-us.js'

export let app = {
  breakpoints: {
    $breakLaptop15: 1440,
    $breakLaptop13: 1280,
    $breakTablet: 1024,
    $breakMobile: 800
  },
  variables: {
    $red: '#E82E21',
    $grayDarker: '#222'
  },
  constructors: {
    1: Intro,
    2: FutureOf,
    3: CoreValues,
    4: OurSchool,
    5: OurApproach,
    6: OurPeople,
    7: ContactUs,
  },
  instances: {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null
  }
}

window.addEventListener('DOMContentLoaded', init)

function init() {
  let splashContent$ = null, initSplash = true
  var header = document.getElementById('header')
  var contactModal = document.getElementById('contactModal')
  var partnerBtn = header.querySelector('a')
  var introLogo = document.getElementById('introLogo')
  var introLogoText = document.getElementById('introLogoText')
  var introText = document.getElementById('introText')
  var introBg = document.getElementById('introBg')
  var line1 = document.getElementById('svgLine1')
  var line2 = document.getElementById('svgLine2')

  app.intro$ = initSplashContent().subscribe(
    () => console.log(null),
    err => console.error(err),
    () => { //executes when initSplashContent stream completes
      window.removeEventListener('click', skipSplashAnimation)
      window.removeEventListener('touchstart', skipSplashAnimation)
    
      var isIphone5 = platform.os.family === 'iOS' && window.screen.availWidth <= 320 && window.screen.availHeight <= 568 ? true : false

       $('main').fullpage({
        anchors:['intro', 'future', 'difference', 'schools', 'approach', 'people', 'partner','contact'],
        navigation: true,
        autoScrolling: isIphone5 ? false : true,
        touchSensitivity: 15,
        lockAnchors: true,
        afterRender: function() {
          if (!window.location.hash) {
            $.fn.fullpage.silentMoveTo('future', 1)
          } else {
            $.fn.fullpage.silentMoveTo(window.location.hash.slice(1), 1)
          }

          $('body').removeClass('intro-in-progress')

          //intro red-background animate to corner
          Velocity(introBg, {
            width: '140px',
            height: '62px'
          }, {
            duration: 800,
            display: 'none'
          })

          Velocity(introLogo, {opacity: 0}, {display: 'none', duration: 450})

          initGlobalStreams()
        },
        onLeave: function(index, nextIndex) {
          app.activeScrollIndex = nextIndex
          app.activeInstance.sleep && app.activeInstance.sleep()
        },
        afterLoad: function(anchorLink, index) {        
          if (app.constructors[index]){
            if (!app.instances[index] ) {
              app.instances[index] = new app.constructors[index]()              
              app.activeInstance = app.instances[index]
            } else {
              app.activeInstance = app.instances[index]
              app.instances[index].awake && app.instances[index].awake()
            }
          }

        }
      })
    }
  )


  app.showContactModal = function() {
    $.fn.fullpage.setAllowScrolling(false)

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
        $.fn.fullpage.setAllowScrolling(true)

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

      //logo animate in
      Velocity(line1, {x1: 4.501, y1: 64.81, x2: 109.524, y2: 64.81}, {duration: 500})
      Velocity(line2, {x1: 4.501, y1: 71.5, x2: 109.524, y2: 71.5}, {duration: 500})
      Velocity(introLogoText, {translateX: 0, translateY: 0}, {duration: 2000})

      //logo fades out
      Velocity(introLogo, {
        opacity: 0
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
              duration: 900,
              display: 'none'
            })
          }, 5000)
        }
      })

      setTimeout(() => {
        obs.complete()
      }, 10800)

      window.addEventListener('click', skipSplashAnimation)
      window.addEventListener('touchstart', skipSplashAnimation)
    })
  }
}

function skipSplashAnimation() {
  Velocity(introText, 'stop')
  Velocity(introText, {opacity: 0}, {
    duration: 200,
    display: 'none'
  })

  Velocity(introLogoText, 'stop')
  Velocity(introLogoText, {translateX: 0, translateY: 0}, {duration: 2000})

  Velocity(introLogo, 'stop')
  Velocity(introLogo, {
    opacity: 0
  }, {
    duration: 500
  })

  setTimeout(function() {
    app.intro$.complete()
  }, 300)
}


function initGlobalStreams() {
  $('#header, #header a').on('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    app.showContactModal()
  })

  $('.contact-btn').on('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    app.showContactModal()
  })

  $('.credits-btn').on('click', function(e) {
    $('#siteCredits').toggleClass('open');
  })

  $('#downArrow').on('click', function() {
    $.fn.fullpage.moveSectionDown()
  })


  var move$ = Observable.fromEvent(window, 'mousemove')

  var moveUp$ = move$
    .filter(e => e.clientY < window.innerHeight * 0.2 )
    .mapTo('up')

  var deadZone$ = move$
    .filter(e => e.clientY > window.innerHeight * 0.2 && e.clientY < window.innerHeight * 0.8)
    .mapTo('dead')

  var moveDown$ = move$
    .filter(e => e.clientY > window.innerHeight * 0.8 )
    .mapTo('down')

  var cursor$ = Observable.merge(moveUp$, moveDown$, deadZone$).publish()

  cursor$.subscribe( d => {
    if (app.activeScrollIndex == 1) {
      document.body.style.cursor = 'url(/images/next-cursor-black.svg), auto'
    } else if ('down' === d) {
      document.body.style.cursor = 'url(/images/click-cursor-red.svg), auto'
    } else if ('up' === d) {
      document.body.style.cursor = 'url(/images/prev-cursor-red.svg), auto'
    } else if ('dead' === d) {
      document.body.style.cursor = 'url(/images/arrow-cursor-red.svg), auto'
    }
  })

  var click$ = Observable
    .fromEvent(document, 'click')
    .withLatestFrom(cursor$)
    .subscribe(v => {
      const e = v[0]
      const d = v[1]

      app.intro$.complete()
      $('body').removeClass('partner-tray')

      if (app.activeScrollIndex == 1) {
        $.fn.fullpage.moveSectionDown()
      } else if ('up' === d) {
        $.fn.fullpage.moveSectionUp()
      }
    })

  cursor$.connect()
}
