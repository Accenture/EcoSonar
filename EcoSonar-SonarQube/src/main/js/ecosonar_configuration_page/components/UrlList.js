import React from 'react'
import UrlItem from './UrlItem'
import Errors from '../../utils/errors.json'

export default function UrlList (props) {
  const { error, urlList, onDelete, setDisplayCrawler } = props

  const crawler = (
    <div className='url-list-button'>
      <p className='crawler-message'>I want to automatically search for all pages within my website</p>
      <button
        aria-label='Find pages'
        className='basic-button'
        onClick={() => {
          setDisplayCrawler()
        }}
      >
        <span>Find pages</span>
      </button>
    </div>
  )

  const emptyTabWithError = (
    <>
      <table className='data-zebra' role='presentation'>
        <tbody>
          <tr className='data-zebra-thead'>
            <td className='head-url'>{'URL'}</td>
            <td className='head-url'></td>
          </tr>
        </tbody>
      </table>
      <p className='text-danger' role='alert'>
        {error}
      </p>
    </>
  )

  const noUrl = (
    <><table className='data-zebra' role='presentation'>
      <tbody>
        <tr className='data-zebra-thead'>
          <td className='head-url'>{'URL'}</td>
          <td className='head-url'></td>
        </tr>
      </tbody>
    </table><p className='text-danger' role='alert'>
        {Errors.noUrlAssigned}
      </p></>
  )

  const filledTab = (
    <table className='data-zebra' role='presentation'>
      <tbody>
        <tr className='data-zebra-thead'>
          <td className='head-url'>{'URL'}</td>
          <td className='head-url'></td>
        </tr>
        {urlList.map((url, index) => {
          return <UrlItem key={'url-' + index} onDelete={onDelete} index={index} url={url} />
        })}
      </tbody>
    </table>
  )

  const urlListBody = urlList.length === 0 ? noUrl : filledTab
  return (
    <div>
      {crawler}
      {error && urlList.length === 0
        ? emptyTabWithError
        : urlListBody
      }
    </div>
  )
}
