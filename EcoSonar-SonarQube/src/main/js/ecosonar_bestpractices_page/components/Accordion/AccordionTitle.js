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
import PopUpCorrection from '../PopUpCorrection/PopUpCorrection'
import booleanMetrics from '../../../utils/booleanMetrics.json'

function getCorrespondingImg (compliance) {
  if (compliance === 'A') {
    return (<img src={A} alt="A" className='compliance'/>)
  } else if (compliance === 'B') {
    return (<img src={B} alt="B" className='compliance'/>)
  } else if (compliance === 'C') {
    return (<img src={C} alt="C" className='compliance'/>)
  } else if (compliance === 'D') {
    return (<img src={D} alt="D" className='compliance'/>)
  } else if (compliance === 'E') {
    return (<img src={E} alt="E" className='compliance'/>)
  } else if (compliance === 'F') {
    return (<img src={F} alt="F" className='compliance'/>)
  } else if (compliance === 'G') {
    return (<img src={G} alt="G" className='compliance'/>)
  } else {
    return (<img src={NA} alt="NA" className='compliance'/>)
  }
}
export default function AccordionTitle (props) {
  const { compliance, title, staticTitleData, staticTitleDataSuccess, auditedMetric, isActive, correction, score } = props
  const [correctionPage, setCorrectionPage] = React.useState(false)
  const CorrectionPageOpen = (e) => {
    e.stopPropagation()
    setCorrectionPage(true)
  }
  return (
    <div className="accordion-title">
      <div className="accordion-left">
        { getCorrespondingImg(compliance) }
       <span className='title'>{ title }</span>
        <button className="button-pop-up" onClick = { (e) => CorrectionPageOpen(e) }>How to solve it?</button>
        {correctionPage && (
            <PopUpCorrection
          title = {title}
          correction = {correction}
         setCorrectionPage = {setCorrectionPage}
          />
        )}

      </div>
      <div className="accordion-right">
      {
          (booleanMetrics.includes(title) && score === 100)
            ? <span className='important-data'>{ format(staticTitleDataSuccess, 0) }</span>
            : (
                (auditedMetric !== null && auditedMetric !== undefined && auditedMetric !== 'N.A')
                  ? <span className='important-data'>{ format(staticTitleData, auditedMetric) }</span>
                  : <span className='important-data'>{ format(staticTitleData, 0) }</span>
              )
        }
        <img src={RightArrow} alt="arrow" className={isActive ? 'active right-arrow' : 'right-arrow'}/>

      </div>
    </div>
  )
}
