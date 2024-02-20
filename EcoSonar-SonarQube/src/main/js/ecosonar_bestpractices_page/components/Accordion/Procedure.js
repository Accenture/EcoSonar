import React, { useEffect, useState } from 'react'
import SettingsIcon from '../../../images/SettingsIcon.svg'

export default function Procedure (props) {
  const { procedure, changeProcedureFct } = props
  const [procedureName, setProcedureName] = useState('')

  useEffect(() => {
    if (procedure === 'quickWins') {
      setProcedureName('Quick Wins')
    } else if (procedure === 'highestImpact') {
      setProcedureName('Highest Impact')
    } else {
      setProcedureName('Score Impact')
    }
  })
  return (
    <div className='procedure-priorization'>
      <div className='procedure-title'>
        <p className='first-part'>Prioritize</p>
        <p className='procedure'>{procedureName}</p>
        <button onClick={() => changeProcedureFct()} className='button-procedure' aria-label='change procedure'>< img src={SettingsIcon} alt='Change procedure' /></button>
      </div>
      {procedure === 'scoreImpact' && (
        <p className='procedure-desc'>This procedure classifies the best practices according to their level of implementation in the project.</p>
      )}
      {procedure === 'highestImpact' && (
        <p className='procedure-desc'>This procedure classifies the best practices with the highest impact on the metrics evaluated during the audit.</p>
      )}
      {procedure === 'quickWins' && (
        <p className='procedure-desc'>This procedure classifies the best practices that can be easily implemented into your project.</p>
      )}
    </div>
  )
}
