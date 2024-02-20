import React from 'react'
import { insertUrlsConfiguration } from '../../../services/configUrlService'
import CrawledUrlItem from './CrawledUrlItem'
import { crawl, getCrawl } from '../../../services/crawlerService'
import errors from '../../../utils/errors.json'
import formatError from '../../../format/formatError'

export default function CrawlerPage (props) {
  const {
    projectName,
    addNewUrls,
    setDisplayCrawler
  } = props
  const [url, setUrl] = React.useState('')
  const [checkedUrls, setCheckedUrls] = React.useState([])
  const [globalError, setGlobalError] = React.useState('')
  const [allChecked, setAllChecked] = React.useState(false)
  const [autoSaveUrlsResult, setAutoSaveUrlsResult] = React.useState(false)
  const [crawledUrls, setCrawledUrls] = React.useState([])
  const [crawlerLoading, setCrawlerLoading] = React.useState(false)
  const [crawlerLaunched, setCrawlerLaunched] = React.useState(false)
  const [crawlerErrorMessage, setCrawlerErrorMessage] = React.useState('')

  const handleChangeSetUrl = (event) => {
    setUrl(event.target.value)
  }

  const handleChangeCheckedUrls = (checkedUrl) => {
    if (!checkedUrls.includes(checkedUrl)) {
      setCheckedUrls((checkedUrlList) => [...checkedUrlList, checkedUrl])
    } else {
      setCheckedUrls((checkedUrlList) =>
        checkedUrlList.filter((urlObject) => urlObject !== checkedUrl)
      )
    }
  }

  const validateList = async () => {
    await insertUrlsConfiguration(projectName, checkedUrls)
      .then(() => {
        addNewUrls(checkedUrls)
      })
      .catch((result) => {
        if (result instanceof Error) {
          setGlobalError(result.message)
        }
      })
  }

  const compareArray = (crawledUrlsObject, checkedUrlsObject) => {
    for (let i = 0; i < crawledUrlsObject.length; i++) {
      if (crawledUrlsObject[i] !== checkedUrlsObject[i]) {
        return false
      }
    }
    return true
  }

  const selectAll = () => {
    const equals = compareArray(crawledUrls, checkedUrls)
    if (!equals) {
      setCheckedUrls(crawledUrls)
      setAllChecked(true)
    } else {
      setCheckedUrls([])
      setAllChecked(false)
    }
  }

  const handleChangeAutoSaveUrlsResult = () => {
    setAutoSaveUrlsResult(!autoSaveUrlsResult)
  }

  const launchCrawler = (url, autoSave) => {
    setCrawlerLoading(true)
    setCrawlerErrorMessage('')
    crawl(projectName, url.trim(), autoSave).then(() => {
      setCrawlerLoading(false)
      setCrawlerLaunched(true)
    })
      .catch((error) => {
        setCrawlerLoading(false)
        if (error instanceof Error) {
          setCrawlerErrorMessage(error.message)
        }
      })
  }

  const getCrawlerResult = async () => {
    setCrawlerLoading(true)
    setCrawlerErrorMessage('')
    await getCrawl(projectName).then((response) => {
      setCrawlerLoading(false)
      if (response.length > 0) {
        setCrawledUrls(response)
      } else {
        setCrawlerErrorMessage(formatError(errors.errorCrawlingEmpty, projectName))
      }
      setCrawlerLaunched(false)
    }).catch((error) => {
      setCrawlerLoading(false)
      if (error instanceof Error) {
        setCrawlerErrorMessage(error.message)
      }
    })
  }

  return (
    <div>
      <div className="url-list-button">
        <p className="crawler-message">
          I want to automatically search for all pages within my website
        </p>
      </div>
      <div className="crawler-buttons">
        <input
          className="input-crawler"
          name="url"
          type="text"
          onChange={handleChangeSetUrl}
          id="webhook-url"
          placeholder="Add the homepage from my website"
          aria-label="add the homepage from my website"
        />
        <label
          className="switch"
          htmlFor="checkbox"
          style={{ position: 'unset' }}
        >
          <input
            type="checkbox"
            checked={autoSaveUrlsResult}
            aria-checked={autoSaveUrlsResult}
            tabIndex={0}
            aria-labelledby="checkbox"
            onChange={() => handleChangeAutoSaveUrlsResult()}
            id="checkbox"
          />
          <div></div>
          <p className="crawler-message">
            Save urls as to be audited by EcoSonar
          </p>
        </label>
        <button
          className="basic-button"
          aria-label="launch-crawler"
          onClick={() => launchCrawler(url, autoSaveUrlsResult)}
          disabled={crawlerLoading || url === '' || crawledUrls.length > 0}
        >
          <span>Launch Crawler</span>
        </button>
        <button
          className="basic-button"
          aria-label="return to url list"
          onClick={() => setDisplayCrawler()}
          disabled={crawlerLoading}
        >
          <span>Return to url list</span>
        </button>
      </div>
      {crawledUrls.length === 0 && (
        <div>
          <div>
            <p className="crawler-message">
              If you previoulsy crawled your website, click directly on the button below.
            </p>
            <button
              className="basic-button"
              aria-label="return to url list"
              onClick={() => getCrawlerResult()}
              disabled={crawlerLoading}
            >
              <span>Get Crawled URLs</span>
            </button>
          </div>
          <div>
            {crawlerLaunched && (
              <div className="crawler-loading">
                <p>
                  Ecosonar crawler is running. Process can take several minutes
                  according to the size of the website. If you enabled the Save
                  option, URLS crawled will be saved automatically in the URL
                  Configuration list. Otherwise by default, the URLs crawled
                  will be saved in a temporary database and made available to
                  you by clicking on the button Get Crawler Result.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <p className='text-danger' role='alert'>
        {crawlerErrorMessage}
      </p>
      {crawledUrls.length > 0 && (
        <div className="crawled-url-list">
          <table className="data-zebra" role="presentation">
            <tbody>
              <tr>
                <td>
                  <p className="crawler-message">
                    Find below the URLs previously crawled for this project. Please select those you wish EcoSonar to audit.
                  </p>
                </td>
              </tr>
              <tr className="data-zebra-thead">
                <td className="head-url">{'URL'}</td>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => {
                      selectAll()
                    }}
                    checked={allChecked}
                    aria-label="select all"
                  ></input>
                </td>
              </tr>
              {crawledUrls.map((crawledUrl, index) => {
                return (
                  <CrawledUrlItem
                    key={'url-' + index}
                    index={index}
                    url={crawledUrl}
                    handleChangeCheckedUrls={handleChangeCheckedUrls}
                    checkedUrls={checkedUrls}
                    setAllChecked={setAllChecked}
                  />
                )
              })}
            </tbody>
          </table>
          <div className="crawler-buttons">
            <button
              className="basic-button"
              aria-label="Cancel"
              onClick={() => setDisplayCrawler()}
            >
              <span>Cancel</span>
            </button>
            <button
              className="basic-button"
              aria-label="Validate list"
              disabled={!checkedUrls.length}
              onClick={() => validateList()}
            >
              <span>Validate</span>
            </button>
          </div>
          {globalError !== '' && (
            <p className="text-danger" role="alert">
              {globalError}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
