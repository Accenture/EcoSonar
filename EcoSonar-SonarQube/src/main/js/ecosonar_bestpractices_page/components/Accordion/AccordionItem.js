import React, { useEffect, useState } from 'react'
import AccordionDescription from './AccordionDescription'
import AccordionDescriptionOtherTools from './AccordionDescriptionOtherTools'
import AccordionTitle from './AccordionTitle'

export default function AccordionItem (props) {
  const { practice, staticData, isFolded, setIsFolded } = props
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (isFolded) setIsActive(false)
  }, [isFolded])

  function unFoldAndChangeIsActive () {
    setIsActive(!isActive)
    if (isFolded) setIsFolded(false)
  }

  return (
    <li className='accordion-item'>
      <div className='accordion' aria-label={staticData.title} role='region' >
        <AccordionTitle
          title= {staticData.title}
          staticTitleData={staticData.titleData}
          staticTitleDataSuccess={staticData.titleDataSuccess}
          compliance={practice.compliance}
          correction={staticData.correction}
          auditedMetric={practice.auditedMetric}
          tool={practice.tool}
          score={practice.averageScore}
          isActive={isActive}
          isFolded={isFolded}
          unFoldAndChangeIsActive={unFoldAndChangeIsActive}
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
