import React, { useEffect, useState } from 'react'
import AccordionDescription from './AccordionDescription'
import AccordionDescriptionLighthouse from './AccordionDescriptionLighthouse'
import AccordionTitle from './AccordionTitle'

export default function AccordionItem (props) {
  const { practice, staticData, isFolded, setIsFolded, practiceType, index } = props
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (isFolded) setIsActive(false)
  }, [isFolded])
  function unFoldAndChangeIsActive () {
    setIsActive(!isActive)
    if (isFolded) setIsFolded(false)
  }

  function switchOnKeyDown (e) {
    if (e.type === 'keydown') {
      unFoldAndChangeIsActive()
    }
  }

  return (
    <li className='accordion-item'>
      <div
        className='accordion-toggle'
        onClick={() => {
          unFoldAndChangeIsActive()
        }}
        onKeyDown={switchOnKeyDown}
        role='button'
        aria-expanded={isFolded}
        aria-controls={`${staticData.title}-accordion-content`}
        tabIndex={index}
      >
        <AccordionTitle
          compliance={practice.compliance}
          title={staticData.title}
          staticTitleData={staticData.titleData}
          auditedMetric={practice.auditedMetric}
          isActive={isActive}
          correction={staticData.correction}
        />
      </div>
      {!isFolded && isActive && (
        <div className='accordion-content' aria-hidden={!isFolded} id={`${staticData.title}-accordion-content`}>
          <div className='description'>{staticData.description}</div>
          {!!practice.description && practiceType === 'greenit' && <AccordionDescription descriptions={practice.description} />}
          {!!practice.description && practiceType === 'performance' && <AccordionDescriptionLighthouse descriptions={practice.description} />}
          {!!practice.description && practiceType === 'accessibility' && <AccordionDescriptionLighthouse descriptions={practice.description} />}
        </div>
      )}
    </li>
  )
}
