import React from 'react'

export function setLetter (compliance, lighthousePanel) {
  if (compliance === 'A') {
    return (<div className={lighthousePanel ? 'compliance good-level compliance-light' : 'compliance good-level'}><p className='text-compliance'>A</p></div>)
  } else if (compliance === 'B') {
    return (<div className={lighthousePanel ? 'compliance good-level compliance-light' : 'compliance good-level'}><p className='text-compliance'>B</p></div>)
  } else if (compliance === 'C') {
    return (<div className={lighthousePanel ? 'compliance intermed-level compliance-light' : 'compliance intermed-level'}><p className='text-compliance'>C</p></div>)
  } else if (compliance === 'D') {
    return (<div className={lighthousePanel ? 'compliance intermed-level compliance-light' : 'compliance intermed-level'}><p className='text-compliance'>D</p></div>)
  } else if (compliance === 'E') {
    return (<div className={lighthousePanel ? 'compliance bad-level compliance-light' : 'compliance bad-level'}><p className='text-compliance'>E</p></div>)
  } else if (compliance === 'F') {
    return (<div className={lighthousePanel ? 'compliance bad-level compliance-light' : 'compliance bad-level'}><p className='text-compliance'>F</p></div>)
  } else if (compliance === 'G') {
    return (<div className={lighthousePanel ? 'compliance bad-level compliance-light' : 'compliance bad-level'}><p className='text-compliance'>G</p></div>)
  } else {
    return (<div className={lighthousePanel ? 'compliance na-level compliance-light' : 'compliance na-level'}><p className='text-compliance'>N.A</p></div>)
  }
}
