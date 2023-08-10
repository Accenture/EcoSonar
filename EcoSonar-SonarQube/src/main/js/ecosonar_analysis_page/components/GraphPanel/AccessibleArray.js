import React from 'react'

export default function AccessibleArray (props) {
  const {
    ecoUrl,
    reqUrl,
    domUrl,
    pageUrl,
    performanceUrl,
    accessibilityUrl,
    cumulativeLayoutShiftUrl,
    firstContentfulPaintUrl,
    largestContentfulPaintUrl,
    interactiveUrl,
    speedIndexUrl,
    totalBlockingTimeUrl,
    selectedGraph,
    w3cAnalysis
  } = props
  let accessibleArray

  function formatDate (string) {
    return new Date(string).toLocaleDateString()
  }

  switch (selectedGraph) {
    case 'ecoindex':
      accessibleArray = ecoUrl !== undefined ? ecoUrl : []
      break
    case 'request':
      accessibleArray = reqUrl !== undefined ? reqUrl : []
      break
    case 'dom':
      accessibleArray = domUrl !== undefined ? domUrl : []
      break
    case 'page':
      accessibleArray = pageUrl !== undefined ? pageUrl : []
      break
    case 'performance':
      accessibleArray = performanceUrl !== undefined ? performanceUrl : []
      break
    case 'accessibility':
      accessibleArray = accessibilityUrl !== undefined ? accessibilityUrl : []
      break
    case 'cumulative':
      accessibleArray = cumulativeLayoutShiftUrl !== undefined ? cumulativeLayoutShiftUrl : []
      break
    case 'firstcontentfulpaint':
      accessibleArray = firstContentfulPaintUrl !== undefined ? firstContentfulPaintUrl : []
      break
    case 'largestcontentfulpaint':
      accessibleArray = largestContentfulPaintUrl !== undefined ? largestContentfulPaintUrl : []
      break
    case 'interactive':
      accessibleArray = interactiveUrl !== undefined ? interactiveUrl : []
      break
    case 'speedindex':
      accessibleArray = speedIndexUrl !== undefined ? speedIndexUrl : []
      break
    case 'totalblockingtime':
      accessibleArray = totalBlockingTimeUrl !== undefined ? totalBlockingTimeUrl : []
      break
    case 'w3c':
      accessibleArray = w3cAnalysis !== undefined ? w3cAnalysis : []
      break
    default:
      accessibleArray = []
      break
  }

  return (
      <table>
        <tbody>
          <tr>
            <th>Date</th>
            <th>Metric</th>
          </tr>

          {accessibleArray.map((element, index) => (
            <tr key={index}>
              <td>{formatDate(element[0])}</td>
              <td>{element[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
  )
}
