import React from 'react'
import AddUrlForm from './AddUrlForm'
import UrlList from './UrlList'
import { getUrlsConfiguration } from '../../services/configUrlService'
import DeleteUrlForm from './DeleteUrlForm'
import LoadingIcon from '../../images/LoadingIcon.svg'

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
      projectName: this.props.project.key
    })
    getUrlsConfiguration(this.props.project.key)
      .then((urls) => {
        this.setState({ urls: urls })
        this.setState({
          loading: false
        })
      })
      .catch((result) => {
        if (result instanceof Error) {
          this.setState({ error: result.message })
          this.setState({
            loading: false
          })
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
  };

  onCloseDelete = () => {
    this.setState({
      deleting: false,
      error: ''
    })
  };

  deletedUrlState = () => {
    const urlsUpdated = this.state.urls.slice()
    urlsUpdated.splice(this.state.indexToDelete, 1)
    this.setState({ deleting: false, urls: urlsUpdated })
  };

  addNewUrls = (urlsAdded) => {
    this.setState({
      urls: this.state.urls.concat(urlsAdded)
    })
  };

  render () {
    return (
      <div className='page'>
        <header className='page-header'>
          <h1 className='page-title'>URL Configuration for project {this.state.projectName}</h1>
          <div className='page-actions' aria-hidden={this.state.openCreate}>
            <button className='create-url-button' onClick={this.handleCreateOpen} type='button' aria-haspopup='dialog' aria-controls='dialog'>
              Add new URLs
            </button>
            {this.state.openCreate && <AddUrlForm isDisplayed={this.state.openCreate} projectName={this.state.projectName} onClose={this.handleCreateClose} onSubmitSuccess={this.addNewUrls} />}
          </div>

          <p className='page-description'>
            In order to analyse your code and monitor key ecodesign metrics, you will need to set every route defined for your web application.
            <br />
            EcoSonar will then analyse all pages of your web app and will guide you to set up practices optimizing ressources.
          </p>
        </header>
        {!this.state.loading
          ? (
          <div className='boxed-group'>
            <UrlList urlList={this.state.urls} error={this.state.error} onDelete={this.handleDeleteSubmit} />
          </div>
            )
          : (
          <img src={LoadingIcon} alt='Loading icon' />
            )}

        {this.state.deleting && (
          <div className='boxed-group'>
            <DeleteUrlForm urlList={this.state.urls} index={this.state.indexToDelete} projectName={this.state.projectName} deletedUrlState={this.deletedUrlState} onCloseDelete={this.onCloseDelete} />
          </div>
        )}
      </div>
    )
  }
}
