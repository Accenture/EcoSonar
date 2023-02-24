import FocusTrap from 'focus-trap-react'
import React, { useEffect } from 'react'
import { deleteUrlFromProject } from '../../services/configUrlService'

export default function DeleteUrlForm (props) {
  const { index, projectName, urlList, openDelete } = props
  const [isSubmitting, setSubmitting] = React.useState(false)
  const [errorMessageDelete, setErrorMessageDelete] = React.useState('')

  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDown)
    return function cleanup () {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown)
    }
  })

  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onCloseDelete()
    }
  }

  const handleCancelClick = (event) => {
    event.preventDefault()
    event.currentTarget.blur()
    props.onCloseDelete()
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await deleteUrlFromProject(projectName, urlList[index])
      .then(() => {
        props.deletedUrlState()
      })
      .catch((result) => {
        if (result instanceof Error) {
          setErrorMessageDelete(result.message)
        }
      })
    setSubmitting(false)
  }

  return (
    <div
      className="modal"
      onClick={handleCancelClick}
      id="dialog"
      role="dialog"
      aria-labelledby="Delete URL from your project"
      aria-describedby="Delete URL from your project"
      aria-modal="true"
      aria-hidden="false"
    >
    <FocusTrap active={openDelete}>
        <div
          className="modal-content-config"
          onClick={(e) => e.stopPropagation()}
          role="document"
        >
        <div className="modal-header-config">
          <h2 className="modal-title-config">Delete URL from your project</h2>
        </div>
        <div className="modal-validation-field delete-field">
          <p>
            If you want to delete {urlList[index]} in {projectName} click on
            delete.
          </p>
        </div>
        <footer className="modal-footer-config">
          {isSubmitting && (
            <div className="loading">
              <div className="loader"></div>
            </div>
          )}
          {errorMessageDelete !== '' && <p className="text-danger" role="alert">{errorMessageDelete}</p>}
          <button
            className="button-delete"
            disabled={isSubmitting}
            type="submit"
            onClick={handleSubmit}
            aria-label="confirm you want to delete this url"
          >
            Delete
          </button>
          <button
            className="cancel-button"
            disabled={isSubmitting}
            type="reset"
            onClick={handleCancelClick}
            aria-label="cancel"
          >
            Cancel
          </button>
        </footer>
      </div>
      </FocusTrap>
    </div>
  )
}
