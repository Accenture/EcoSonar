import React from 'react'
import ProcedureChoiceGrid from './ProcedureChoiceGrid'

export default function ProcedureChoiceBody (props) {
  const { error, selectedProcedure, selectProcedure, selectedOption, saveProcedureError, savedProcedure, cancel, changeSelected, confirm } = props
  return error
    ? <div className='best-practice-error'>
        <p className='text-danger'>{error}</p>
      </div>
    : <ProcedureChoiceGrid
        selectedProcedure={selectedProcedure}
        selectProcedure={selectProcedure}
        selectedOption={selectedOption}
        saveProcedureError={saveProcedureError}
        savedProcedure={savedProcedure}
        cancel={cancel}
        changeSelected={changeSelected}
        confirm={confirm} />
}
