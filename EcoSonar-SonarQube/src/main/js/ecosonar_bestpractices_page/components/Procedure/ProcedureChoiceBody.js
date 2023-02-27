import React from 'react'
import ProcedureChoiceGrid from './ProcedureChoiceGrid'

export default function ProcedureChoiceBody (props) {
  const { error, selectedProcedure, selectProcedure, saveProcedureError, savedProcedure, cancel, confirm } = props
  return error
    ? <div className='best-practice-error'>
        <p className='text-danger'>{error}</p>
      </div>
    : <ProcedureChoiceGrid
        selectedProcedure={selectedProcedure}
        selectProcedure={selectProcedure}
        saveProcedureError={saveProcedureError}
        savedProcedure={savedProcedure}
        cancel={cancel}
        confirm={confirm} />
}
