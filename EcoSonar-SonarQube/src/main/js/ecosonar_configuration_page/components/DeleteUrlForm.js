import React, { useEffect } from 'react'
import LoadingIcon from '../../images/LoadingIcon.svg'
import { deleteUrlFromProject } from '../../services/configUrlService'

export default function DeleteUrlForm (props) {
  const { index, projectName, urlList, globalError } = props
  const [isSubmitting, setSubmitting] = React.useState(false)

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
          props.errorMessageDelete(result)
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
      tabIndex="-1"
    >
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
              <img src={LoadingIcon} alt="Loading icon" />
            </div>
          )}
          {globalError !== '' && <p className="text-danger">{globalError}</p>}
          <button
            className="button-red"
            disabled={isSubmitting}
            type="submit"
            onClick={handleSubmit}
          >
            
            Delete
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
