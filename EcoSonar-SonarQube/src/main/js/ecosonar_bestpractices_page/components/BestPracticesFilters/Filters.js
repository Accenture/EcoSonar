export const allTools = { key: 'ALL', label: 'All' }
export const allAccessibilityTools = { key: 'ALL ACCESSIBILITY', label: 'All accessibility tools' }
export const allEcodesignTools = { key: 'ALL ECODESIGN', label: 'All Ecodesign tools' }
export const greenITTool = { key: 'GREENIT', label: 'GreenIT-Analysis' }
export const lighthousePerformanceTool = { key: 'LIGHTHOUSE PERFORMANCE', label: 'Lighthouse Performance' }
export const lighthouseAccessibility = { key: 'LIGHTHOUSE ACCESSIBILITY', label: 'Lighthouse Accessibility' }
export const w3cValidator = { key: 'W3C VALIDATOR', label: 'W3C validator' }

export function setTools (auditType) {
  switch (auditType) {
    case 'Accessibility':
      return [allAccessibilityTools, lighthouseAccessibility, w3cValidator]
    case 'Ecodesign':
      return [allEcodesignTools, greenITTool, lighthousePerformanceTool]
    default:
      return [allTools, greenITTool, lighthouseAccessibility, lighthousePerformanceTool, w3cValidator]
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

export const defaultSelectedComplianceLevel = [
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
