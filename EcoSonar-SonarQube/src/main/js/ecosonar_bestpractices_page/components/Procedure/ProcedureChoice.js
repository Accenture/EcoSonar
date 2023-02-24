import React from 'react'
import ProcedureChoiceBody from './ProcedureChoiceBody'

export default function ProcedureChoice (props) {
  const {
    loading,
    saveProcedureError,
    error,
    selectedProcedure,
    selectProcedure,
    selectedOption,
    cancel,
    confirm,
    changeSelected,
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
              selectedOption={selectedOption}
              saveProcedureError={saveProcedureError}
              savedProcedure={savedProcedure}
              cancel={cancel}
              changeSelected={changeSelected}
              confirm={confirm} />
          }
      </div>
  )
}
