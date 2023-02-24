import { Markup } from 'interweave'
import React, { useEffect } from 'react'

export default function PopUpCorrection (props) {
  const { title, correction, tool } = props

  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDown)
    return function cleanup () {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  })

  function closeOnEscapeKeyDown (e) {
    if ((e.charCode || e.keyCode) === 27) {
      props.setCorrectionPage(false)
    }
  }

  function handleCancelClick (event) {
    event.stopPropagation()
    event.preventDefault()
    event.currentTarget.blur()
    props.setCorrectionPage(false)
  }
  function checkTool (toolToCheck) {
    if (toolToCheck !== 'W3C validator') return title
  }

  return (
    <div
      className='modal'
      onClick={handleCancelClick}
      id='dialog'
      role='dialog'
      aria-labelledby='Correction of the best practice'
      aria-describedby='Correction of the best practice'
      aria-modal='true'
      aria-hidden='false'
      tabIndex='-1'
    >
      <div className='correction-content' onClick={(e) => e.stopPropagation()} role='document'>
        <div className='modal-header'>
          <h2 className='correction-title'>{title}</h2>
        </div>
        <div className='modal-body'>
          <p className='modal-body-title'>
            {checkTool(tool)}
          </p>
          <div className='style-correction'>
            <Markup content={correction} />
          </div>
        </div>
      </div>
    </div>
  )
}
