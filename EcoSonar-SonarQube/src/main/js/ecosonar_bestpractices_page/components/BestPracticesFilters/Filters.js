const allTools = { key: 'ALL', label: 'All' }
const accessibilityTools = { key: 'ALL ACCESSIBILITY', label: 'All accessibility tools' }
const ecodesignTools = { key: 'ALL ECODESIGN', label: 'All ecodesign tools' }
const greenITTool = { key: 'GREENIT', label: 'GreenIT-Analysis' }
const lighthousePerformanceTool = { key: 'LIGHTHOUSE PERFORMANCE', label: 'Lighthouse Performance' }
const lighthouseAccessibility = { key: 'LIGHTHOUSE ACCESSIBILITY', label: 'Lighthouse Accessibility' }

export function setTools (auditType) {
  if (auditType === 'Accessibility') {
    return [accessibilityTools, lighthouseAccessibility]
  } else if (auditType === 'Ecodesign') {
    return [ecodesignTools, greenITTool, lighthousePerformanceTool]
  } else if (auditType === 'All') {
    return [allTools, greenITTool, lighthouseAccessibility, lighthousePerformanceTool]
  }
}

export const complianceLevels = [
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'F', value: 'F' },
  { label: 'G', value: 'G' },
  { label: 'N.A', value: 'N.A' }]

export const selectedComplianceArray = [
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'F', value: 'F' },
  { label: 'G', value: 'G' }
]
export const auditTypes = [
  { key: 'ALL', label: 'All' },
  { key: 'ECODESIGN', label: 'Ecodesign' },
  { key: 'ACCESSIBILITY', label: 'Accessibility' }
]
