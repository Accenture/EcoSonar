import React from 'react'
import DeleteIcon from '../../images/DeleteIcon.svg'

export default function UrlItem (props) {
  const { url, index } = props

  const deleteUrl = () => {
    props.onDelete(index)
  }

  return (
      <tr>
        <td className= "td-formated">{url}</td>
          <td className="thin nowrap text-right">
          <button
            type="button"
            className="delete-url-button"
            onClick = {deleteUrl}
          >
            <img
              className="delete-icon"
              src = {DeleteIcon}
              alt = "Delete url icon"
            />
          </button>
            </td>
      </tr>
  )
}
