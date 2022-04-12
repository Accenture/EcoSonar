import * as React from 'react'
import AccordionItem from './AccordionItem'

import data from '../data.json'

function sortBestPractices ([firstName, firstPractice], [secondName, secondPractice]) {
  if (firstPractice.compliance === 'N.A') {
    return 1
  } else if (secondName.compliance === 'N.A') {
    return -1
  }
  return secondPractice.compliance.localeCompare(firstPractice.compliance)
}

export default function Accordion (props) {
  const { bestPractices } = props
  const [isFolded, setIsFolded] = React.useState(false)

  return (
    <div>

    <label className="switch"><input type="checkbox" checked={isFolded} onClick={() => setIsFolded(!isFolded)} />    <div></div>Close all
    </label>

    <ul className="accordion">
      {
        Object.entries(bestPractices).sort(sortBestPractices).map(([bestPracticeId, bestPractice]) => (
          <AccordionItem practice={ bestPractice || {} } staticData={ data[bestPracticeId]} isFolded={isFolded} setIsFolded={setIsFolded} key={ bestPracticeId }/>
        ))
      }
    </ul>
    </div>
  )
}
