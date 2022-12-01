import React, { useEffect, useState } from 'react'
import AccordionDescription from './AccordionDescription'
import AccordionDescriptionOtherTools from './AccordionDescriptionOtherTools'
import AccordionTitle from './AccordionTitle'

export default function AccordionItem (props) {
  const { practice, staticData, isFolded, setIsFolded, index } = props
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
          title= {staticData.title}
          content= {staticData.content}
          staticTitleData={staticData.titleData}
          compliance={practice.compliance}
          correction={staticData.correction}
          auditedMetric={practice.auditedMetric}
          tool={practice.tool}
          isActive={isActive}
        />
      </div>
      {!isFolded && isActive && (
        <div className='accordion-content' aria-hidden={!isFolded} id={`${staticData.title}-accordion-content`}>
          <div className='description'>{staticData.description}</div>
          {practice.description && practice.tool === 'GreenIT-Analysis' && <AccordionDescription descriptions={practice.description} />}
          {practice.description && practice.tool === 'Lighthouse Performance' && <AccordionDescriptionOtherTools descriptions={practice.description} />}
          {practice.description && practice.tool === 'Lighthouse Accessibility' && <AccordionDescriptionOtherTools descriptions={practice.description} />}
          {practice.description && practice.tool === 'W3C validator' && <AccordionDescriptionOtherTools descriptions={practice.description} />}
        </div>
      )}
    </li>
  )
}
