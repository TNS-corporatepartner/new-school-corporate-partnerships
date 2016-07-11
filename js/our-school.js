import Flickity from 'flickity'

export class OurSchool {

  constructor() {
    this.section = document.getElementById('ourSchool')
    this.sectionInto = this.section.querySelector('.section-intro')
    this.paragraphIntro = this.section.querySelector('.intro-paragraph')

    setTimeout(() => {
      $(this.sectionInto).addClass('hidden')
    }, 1600)

    $('.school').on('mouseenter', function(e) {
      $(this).siblings().addClass('not-hover');
    })

    $('.school').on('mouseleave', function(e) {
      $(this).siblings().removeClass('not-hover');
    })

    $('.school').on('click', function(e) {
      e.stopPropagation()
      const r = this.querySelector('.img-container').getBoundingClientRect()
      const section = document.getElementById('ourSchool')
      const modal = document.getElementById('schoolModal')
      const modalContent = modal.querySelector('.content')
      const modalImg = modalContent.querySelector('.img-container')
      const modalText = modalContent.querySelector('.text-container')


      const openState = {
        top: '30%',
        left: 0,
        width: '100%',
        height: '40%',
        opacity: 1
      }

      $('body').addClass('school-modal-open')

      modalContent.querySelector('.school-name').textContent = $(this).data('name')
      modalContent.querySelector('.school-description').textContent = $(this).data('description')
      modalContent.querySelector('.img-container').style = `background-image: url(${ $(this).data('image-src') }`

      const startPos = {
          top: r.top,
          bottom: r.bottom,
          left: r.left,
          width: r.width,
          height: r.height,
          opacity: 0
        }

      Velocity(modal, startPos, {
        duration: 0,
        display: 'flex',
        complete: function() {
          Velocity(modal, {
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 1
          }, {
            duration: 600,
            complete: function() {
              Velocity(modalContent, {
                opacity: 1
              }, {
                display: 'flex'
              })
            }
          })
        }
      })


      $('#ourSchool').one('click', (e) => {
        e.stopPropagation()

        $('body').removeClass('school-modal-open')

        Velocity(modalContent, {
          opacity: 0
        }, {
          display: 'none',
          complete: function() {
            Velocity(modal, startPos)
          }
        })
      })
    })
  }

}
