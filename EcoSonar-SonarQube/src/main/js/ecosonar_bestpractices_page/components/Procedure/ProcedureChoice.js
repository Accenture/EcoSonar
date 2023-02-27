import React from 'react'
import ProcedureChoiceBody from './ProcedureChoiceBody'

export default function ProcedureChoice (props) {
  const {
    loading,
    saveProcedureError,
    error,
    selectedProcedure,
    selectProcedure,
    cancel,
    confirm,
    savedProcedure
  } = props
  return (
      <div>
          {loading
            ? <div className="loader"></div>
            : <ProcedureChoiceBody
              error={error}
              selectedProcedure={selectedProcedure}
              selectProcedure={selectProcedure}
              saveProcedureError={saveProcedureError}
              savedProcedure={savedProcedure}
              cancel={cancel}
              confirm={confirm} />
          }
      </div>
  )
}
