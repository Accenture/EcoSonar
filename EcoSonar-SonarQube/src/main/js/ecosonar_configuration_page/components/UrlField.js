import React from 'react'
import AlertErrorIcon from '../../images/AlertErrorIcon.svg'
import DeleteIcon from '../../images/DeleteIcon.svg'
import errors from '../../utils/errors.json'

export default function UrlField (props) {
  const { index, url, isSubmitting, error } = props

  const changeValue = (value) => {
    props.handleChange(value, index)
  }

  const deleteUrl = () => {
    props.deleteUrl(index)
  }

  return (
    <div>
      <div className="input">
        <input
          disabled={isSubmitting}
          error={errors.duplicatedOrSyntaxError}
          name="url"
          onChange={(value) => changeValue(value.currentTarget.value)}
          type="text"
          value={url}
        />
        {index > 0 && (
          <button
            type="button"
            className="delete-url-button"
            onClick={deleteUrl}
          >
            <img
              className="delete-icon"
              src={DeleteIcon}
              alt="Delete url icon"
            />
          </button>
        )}
        {error !== '' && (
          <img
            className="alert-icon"
            src={AlertErrorIcon}
            alt="Alert error icon"
          />
        )}
      </div>
      {error !== '' && <p className="text-danger">{error}</p>}
    </div>
  )
}
