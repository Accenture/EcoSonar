import React from 'react'
import format from '../../../format/format'
import A from '../../../images/A.svg'
import B from '../../../images/B.svg'
import C from '../../../images/C.svg'
import D from '../../../images/D.svg'
import E from '../../../images/E.svg'
import F from '../../../images/F.svg'
import G from '../../../images/G.svg'
import NA from '../../../images/NA.svg'
import RightArrow from '../../../images/RightArrow.svg'
import booleanMetrics from '../../../utils/booleanMetrics.json'
import PopUpCorrection from '../PopUpCorrection/PopUpCorrection'

function getCorrespondingImg (compliance) {
  if (compliance === 'A') {
    return (<img src={A} alt="Compliant, type A" className='compliance' />)
  } else if (compliance === 'B') {
    return (<img src={B} alt="Compliant, type B" className='compliance' />)
  } else if (compliance === 'C') {
    return (<img src={C} alt="Almost compliant, type C" className='compliance' />)
  } else if (compliance === 'D') {
    return (<img src={D} alt="Almost compliant, type D" className='compliance' />)
  } else if (compliance === 'E') {
    return (<img src={E} alt="Not compliant, type E" className='compliance' />)
  } else if (compliance === 'F') {
    return (<img src={F} alt="Not compliant, type F" className='compliance' />)
  } else if (compliance === 'G') {
    return (<img src={G} alt="Extremely not compliant, type G" className='compliance' />)
  } else {
    return (<img src={NA} alt="Non applicable" className='compliance' />)
  }
}
export default function AccordionTitle (props) {
  const { compliance, title, staticTitleData, staticTitleDataSuccess, auditedMetric, isActive, correction, score } = props
  const [correctionPage, setCorrectionPage] = React.useState(false)
  const CorrectionPageOpen = (e) => {
    e.stopPropagation()
    setCorrectionPage(true)
  }

  function displayData (title, staticTitleData, staticTitleDataSuccess, auditedMetric, score) {
    if (booleanMetrics.includes(title) && score === 100) {
      return format(staticTitleDataSuccess, 0)
    } else {
      if (auditedMetric !== null && auditedMetric !== undefined && auditedMetric !== 'N.A') {
        return format(staticTitleData, auditedMetric)
      } else {
        return format(staticTitleData, 0)
      }
    }
  }

  return (
    <div className="accordion-title">
      <div className="accordion-left">
        {getCorrespondingImg(compliance)}
        <p className='title'>{title}</p>
        <button className="button-pop-up" onClick={(e) => CorrectionPageOpen(e)} aria-expanded={correctionPage}>How to solve it?</button>
        {correctionPage && (
          <PopUpCorrection
            title={title}
            correction={correction}
            setCorrectionPage={setCorrectionPage}
          />
        )}
      </div>
      <div className="accordion-right">
        <p className='important-data'>{displayData(title, staticTitleData, staticTitleDataSuccess, auditedMetric, score)}</p>
        <img src={RightArrow} alt="" className={isActive ? 'active right-arrow' : 'right-arrow'} />
      </div>
    </div>
  )
}
