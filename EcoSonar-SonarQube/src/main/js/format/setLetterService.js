import A from '../images/A.svg'
import B from '../images/B.svg'
import C from '../images/C.svg'
import D from '../images/D.svg'
import E from '../images/E.svg'
import F from '../images/F.svg'
import G from '../images/G.svg'
import React from 'react'

export function setLetter (value) {
  if (value === 'A') {
    return <img className="image-score" src={A} alt="A" />
  } else if (value === 'B') {
    return <img className="image-score" src={B} alt="B" />
  } else if (value === 'C') {
    return <img className="image-score" src={C} alt="C" />
  } else if (value === 'D') {
    return <img className="image-score" src={D} alt="D" />
  } else if (value === 'E') {
    return <img className="image-score" src={E} alt="E" />
  } else if (value === 'F') {
    return <img className="image-score" src={F} alt="F" />
  } else {
    return <img className="image-score" src={G} alt="G" />
  }
}
