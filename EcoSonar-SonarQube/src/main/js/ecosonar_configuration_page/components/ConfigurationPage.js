import React from 'react'
import AddUrlForm from './AddUrlForm'
import UrlList from './UrlList'
import { getUrlsConfiguration } from '../../services/configUrlService'
import DeleteUrlForm from './DeleteUrlForm'

export default class ConfigurationPage extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      deleting: false,
      loading: true,
      openCreate: false,
      projectName: '',
      error: '',
      indexToDelete: 0,
      urls: []
    }
  }

  componentDidMount () {
    this.setState({
      loading: false,
      projectName: this.props.project.key
    })
    getUrlsConfiguration(this.props.project.key)
      .then((urls) => {
        this.setState({ urls: urls })
      }).catch((result) => {
        if (result instanceof Error) {
          this.setState({ error: result.message })
        }
      })
  }

  handleCreateOpen = () => {
    this.setState({
      openCreate: true
    })
  };

  handleCreateClose = () => {
    this.setState({
      openCreate: false
    })
  };

  handleDeleteSubmit = (index) => {
    this.setState({
      loading: false,
      deleting: true,
      indexToDelete: index
    })
  }

  onCloseDelete = () => {
    this.setState({
      deleting: false,
      error: ''
    })
  }

  setErrorMessageDelete = (error) => {
    this.setState({ error: error.message })
  }

  deletedUrlState = () => {
    const urlsUpdated = this.state.urls.slice()
    urlsUpdated.splice(this.state.indexToDelete, 1)
    this.setState({ deleting: false, urls: urlsUpdated })
  }

  addNewUrls = (urlsAdded) => {
    this.setState({
      urls: this.state.urls.concat(urlsAdded)
    })
  }

  render () {
    return (
      <div className="page">
        <header className="page-header">
          <h1 className="page-title">
            URL Configuration for project {this.state.projectName}
          </h1>
          {this.state.loading && <i className="spinner" />}
          <div className="page-actions" aria-hidden={this.state.openCreate}>
            <button
              className="create-url-button"
              onClick={this.handleCreateOpen}
              type="button"
              aria-haspopup="dialog"
              aria-controls="dialog"
            >
              
              Add new URLs
            </button>
            {this.state.openCreate && (
              <AddUrlForm isDisplayed={this.state.openCreate} projectName={this.state.projectName}
              onClose={this.handleCreateClose} onSubmitSuccess={this.addNewUrls}/>
            )}
          </div>

          <p className="page-description">
            In order to analyse your code and monitor key ecodesign metrics, you
            will need to set every route defined for your web application.
            <br />
            EcoSonar will then analyse all pages of your web app and will guide
            you to set up practices optimizing ressources.
          </p>
        </header>
        {!this.state.loading && (
          <div className="boxed-group">
          <UrlList urlList={this.state.urls} error={this.state.error} onDelete={this.handleDeleteSubmit}/>
        </div>
        )}
      {this.state.deleting && (
          <DeleteUrlForm urlList={this.state.urls} index={this.state.indexToDelete}
          projectName={this.state.projectName} globalError={this.state.error}
          deletedUrlState={this.deletedUrlState} errorMessageDelete={this.setErrorMessageDelete}
          onCloseDelete={this.onCloseDelete} />
      )}
      </div>
    )
  }
}
