import React from 'react'

export default function UrlItem (props) {
  const { url, handleChangeCheckedUrls, checkedUrls, setAllChecked } = props

  const isChecked = (url) => {
    for (const checkedUrl of checkedUrls) {
      if (url === checkedUrl) {
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
