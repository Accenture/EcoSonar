import * as React from 'react'
import { Markup } from 'interweave'

export default function PopUpCorrection (props) {
  const { title, correction } = props
  React.useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDown)
    return function cleanup () {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  })

  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.setCorrectionPage(false)
    }
  }

  const handleCancelClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    event.currentTarget.blur()
    props.setCorrectionPage(false)
  }

  return (

    <div className="modal" onClick={handleCancelClick}
       id="dialog"
       role="dialog"
       aria-labelledby="Correcting of the best practice"
       aria-describedby="Correcting of the best practice"
       aria-modal="true"
       tabIndex="-1">
       <div className="correction-content" onClick={(e) => e.stopPropagation()} role="document">
           <div className="modal-header">
             <h2 className="correction-title">{title}</h2>
           </div>
           <div className='modal-body'>
             <div className='modal-body-title'>{title}</div>
             <div className='style-correction'>
             <Markup content={correction} />
           </div>
           </div>
         </div>
      </div>
  )
}
