import React from 'react'
import AccordionItem from './AccordionItem'
import greenItData from '../Data/greenItData.json'
import lighthousePerformanceData from '../Data/lighthousePerformanceData.json'
import lighthouseAccessibilityData from '../Data/lighthouseAccessibilityData.json'

export default function Accordion (props) {
  const { bestPractices, practiceType } = props
  const [isFolded, setIsFolded] = React.useState(false)
  return (
    <div>
      <label className='switch'>
        <input type='checkbox' checked={isFolded} onClick={() => setIsFolded(!isFolded)} /> <div></div>Close all
      </label>
      {practiceType === 'greenit' && (
        <ul className='accordion'>
          {Object.entries(bestPractices)
            .map(([bestPracticeId, bestPractice]) =>
              bestPractice.compliance !== 'N.A'
                ? (
                <AccordionItem practice={bestPractice || {}} staticData={greenItData[bestPracticeId]} isFolded={isFolded} setIsFolded={setIsFolded} key={bestPracticeId} practiceType={practiceType} />
                  )
                : null
            )}
        </ul>
      )}
      {practiceType === 'performance' && (
        <ul className='accordion'>
          {Object.entries(bestPractices)
            .map(([bestPracticeId, bestPractice]) =>
              bestPractice.isApplicableOrInformative === true
                ? (
                <AccordionItem
                  practice={bestPractice || {}}
                  staticData={lighthousePerformanceData[bestPracticeId]}
                  isFolded={isFolded}
                  setIsFolded={setIsFolded}
                  key={bestPracticeId}
                  practiceType={practiceType}
                />
                  )
                : null
            )}
        </ul>
      )}
      {practiceType === 'accessibility' && (
        <ul className='accordion'>
          {Object.entries(bestPractices)
            .map(([bestPracticeId, bestPractice]) =>
              bestPractice.isApplicableOrInformative === true
                ? (
                <AccordionItem
                  practice={bestPractice || {}}
                  staticData={lighthouseAccessibilityData[bestPracticeId]}
                  isFolded={isFolded}
                  setIsFolded={setIsFolded}
                  key={bestPracticeId}
                  practiceType={practiceType}
                />
                  )
                : null
            )}
        </ul>
      )}
    </div>
  )
}
