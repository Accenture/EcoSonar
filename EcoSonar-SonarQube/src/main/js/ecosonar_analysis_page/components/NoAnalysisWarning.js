import React from 'react'
import errors from '../../utils/errors.json'
import formatError from '../../format/formatError'

export default function NoAnalysisWarning (props) {
  return (
    <div className='boxed-group'>
      <p className='text-danger'>{formatError(errors.noAnalysisLaunched, props.projectName)}</p>
    </div>
  )
}
