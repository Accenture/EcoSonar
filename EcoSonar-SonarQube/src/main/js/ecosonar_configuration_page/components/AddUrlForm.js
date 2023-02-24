/* eslint-disable react/no-unknown-property */
import FocusTrap from 'focus-trap-react'
import React, { useEffect, useState } from 'react'
import { insertUrlsConfiguration } from '../../services/configUrlService'
import UrlField from './UrlField'

export default function AddUrlForm (props) {
  const { isDisplayed, projectName, openCreate } = props
  const [urlList, setUrlList] = useState([''])
  const [isSubmitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState([''])
  const [hasErrors, setHasErrors] = useState(false)
  const [globalError, setGlobalError] = useState('')
  const description = 'URL corresponds to one of your application page composed of the application base URL and route used by your page : http://my_server/foo'

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
      className='modal'
      onClick={handleCancelClick}
      id='dialog'
      role='dialog'
      aria-labelledby='Add new URLs to your project'
      aria-describedby='You can add URL that corresponds to one of your application page composed of the application base URL and route used by your page : http://my_server/foo'
      aria-modal='true'
      aria-hidden={!isDisplayed}
    >
      <FocusTrap active={openCreate}>
        <div className='modal-content-config' onClick={(e) => e.stopPropagation()} role='document'>
          <div className='modal-header-config'>
            <h2 className='modal-title-config'>Add new URLs to your project</h2>
          </div>
          <div className='modal-body-config'>
            <div className='modal-field-description'>
              <p>{description}</p>
            </div>
            <div className='modal-validation-field'>
              <label htmlFor='webhook-url'>
                URL
                <em aria-label='This field is required' className='mandatory little-spacer-left'>
                  *
                </em>
              </label>
              {urlList.map((url, index) => {
                return <UrlField key={'url-' + index} index={index} url={url} id='webhook-url' isSubmitting={isSubmitting} error={errors[index]} handleChange={handleChange} deleteUrl={deleteUrl} />
              })}
              <div aria-hidden={true} className='mandatory-text'>
                <p>
                  All fields marked with <em className='mandatory'>*</em> are required
                </p>
              </div>
            </div>
            <button className='basic-button' disabled={props.isSubmitting} type='button' onClick={addANewUrl} aria-label='add a new url'>
              Add a new URL
            </button>
          </div>
          <footer className='modal-footer-config'>
            {isSubmitting && (
              <div className='loading'>
                <div className="loader"></div>
              </div>
            )}
            {globalError !== '' && (
              <p className='text-danger' role='alert'>
                {globalError}
              </p>
            )}
            <button className='basic-button' disabled={isSubmitting || hasErrors} type='submit' onClick={handleSubmit} arial-label='confirm urls to add' >
              Confirm
            </button>
            <button className='cancel-button' disabled={isSubmitting} type='reset' onClick={handleCancelClick} aria-label='cancel'>
              Cancel
            </button>
          </footer>
        </div>
      </FocusTrap>
    </div>
  )
}
