import React from 'react'
import AccordionItem from './AccordionItem'
import greenItData from '../Data/greenItData.json'
import lighthousePerformanceData from '../Data/lighthousePerformanceData.json'
import lighthouseAccessibilityData from '../Data/lighthouseAccessibilityData.json'

function sortBestPractices ([firstName, firstPractice], [secondName, secondPractice]) {
  if (firstPractice.compliance === 'N.A') {
    return 1
  } else if (secondName.compliance === 'N.A') {
    return -1
  }
  return secondPractice.compliance.localeCompare(firstPractice.compliance)
}

export default function Accordion (props) {
  const [displayNotApplicable, setDisplayNotApplicable] = React.useState(false)
  const { bestPractices, practiceType } = props
  const [isFolded, setIsFolded] = React.useState(false)

  return (
    <div className='not-applicable'>
      <h2 className='title-not-applicable' onClick={() => setDisplayNotApplicable(!displayNotApplicable)}>
        NOT APPLICABLE
      </h2>
      {displayNotApplicable && (
        <div>
          <label className='switch'>
            <input type='checkbox' checked={isFolded} onClick={() => setIsFolded(!isFolded)} /> <div></div>Close all
          </label>
          {practiceType === 'greenit' && (
            <ul className='accordion'>
              {Object.entries(bestPractices)
                .sort(sortBestPractices)
                .map(([bestPracticeId, bestPractice]) =>
                  bestPractice.isApplicableOrInformative === false
                    ? (
                    <AccordionItem
                      practice={bestPractice || {}}
                      staticData={greenItData[bestPracticeId]}
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
          {practiceType === 'performance' && (
            <ul className='accordion'>
              {Object.entries(bestPractices)
                .sort(sortBestPractices)
                .map(([bestPracticeId, bestPractice]) =>
                  bestPractice.isApplicableOrInformative === false
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
                .sort(sortBestPractices)
                .map(([bestPracticeId, bestPractice]) =>
                  bestPractice.isApplicableOrInformative === false
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
      )}
    </div>
  )
}
