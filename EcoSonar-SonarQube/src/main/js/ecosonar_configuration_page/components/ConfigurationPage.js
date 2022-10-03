import React from 'react'
import LoadingIcon from '../../images/LoadingIcon.svg'
import { getUrlsConfiguration } from '../../services/configUrlService'
import { crawl } from '../../services/crawlerService'
import AddUrlForm from './AddUrlForm'
import CrawlerPage from './Crawler/CrawlerPage'
import DeleteUrlForm from './DeleteUrlForm'
import UrlList from './UrlList'

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
      crawledUrls: [],
      crawlerLoading: false,
      displayCrawler: false,
      hasCrawled: false
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
    this.setState({ crawledUrls: [] })
    this.setState({ displayCrawler: false })
    this.setState({ hasCrawled: false })
  };

  setMainUrl = async (url) => {
    this.setState({ crawlerLoading: true })
    await crawl(this.state.projectName, url.trim()).then((response) => {
      this.setState({ crawlerLoading: false })
      this.setState({ crawledUrls: response })
      this.setState({ hasCrawled: true })
    })
  };

  setDisplayCrawler = () => {
    this.setState({ displayCrawler: !this.state.displayCrawler })
    this.setState({ crawledUrls: [] })
    this.setState({ hasCrawled: false })
  };

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
            setMainUrl={this.setMainUrl}
            crawledUrls={this.state.crawledUrls}
            projectName={this.state.projectName}
            addNewUrls={this.addNewUrls}
            crawlerLoading={this.state.crawlerLoading}
            hasCrawled={this.state.hasCrawled}
            setDisplayCrawler={this.setDisplayCrawler}
          />
        </div>
      )
    }
  };

  render () {
    return (
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
        <main role='main' aria-hidden='true'>
          {!this.state.loading ? this.checkUrl() : <img src={LoadingIcon} alt='Loading icon' />}

          {this.state.deleting && (
            <div className='boxed-group'>
              <DeleteUrlForm
                urlList={this.state.urls}
                index={this.state.indexToDelete}
                projectName={this.state.projectName}
                deletedUrlState={this.deletedUrlState}
                onCloseDelete={this.onCloseDelete}
              />
            </div>
          )}
        </main>
      </div>
    )
  }
}
