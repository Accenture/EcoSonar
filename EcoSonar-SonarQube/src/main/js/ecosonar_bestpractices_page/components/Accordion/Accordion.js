import React from 'react'
import greenItData from '../../../utils/bestPractices/greenItData.json'
import lighthouseAccessibilityData from '../../../utils/bestPractices/lighthouseAccessibilityData.json'
import lighthousePerformanceData from '../../../utils/bestPractices/lighthousePerformanceData.json'
import AccordionItem from './AccordionItem'
import formatW3cBestPractices from '../../../format/formatW3cBestPractices'
import Procedure from './Procedure'

export default function Accordion (props) {
  const {
    selectedComplianceArray,
    practiceType,
    data,
    isFolded,
    setIsFolded,
    procedure,
    changeProcedureFct
  } = props

  //  W3C Analysis is dynamicaly generated. It doesn't have any JSON file to match inside Data folder.
  const formattedW3cBestPractices = formatW3cBestPractices(Object.fromEntries(Object.entries(data).filter((audit) => audit[1].tool === 'W3C validator')))
  function displayTitle (title, practices) {
    for (const element of Object.values(practices)) {
      if (selectedComplianceArray.some((compliance) => compliance.label === element.compliance)) {
        return <h3 className='accordion-name'>{`${title} Practices`}</h3>
      }
    }
  }

  function getStaticData (tool, id) {
    switch (tool) {
      case 'Lighthouse Accessibility':
        return lighthouseAccessibilityData[id]
      case 'Lighthouse Performance':
        return lighthousePerformanceData[id]
      case 'W3C validator' :
        return formattedW3cBestPractices[id]
      default:
        return greenItData[id]
    }
  }

  return (
    <div>
      {displayTitle(practiceType, data)}
      {practiceType === 'Ecodesign' &&
        <Procedure
          procedure = {procedure}
          changeProcedureFct = {changeProcedureFct}
        />}
      <ul className='accordion'>
        <>
          {Object.entries(data).map(([bestPracticeId, bestPractice]) =>
            selectedComplianceArray.some((compliance) => compliance.label === bestPractice.compliance)
              ? (
                <AccordionItem
                  practice={bestPractice || {}}
                  staticData={getStaticData(bestPractice.tool, bestPracticeId)}
                  isFolded={isFolded}
                  setIsFolded={setIsFolded}
                  key={bestPracticeId}
                />
                )
              : null
          )}
        </>
      </ul>
    </div>
  )
}
