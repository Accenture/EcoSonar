import React from 'react'
import LoadingIcon from '../../../images/LoadingIcon.svg'
import { insertUrlsConfiguration } from '../../../services/configUrlService'
import CrawledUrlItem from './CrawledUrlItem'

export default function CrawlerPage (props) {
  const { setMainUrl, crawledUrls, projectName, addNewUrls, crawlerLoading, hasCrawled, setDisplayCrawler } = props
  const [url, setUrl] = React.useState('')
  const [checkedUrls, setCheckedUrls] = React.useState([])
  const [globalError, setGlobalError] = React.useState('')
  const [allChecked, setAllChecked] = React.useState(false)

  const handleChangeSetUrl = (event) => {
    setUrl(event.target.value)
  }

  const handleChangeCheckedUrls = (checkedUrl) => {
    if (!checkedUrls.includes(checkedUrl)) {
      setCheckedUrls((checkedUrls) => [...checkedUrls, checkedUrl])
    } else {
      setCheckedUrls((checkedUrls) => checkedUrls.filter((url) => url !== checkedUrl))
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

  function compareArray (crawledUrls, checkedUrls) {
    for (let i = 0; i < crawledUrls.length; i++) {
      if (crawledUrls[i] !== checkedUrls[i]) {
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

  const checkCrawledAndNoUrl = () => {
    return hasCrawled && crawledUrls.length === 0
  }

  return (
    <div>
      {crawledUrls.length === 0 && (
        <div>
          <div className='crawler-input'>
            <p className='crawler-message'>I want to automatically search for all pages within my website</p>
            <input
              className='input'
              name='url'
              type='text'
              onChange={handleChangeSetUrl}
              id='webhook-url'
              placeholder='add the base URL or homepage from my website'
              aria-label='add the base URL or homepage from my website'
            />

            <div className='crawler-buttons'>
              <button className='basic-button' aria-label='find pages' onClick={() => setMainUrl(url)} disabled={crawlerLoading}>
                <span>Find pages</span>
              </button>
              <button className='basic-button' aria-label='return to url list' onClick={() => setDisplayCrawler()} disabled={crawlerLoading}>
                <span>Return to url list</span>
              </button>
            </div>
          </div>
          {crawlerLoading && (
            <div className='crawler-loading'>
              <img src={LoadingIcon} alt='' />
              <p>Ecosonar crawler is running. Process can take several minutes according to the size of the website. Leave this page open.</p>
            </div>
          )}
        </div>
      )}

      {crawledUrls.length > 0 && (
        <div className='crawled-url-list'>
          <table className='data-zebra' role='presentation'>
            <tbody>
              <tr>
                <td>
                  <p className='crawler-message'>
                    I want to automatically search for all pages within my website : <span className='url-name'>{url}</span>
                  </p>
                </td>
              </tr>
              <tr className='data-zebra-thead'>
                <td className='head-url'>{'URL'}</td>
                <td>
                  <input
                    type='checkbox'
                    onChange={() => { selectAll() }}
                    checked={allChecked}
                    aria-label='select all'
                  ></input>
                </td>
              </tr>
              {crawledUrls.map((url, index) => {
                return <CrawledUrlItem key={'url-' + index} index={index} url={url} handleChangeCheckedUrls={handleChangeCheckedUrls} checkedUrls={checkedUrls} setAllChecked={setAllChecked} />
              })}
            </tbody>
          </table>
          <div className='crawler-buttons'>
            <button className='basic-button' aria-label='Cancel' onClick={() => setDisplayCrawler()}>
              <span>Cancel</span>
            </button>
            <button className='basic-button' aria-label='Validate list' disabled={!checkedUrls.length} onClick={() => validateList()}>
              <span>Validate list</span>
            </button>
          </div>
          {globalError !== '' && (
            <p className='text-danger' role='alert'>
              {globalError}
            </p>
          )}
        </div>
      )}
      {checkCrawledAndNoUrl() && (
        <p className='crawler-message-no-more-url'>No url detected</p>
      )}
    </div>
  )
}
