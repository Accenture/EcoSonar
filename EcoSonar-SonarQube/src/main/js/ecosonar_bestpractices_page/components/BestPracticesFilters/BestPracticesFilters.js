import React from 'react'
import { MultiSelect } from 'react-multi-select-component'
import { complianceLevels } from './Filters'

function BestPracticesFilters (props) {
  const { auditTools, selectedAuditTools, setSelectedAuditTools, auditTypes, setSelectedAuditTypes, selectedComplianceArray, setSelectedComplianceArray, selectedUrl, changeSelectedUrl, urls } = props

  const displayMultiSelect = () => {
    return (
      <div>
        <MultiSelect options={complianceLevels} value={selectedComplianceArray} onChange={setSelectedComplianceArray} disableSearch={true} labelledBy='Select' />
      </div>
    )
  }
  return (
    <div className='best-practice-filters'>
      <form className='filters'>

        <div className='best-practice-filters-selector'>
          <label htmlFor='audit-type'>Type of audit : </label>
          <select className='select-button' name='audit-type' id='audit-type' onChange={(event) => setSelectedAuditTypes(event.target.value)} aria-label='Select audit type'>
            {auditTypes.map((auditType) => (
              <option key={auditType.key} value={auditType.label}>
                {auditType.label}
              </option>
            ))}
          </select>
        </div>

        <div className='best-practice-filters-selector'>
          <label htmlFor='audit-tool'>Audit tool : </label>
          <select value={selectedAuditTools} className='select-button' name='audit-tool' id='audit-tool' onChange={(event) => setSelectedAuditTools(event.target.value)}>
            {auditTools.map((auditTool) => (
              <option key={auditTool.key} value={auditTool.label}>
                {auditTool.label}
              </option>
            ))}
          </select>
        </div>
        <div className='dropdown-checkboxes'>
          <div className='best-practice-filters-selector'>
            <label htmlFor='levels'>Levels : </label>
            {displayMultiSelect()}
          </div>
        </div>
        <div className='best-practice-filters-selector'>
          <label htmlFor='project-or-url'>Select all URLs from project or a specific URL :</label>
          <select className='select-button url' title={selectedUrl} name='project-or-url' id='project-or-url' value={selectedUrl} onChange={changeSelectedUrl}>
            {urls.map((url, index) => {
              return (
                <option key={index} value={url}>
                  {url}
                </option>
              )
            })}

          </select>
        </div>
      </form>
    </div>
  )
}

export default BestPracticesFilters
