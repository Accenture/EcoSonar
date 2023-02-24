import React from 'react'

export default function CrawledUrlItem (props) {
  const { url, handleChangeCheckedUrls, checkedUrls, setAllChecked } = props

  const isChecked = (urlToCheck) => {
    for (const checkedUrl of checkedUrls) {
      if (urlToCheck === checkedUrl) {
        return true
      }
    }
    setAllChecked(false)
    return false
  }

  return (
    <tr>
      <td className='td-formated'>{url}</td>
      <td className='thin nowrap text-right '>
        <input type='checkbox' aria-label='select url' value={url} checked={isChecked(url)} onChange={() => handleChangeCheckedUrls(url)}></input>
      </td>
    </tr>
  )
}
