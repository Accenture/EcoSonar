import React from 'react'
import format from '../../../format/format'
import RightArrow from '../../../images/RightArrow.svg'
import booleanMetrics from '../../../utils/booleanMetrics.json'
import PopUpCorrection from '../PopUpCorrection/PopUpCorrection'
import { setLetter } from '../../../format/setLetterService'

export default function AccordionTitle (props) {
  const {
    compliance,
    title,
    staticTitleData,
    staticTitleDataSuccess,
    auditedMetric,
    isActive,
    correction,
    score,
    tool,
    isFolded,
    unFoldAndChangeIsActive
  } = props

  const [correctionPage, setCorrectionPage] = React.useState(false)
  const CorrectionPageOpen = (e) => {
    e.stopPropagation()
    setCorrectionPage(true)
  }

  function displayData (titleAccordion, staticTitleDataAccordion, staticTitleDataSuccessAccordion, auditedMetricAccordion, scoreAccordion) {
    if (booleanMetrics.includes(titleAccordion) && scoreAccordion === 100) {
      return format(staticTitleDataSuccessAccordion, 0)
    } else {
      return format(staticTitleDataAccordion, auditedMetricAccordion)
    }
  }

  function switchOnKeyDown (e) {
    if (e.type === 'keydown') {
      unFoldAndChangeIsActive()
    }
  }

  return (
    <div
      className='accordion-toggle'
      onClick={() => {
        unFoldAndChangeIsActive()
      }}
      onKeyDown={switchOnKeyDown}
      role='button'
      aria-expanded={isFolded}
      aria-controls={`${title}-accordion-content`}
      tabIndex={0}
    >
      <div className="accordion-title">
        <div className="accordion-left">
          {setLetter(compliance)}
          <p className='title'>{title}</p>
          <button className="button-pop-up" onClick={(e) => CorrectionPageOpen(e)} aria-expanded={correctionPage}>How to solve it?</button>
          {correctionPage && (
            <PopUpCorrection
              title={title}
              correction={correction}
              setCorrectionPage={setCorrectionPage}
              tool = {tool}
            />
          )}
        </div>
        <div className="accordion-right">
          <p className='important-data'>{displayData(title, staticTitleData, staticTitleDataSuccess, auditedMetric, score)}</p>
          <p className='tool-title'><b>{tool}</b></p>
          <img src={RightArrow} alt="" className={isActive ? 'active right-arrow' : 'right-arrow'} />
        </div>
      </div>
    </div>
  )
}
