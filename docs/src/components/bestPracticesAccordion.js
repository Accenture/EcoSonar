import React, { useState } from 'react'
import { Markup } from 'interweave'
import PropTypes from 'prop-types'
import ArrowBtnClose from '../images/Icon/ArrowBtnClose.svg'
import ArrowBtnOpen from '../images/Icon/ArrowBtnOpen.svg'

export default function BestPracticesAccordion (props) {
  const { index, title, icon, description, correction } = props
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
    <div aria-label='show content of the best practice' key={index} className='arrow-btn-acc accordion practice-accordion' role='region' >
      <div className='title-part' key={index} >
        <div className={`accordion-title ${isOpen ? 'open' : 'close'}`} onClick={switchAccordionState} onKeyDown={SwitchOnKeyDown} role='button' aria-expanded={isOpen} aria-controls={`${title}-accordion-content`} tabIndex={0}>
          <div className='accordion-first-div'>
            <img src={icon} alt='' className='icon'/>
            <p className={`audits-title  ${isOpen && 'color-title-acc-opened'}`}>{title}</p>
          </div>
          <img className='icon-acc' src={isOpen ? ArrowBtnClose : ArrowBtnOpen} alt={`${isOpen ? 'close' : 'open'} accordion of lighthouse performance best practice`} />
        </div>
        {(isOpen) && (
          <div className='content margin-content' aria-hidden={!isOpen} id={`${title}-accordion-content`}>
            <hr className='divider' />
            <div className='color'>
              <p>{description}</p>
              <Markup content={correction} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

BestPracticesAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  correction: PropTypes.string.isRequired
}
