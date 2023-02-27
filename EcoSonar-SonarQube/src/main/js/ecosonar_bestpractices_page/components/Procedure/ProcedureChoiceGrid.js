import React from 'react'
import QuickWinsCard from './QuickWinsCard'
import HighestImpactCard from './HighestImpactCard'
import ScoreImpactCard from './ScoreImpactCard'

export default function ProcedureChoiceGrid (props) {
  const { selectedProcedure, selectProcedure, saveProcedureError, savedProcedure, cancel, confirm } = props
  return <div className='prioritize'>
      <p className='title-procedure'>How do you want to sort ecodesign best practices ?</p>
      <p className='subtitle-procedure bold'>It&apos;s your first time here!</p><p className="display-procedure-subtitle"> Choose the procedure you want to use for the rest of your project, you can change your choice later.</p>
      <ul className='row'>
        <ScoreImpactCard selectedProcedure={selectedProcedure} selectProcedure={selectProcedure} />
        <HighestImpactCard selectedProcedure={selectedProcedure} selectProcedure={selectProcedure} />
        <QuickWinsCard selectedProcedure={selectedProcedure} selectProcedure={selectProcedure} />
      </ul>
      {saveProcedureError !== '' && (
        <div>
          <p role='alert' className='text-danger'>{saveProcedureError}</p>
        </div>
      )}
      <div className='cancel-confirm'>
        {savedProcedure !== '' &&
          <button onClick={() => cancel()} aria-label='cancel' className='btn-cancel-or-confirm'>Cancel</button>}
        <button disabled={selectedProcedure === ''} onClick={() => confirm()} aria-label='confirm' className='btn-cancel-or-confirm'>Confirm</button>
      </div>
    </div>
}
