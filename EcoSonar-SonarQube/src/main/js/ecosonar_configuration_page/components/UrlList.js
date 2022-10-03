import React from 'react'
import UrlItem from './UrlItem'

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

  if (error && urlList.length === 0) {
    return (
      <div>
        {crawler}
        <table className='data-zebra' role='presentation'>
          <tbody>
            <tr className='data-zebra-thead'>
              <td className='head-url'>{'URL'}</td>
              <td className='head-url'></td>
            </tr>
          </tbody>
          <p className='text-danger' role='alert'>
            {error}
          </p>
        </table>
      </div>
    )
  } else if (urlList.length === 0) {
    return (
      <div>
        <p className='text-danger' role='alert'>
          {error.noUrlAssigned}
        </p>
      </div>
    )
  }

  return (
    <div>
      {crawler}
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
    </div>
  )
}
