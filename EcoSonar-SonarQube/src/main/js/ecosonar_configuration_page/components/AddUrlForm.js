import React, { useEffect } from 'react'
import LoadingIcon from '../../images/LoadingIcon.svg'
import UrlField from './UrlField'
import { insertUrlsConfiguration } from '../../services/configUrlService'

export default function AddUrlForm (props) {
  const { isDisplayed, projectName } = props
  const [urlList, setUrlList] = React.useState([''])
  const [isSubmitting, setSubmitting] = React.useState(false)
  const [errors, setErrors] = React.useState([''])
  const [hasErrors, setHasErrors] = React.useState(false)
  const [globalError, setGlobalError] = React.useState('')
  const description =
    'URL corresponds to one of your application page composed of the application base URL and route used by your page : http://my_server/foo'

  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDown)
    return function cleanup () {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  })

  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose()
    }
  }

  const handleChange = (value, index) => {
    const urlListModified = urlList.slice()
    urlListModified[index] = value
    setUrlList(urlListModified)
    const errorsModified = errors.slice()
    errorsModified[index] = ''
    setErrors(errorsModified)
    setHasErrors(false)
    setGlobalError('')
  }

  const addANewUrl = () => {
    const urlListModified = urlList.slice()
    urlListModified.push('')
    setUrlList(urlListModified)
    const errorsModified = errors.slice()
    errorsModified.push('')
    setErrors(errorsModified)
  }

  const deleteUrl = (index) => {
    const urlListModified = urlList.slice()
    urlListModified.splice(index, 1)
    setUrlList(urlListModified)
    const errorsModified = errors.slice()
    errorsModified.splice(index, 1)
    setErrors(errorsModified)
    setHasErrors(false)
  }

  const handleCancelClick = (event) => {
    event.preventDefault()
    event.currentTarget.blur()
    props.onClose()
  }

  const handleSubmit = async () => {
    setGlobalError('')
    setSubmitting(true)
    urlList.forEach((url, index) => {
      if (!url.trim()) {
        errors[index] = 'URL is required'
        setHasErrors(true)
      }
    })
    if (!hasErrors) {
      await insertUrlsConfiguration(projectName, urlList)
        .then(() => {
          props.onSubmitSuccess(urlList)
          props.onClose()
        })
        .catch((result) => {
          if (result instanceof Error) {
            setGlobalError(result.message)
          } else if (Array.isArray(result)) {
            setErrors(result)
            setHasErrors(true)
          }
        })
    }
    setSubmitting(false)
  }

  return (
    <div
      className="modal"
      onClick={handleCancelClick}
      id="dialog"
      role="dialog"
      aria-labelledby="Add new URLs to your project"
      aria-describedby="Add new URLs to your project"
      aria-modal="true"
      aria-hidden={!isDisplayed}
      tabIndex="-1"
    >
      <div
        className="modal-content-config"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className="modal-header-config">
          <h2 className="modal-title-config">Add new URLs to your project</h2>
        </div>
        <div className="modal-body-config">
          <div aria-hidden={true} className="mandatory-text">
            All fields marked with <em className="mandatory">*</em> are required
          </div>
          <div className="modal-validation-field">
            <label htmlFor="webhook-url">
              URL
              <em
                aria-label="This field is required"
                className="mandatory little-spacer-left"
              >
                *
              </em>
            </label>
            <div className="modal-field-description">{description}</div>
            {urlList.map((url, index) => {
              return (
                <UrlField
                  key={'url-' + index}
                  index={index}
                  url={url}
                  isSubmitting={isSubmitting}
                  error={errors[index]}
                  handleChange={handleChange}
                  deleteUrl={deleteUrl}
                />
              )
            })}
          </div>
          <button
            className="create-url-button"
            disabled={props.isSubmitting}
            type="button"
            onClick={addANewUrl}
          >

            Add a new URL
          </button>
        </div>
        <footer className="modal-footer-config">
          {isSubmitting && (
            <div className="loading">
              <img src={LoadingIcon} alt="Loading icon" />
            </div>
          )}
          {globalError !== '' && <p className="text-danger">{globalError}</p>}
          <button
            className="create-url-button"
            disabled={isSubmitting || hasErrors}
            type="submit"
            onClick={handleSubmit}
          >

            Confirm
          </button>
          <button
            className="cancel-button"
            disabled={isSubmitting}
            type="reset"
            onClick={handleCancelClick}
          >

            Cancel
          </button>
        </footer>
      </div>
    </div>
  )
}
