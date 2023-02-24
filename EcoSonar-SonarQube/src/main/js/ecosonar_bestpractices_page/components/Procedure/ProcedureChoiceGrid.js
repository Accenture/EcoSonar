import React from 'react'
import QuickWinsCard from './QuickWinsCard'
import HighestImpactCard from './HighestImpactCard'
import ScoreImpactCard from './ScoreImpactCard'

export default function ProcedureChoiceGrid (props) {
  const { selectedProcedure, selectProcedure, selectedOption, saveProcedureError, savedProcedure, cancel, changeSelected, confirm } = props
  return <div className='prioritize'>
      <p className='title-procedure'>How do you want to sort ecodesign best practices ?</p>
      <p className='subtitle-procedure bold'>It&apos;s your first time here!</p><p className="display-procedure-subtitle"> Choose the procedure you want to use for the rest of your project, you can change your choice later.</p>
      <ul className='row'>
        <ScoreImpactCard selectedProcedure={selectedProcedure} selectProcedure={selectProcedure} />
        <HighestImpactCard selectedProcedure={selectedProcedure} selectProcedure={selectProcedure} />
        <QuickWinsCard selectedProcedure={selectedProcedure} selectProcedure={selectProcedure} />
      </ul>
      {(selectedProcedure === 'quickWins' || selectedProcedure === 'smartImpact') &&
        <div>
          <p className='padding-procedure title-choice'>Would you like to prioritize some more difficult best practices in your sorting if they have more impact on improving your scores ?</p>
          <div className='blue padding-procedure'>
            <div className='row-left padding-procedure'>
              <label htmlFor='yes' className="container"><p className='choice'>Yes</p>
                <input aria-checked={(selectedOption === 'yes')} tabIndex={0} aria-labelledby="smart impact" onChange={() => changeSelected('yes')} type="checkbox" id='yes' checked={(selectedOption === 'yes')} />
                <div className="checkmark"></div>
              </label>
              <label htmlFor='no' className="container"><p className='choice'>No</p>
                <input aria-checked={(selectedOption === 'no')} tabIndex={0} aria-labelledby="quick wins" onChange={() => changeSelected('no')} type="checkbox" id='no' checked={(selectedOption === 'no')} />
                <div className="checkmark"></div>
              </label>
            </div>
          </div>
        </div>}
      {saveProcedureError !== '' && (
        <div>
          <p role='alert' className='text-danger'>{saveProcedureError}</p>
        </div>
      )}
      <div className='cancel-confirm'>
        {savedProcedure !== '' &&
          <button onClick={() => cancel()} aria-label='cancel' className='btn-cancel-or-confirm'>Cancel</button>}
        <button disabled={((selectedOption === '' && selectedProcedure === 'quickWins') || selectedProcedure === '')} onClick={() => confirm()} aria-label='confirm' className='btn-cancel-or-confirm'>Confirm</button>
      </div>
    </div>
}
