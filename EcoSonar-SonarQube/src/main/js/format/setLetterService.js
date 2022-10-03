import React from 'react'
import A from '../images/A.svg'
import B from '../images/B.svg'
import C from '../images/C.svg'
import D from '../images/D.svg'
import E from '../images/E.svg'
import F from '../images/F.svg'
import G from '../images/G.svg'

export function setLetter (value) {
  if (value === 'A') {
    return <img className="image-score" src={A} alt="Compliant, type A" />
  } else if (value === 'B') {
    return <img className="image-score" src={B} alt="Compliant, type B" />
  } else if (value === 'C') {
    return <img className="image-score" src={C} alt="Almost compliant, type C" />
  } else if (value === 'D') {
    return <img className="image-score" src={D} alt="Almost compliant, type D" />
  } else if (value === 'E') {
    return <img className="image-score" src={E} alt="Not compliant, type E" />
  } else if (value === 'F') {
    return <img className="image-score" src={F} alt="Not compliant, type F" />
  } else {
    return <img className="image-score" src={G} alt="Extremely not compliant, type G" />
  }
}
