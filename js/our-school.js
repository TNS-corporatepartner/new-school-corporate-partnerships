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
      const r = this.querySelector('.img-container').getBoundingClientRect()
      const section = document.getElementById('ourSchool')
      const modalBg = document.getElementById('schoolModal')
      const modalContent = modalBg.querySelector('.content')      

      console.log(this.querySelector('.img-container'))

      

      const readyState = {
        top: r.top,
        bottom: r.bottom,
        left: r.left,
        width: r.width,
        height: r.height,
        opacity: 0
      }

      const openState = {
        top: '30%',
        left: 0,
        width: '100%',
        height: '40%',
        opacity: 1
      }


      $('body').addClass('school-modal-open')
      
      Velocity(modalContent, readyState, {
        duration: 0
      })
      
      // $(modalContent).css(readyState)
      
      const schoolName = 'Parsons'
      const schoolDescription = 'One of the world\'s leading art and design schools. Offers an enlightened approach to design education and sustainability.'
      const imgUrl = '/images/studentgroup.jpg'

      modalContent.innerHTML = `
        <div class="text-container">
          <h1>${schoolName}</h1>
          <p>${schoolDescription}</p>
          <a href="http://google.com" _target="blank"><span>Learn More &rarr;</a>
        </div>

        <div class="img-container">
          <img src="${imgUrl}" />
        </div>          
      `

      const modalImg = modalContent.querySelector('.img-container')      
      const modalText = modalContent.querySelector('.text-container')

      Velocity(modalImg, {width: '50%'}, {
        easing: 'easeOutCubic',
        duration: 800
      })

      Velocity(modalText, {width: '50%'}, {
         easing: 'easeOutCubic',
        duration: 800,
        complete: function() {
          Velocity(modalText, {opacity: 1})
        }
      })
    

      Velocity(modalContent, openState, { duration: 800, easing: 'easeOutCubic'})


      $('#ourSchool').one('click', (e) => {
        e.stopPropagation()        

        $('body').removeClass('school-modal-open')

        setTimeout(function() {
          Velocity(modalImg, 'reverse', {duration: 0})
          Velocity(modalText, 'reverse', {duration: 0})
          Velocity(modalContent, 'reverse', {duration: 0})          
        }, 500)
        
      })

    })
  }

}
