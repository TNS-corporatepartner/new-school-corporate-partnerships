import Flickity from 'flickity'

export class OurSchool {

  constructor() {
    this.section = document.getElementById('ourSchool')
    this.sectionInto = this.section.querySelector('.section-intro')
    this.paragraphIntro = this.section.querySelector('.intro-paragraph')
    this.schoolLinks = this.section.querySelectorAll('.school') 

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1200)

    // setTimeout(() => {
      $(this.paragraphIntro).addClass('hidden')
    // }, 3000)
  
    $(this.schoolLinks).on('click', function(e) {
      e.stopPropagation()
      const r = this.querySelector('img').getBoundingClientRect()
      const section = document.getElementById('ourSchool')
      const modal = document.getElementById('schoolModal')
      const modalWrapper = modal.querySelector('.content-wrap')      
      const modalContent = modal.querySelector('.content')

      const closedState = {
        top: r.top,
        bottom: r.bottom,
        left: r.left,
        width: r.width,
        height: r.height,
        opacity: 0
      }

      const openState = {
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 1
      }

      $('body').addClass('school-modal-open')
      $(modal).css(closedState)

      const schoolName = 'Parsons'
      const schoolDescription = 'One of the world\'s leading art and design schools. Offers an enlightened approach to design education and sustainability.'

      modalWrapper.style.backgroundImage = 'url(/images/studentgroup.jpg)'
      Velocity(modalWrapper, {opacity: 1})
      Velocity(modal, openState, { duration: 500, easing: 'easeOutCubic', complete: function() {

        modalContent.innerHTML = `
          <h1>${schoolName}</h1>
          <p>${schoolDescription}</p>
          <br><span>Learn More &rarr;</span>
        `

        Velocity(modalContent, {opacity: 1})        
      }})


      $('#ourSchool').one('click', (e) => {
        e.stopPropagation()        
        $('body').removeClass('school-modal-open')

        Velocity(modalContent, {opacity: 0}, {
          complete: function() {
            Velocity(modalWrapper, { opacity: 0, easing: 'easeOutCubic' })      

            Velocity(modal, closedState, {
              duration: 500,
              complete: function() {
                modalContent.innerHTML = ''
                modal.style.backgroundImage = ''
              }
            })
          }
        })
      })
    })
  }

}
