import * as React from 'react'

export default function NoAnalysisWarning (props) {
  const { projectName } = props
  return (
        <div className="boxed-group">
            <p>
                No Analysis has been launched for project {projectName}
            </p>
        </div>
  )
}
