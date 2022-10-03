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
          aria-invalid={errors.duplicatedOrSyntaxError}
          name="url"
          onChange={(value) => changeValue(value.currentTarget.value)}
          type="text"
          value={url}
          id="webhook-url"
          aria-label="Add a url"
        />
        {index > 0 && (
          <button
            type="button"
            className="delete-url-button"
            onClick={deleteUrl}
            aria-label='delete this url'
          >
            <img
              className="delete-icon"
              src={DeleteIcon}
              alt=""
            />
          </button>
        )}
        {error !== '' && (
          <img
            className="alert-icon"
            src={AlertErrorIcon}
            alt=""
          />
        )}
      </div>
      {error !== '' && <p className="text-danger" role="alert">{error}</p>}
    </div>
  )
}
