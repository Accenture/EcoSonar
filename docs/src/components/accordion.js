import React, { useState } from 'react'
import PropTypes from 'prop-types'
import ArrowBtnClose from '../images/Icon/ArrowBtnClose.svg'
import ArrowBtnOpen from '../images/Icon/ArrowBtnOpen.svg'

export default function Accordion (props) {
  const { icon, title, ariaLabel, content } = props
  const [isOpen, setIsOpen] = useState(false)

  function switchAccordionState () {
    setIsOpen(!isOpen)
  }

  function SwitchOnKeyDown (e) {
    if (e.type === 'keydown') {
      switchAccordionState()
    }
  }

  return (
    <div className='accordion' aria-label={ariaLabel} role='region' >
      <div className='accordion-title' onClick={switchAccordionState} onKeyDown={SwitchOnKeyDown} role='button' aria-expanded={isOpen} aria-controls={`${title}-accordion-content`} tabIndex={0}>
        <div className='accordion-first-div'>
          <img src={icon} alt='' className='audits-img' />
          <p className='audits-title'>{title}</p>
        </div>
        <img className='icon-acc' src={isOpen ? ArrowBtnClose : ArrowBtnOpen} alt={`${isOpen ? 'close' : 'open'} ${title} explanation`} />
      </div>
      {isOpen && (
        <div className='content' aria-hidden={!isOpen} id={`${title}-accordion-content`}>
          <hr className='divider' />
          <div className='accordion-text'>
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

Accordion.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired
}
