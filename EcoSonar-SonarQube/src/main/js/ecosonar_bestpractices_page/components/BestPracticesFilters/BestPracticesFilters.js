import React from 'react'
import { MultiSelect } from 'react-multi-select-component'
import { complianceLevels } from './Filters'

export default function BestPracticesFilters (props) {
  const {
    auditTypes,
    auditTools,
    selectedAuditTypes,
    selectedAuditTools,
    selectedComplianceArray,
    selectedUrl,
    urls,
    setSelectedAuditTypes,
    setSelectedAuditTools,
    setSelectedComplianceArray,
    changeSelectedUrl
  } = props

  return (
    <div className='best-practice-filters'>
      <form className='filters'>
        <div className='best-practice-filters-selector'>
          <label htmlFor='audit-type'>Type of audit : </label>
          <select
            className='select-button'
            name='audit-type'
            id='audit-type'
            onChange={(event) => setSelectedAuditTypes(event.target.value)}
            value={selectedAuditTypes}
          >
          <optgroup label='List of audit type'>
              {auditTypes.map((auditType) => (
                <option key={auditType.key} value={auditType.label}>
                  {auditType.label}
                </option>
              ))}
          </optgroup>
          </select>
        </div>
        <div className='best-practice-filters-selector'>
          <label htmlFor='audit-tool'>Audit tool : </label>
          <select
            className='select-button'
            name='audit-tool'
            id='audit-tool'
            onChange={(event) => setSelectedAuditTools(event.target.value)}
            value={selectedAuditTools}
          >
          <optgroup label='List of audit tool'>
              {auditTools.map((auditTool) => (
                <option key={auditTool.key} value={auditTool.label}>
                  {auditTool.label}
                </option>
              ))}
          </optgroup>
          </select>
        </div>
        <div className='dropdown-checkboxes'>
          <div className='best-practice-filters-selector'>
            <label htmlFor='levels'>Levels : </label>
            <MultiSelect
              options={complianceLevels}
              value={selectedComplianceArray}
              onChange={setSelectedComplianceArray}
              disableSearch={true}
              labelledBy='Select' />
          </div>
        </div>
        <div className='best-practice-filters-selector'>
          <label htmlFor='project-or-url'>Select all URLs from project or a specific URL :</label>
          <select
            className='select-button url'
            name='project-or-url'
            id='project-or-url'
            onChange={changeSelectedUrl}
            value={selectedUrl}
          >
          <optgroup label='List of URLs'>
              {urls.map((url, index) => {
                return (
                  <option key={index} value={url}>
                    {url}
                  </option>
                )
              })}
          </optgroup>
          </select>
        </div>
      </form>
    </div>
  )
}
