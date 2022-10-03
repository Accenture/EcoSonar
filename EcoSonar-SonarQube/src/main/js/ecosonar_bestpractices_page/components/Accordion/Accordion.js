import React, { useState } from 'react'
import greenItData from '../Data/greenItData.json'
import lighthouseAccessibilityData from '../Data/lighthouseAccessibilityData.json'
import lighthousePerformanceData from '../Data/lighthousePerformanceData.json'
import AccordionItem from './AccordionItem'

export default function Accordion (props) {
  const { greenItBestPractices, lighthousePerformanceBestPractices, lighthouseAccessibilityBestPractices, practiceType, selectedComplianceArray } = props
  const [isFolded, setIsFolded] = useState(false)

  function display (title, practices) {
    for (const element of Object.values(practices)) {
      if (selectedComplianceArray.some((compliance) => compliance.label === element.compliance)) return <h3 className='accordion-name'>{title}</h3>
    }
  }
  function displayGreenITAnalysis () {
    return (
      <div>
        {Object.entries(greenItBestPractices).map(([bestPracticeId, bestPractice]) =>
          selectedComplianceArray.some((compliance) => compliance.label === bestPractice.compliance)
            ? (
            <AccordionItem practice={bestPractice || {}} staticData={greenItData[bestPracticeId]} isFolded={isFolded} setIsFolded={setIsFolded} key={bestPracticeId} practiceType='greenit' index={bestPracticeId} />
              )
            : null
        )}
      </div>
    )
  }
  function displayLighthousePerformance () {
    return (
      <div>
        {Object.entries(lighthousePerformanceBestPractices).map(([bestPracticeId, bestPractice]) =>
          selectedComplianceArray.some((compliance) => compliance.label === bestPractice.compliance)
            ? (
            <AccordionItem
              practice={bestPractice || {}}
              staticData={lighthousePerformanceData[bestPracticeId]}
              isFolded={isFolded}
              setIsFolded={setIsFolded}
              key={bestPracticeId}
              practiceType='performance'
            />
              )
            : null
        )}
      </div>
    )
  }
  function displayLighthouseAccessibility () {
    return (
      <div>
        {Object.entries(lighthouseAccessibilityBestPractices).map(([bestPracticeId, bestPractice]) =>
          selectedComplianceArray.some((compliance) => compliance.label === bestPractice.compliance)
            ? (
            <AccordionItem
              practice={bestPractice || {}}
              staticData={lighthouseAccessibilityData[bestPracticeId]}
              isFolded={isFolded}
              setIsFolded={setIsFolded}
              key={bestPracticeId}
              practiceType='accessibility'
            />
              )
            : null
        )}
      </div>
    )
  }

  return (
    <div role='region'>
      <label className='switch' htmlFor='checkbox' >
        <input
          type='checkbox'
          checked={isFolded}
          aria-checked={isFolded}
          tabIndex={0}
          aria-labelledby="checkbox"
          onChange={() => setIsFolded(!isFolded)}
          id='checkbox' />
        <div></div>
        Close all
      </label>

      {practiceType === 'All' && (
        <ul className='accordion'>
          {display('GreenIT-Analysis', greenItBestPractices)}

          {displayGreenITAnalysis()}
          {display('Lighthouse Performance', lighthousePerformanceBestPractices)}

          {displayLighthousePerformance()}
          {display('Lighthouse Accessibility', lighthouseAccessibilityBestPractices)}

          {displayLighthouseAccessibility()}
        </ul>
      )}

      {practiceType === 'All ecodesign tools' && (
        <ul className='accordion'>
          {display('GreenIT-Analysis', greenItBestPractices)}
          {displayGreenITAnalysis()} {display('Lighthouse Performance', lighthousePerformanceBestPractices)}
          {displayLighthousePerformance()}
        </ul>
      )}

      {practiceType === 'All accessibility tools' && (
        <ul className='accordion'>
          {display('Lighthouse Accessibility', lighthouseAccessibilityBestPractices)}
          {displayLighthouseAccessibility()}
        </ul>
      )}
      {practiceType === 'greenit' && <ul className='accordion'>{displayGreenITAnalysis()}</ul>}
      {practiceType === 'performance' && <ul className='accordion'>{displayLighthousePerformance()}</ul>}
      {practiceType === 'accessibility' && <ul className='accordion'>{displayLighthouseAccessibility()}</ul>}
    </div>
  )
}
