import React from 'react'
import { getUrlsConfiguration } from '../../services/configUrlService'
import AddUrlForm from './AddUrlForm'
import CrawlerPage from './Crawler/CrawlerPage'
import DeleteUrlForm from './DeleteUrlForm'
import UrlList from './UrlList'
import errors from '../../utils/errors.json'
import formatError from '../../format/formatError'

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
      urls: [],
      displayCrawler: false
    }
  }

  componentDidMount () {
    this.setState({
      projectName: this.props.project.key
    })
    getUrlsConfiguration(this.props.project.key)
      .then((urls) => {
        if (urls.length > 0) {
          this.setState({ urls, loading: false })
        } else {
          this.setState({
            loading: false,
            error: formatError(errors.noUrlAssigned, this.props.project.key)
          })
        }
      })
      .catch((result) => {
        if (result instanceof Error) {
          this.setState({ error: result.message, loading: false })
        }
      })
  }

  handleCreateOpen = () => {
    this.setState({
      openCreate: true
    })
  }

  handleCreateClose = () => {
    this.setState({
      openCreate: false
    })
  }

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

  deletedUrlState = () => {
    const urlsUpdated = this.state.urls.slice()
    urlsUpdated.splice(this.state.indexToDelete, 1)
    this.setState({ deleting: false, urls: urlsUpdated })
  }

  addNewUrls = (urlsAdded) => {
    this.setState({
      urls: this.state.urls.concat(urlsAdded),
      crawledUrls: [],
      displayCrawler: false,
      error: ''
    })
  }

  setDisplayCrawler = () => {
    this.setState({ displayCrawler: !this.state.displayCrawler })
  }

  checkUrl = () => {
    if (!this.state.displayCrawler) {
      return (
        <div className='boxed-group'>
          <UrlList urlList={this.state.urls} error={this.state.error} onDelete={this.handleDeleteSubmit} setDisplayCrawler={this.setDisplayCrawler} />
        </div>
      )
    } else {
      return (
        <div className='boxed-group'>
          <CrawlerPage
            projectName={this.state.projectName}
            addNewUrls={this.addNewUrls}
            setDisplayCrawler={this.setDisplayCrawler}
          />
        </div>
      )
    }
  }

  render () {
    return (
      <main role='main' aria-hidden='true'>

        <div className='page' aria-hidden='true'>
          <div className='page-header' role='banner' aria-label='configuration page presentation'>
            <h1 className='page-title'>URL Configuration for project {this.state.projectName}</h1>
            <div className='page-actions' aria-hidden={this.state.openCreate}>
              <button
                className='basic-button'
                disabled={this.state.displayCrawler}
                onClick={this.handleCreateOpen}
                type='button'
                aria-haspopup='dialog'
                aria-label='add new urls'
                aria-controls='dialog'
              >
                Add new URLs
              </button>
              {this.state.openCreate && <AddUrlForm isDisplayed={this.state.openCreate} projectName={this.state.projectName} onClose={this.handleCreateClose} onSubmitSuccess={this.addNewUrls} />}
            </div>

            <p className='page-description'>
              In order to analyse your code and monitor key ecodesign metrics, you will need to set every route defined for your web application.
              <br />
              EcoSonar will then analyse all pages of your web app and will guide you to set up practices optimizing ressources.
            </p>
          </div>
          {!this.state.loading ? this.checkUrl() : <div className="loader"></div>}

          {this.state.deleting && (
            <DeleteUrlForm
              urlList={this.state.urls}
              index={this.state.indexToDelete}
              projectName={this.state.projectName}
              deletedUrlState={this.deletedUrlState}
              onCloseDelete={this.onCloseDelete}
            />
          )}
        </div>
      </main>
    )
  }
}
