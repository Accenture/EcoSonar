import React from 'react'
import UrlItem from './UrlItem'
import error from '../../utils/errors.json'

export default function UrlList (props) {
  if (props.error && props.urlList.length === 0) {
    return (
      <div>
      <p className='text-danger'>{props.error}</p>
      </div>
    )
  } else if (props.urlList.length === 0) {
    return (
      <div>
      <p className='text-danger'>{error.noUrlAssigned}</p>
      </div>
    )
  }
  return (
    <table className="data-zebra">
      <thead className="data-zebra-thead">
        <tr>
          <th className="head-url">{'URL'}</th>
          <th className="head-url"></th>
        </tr>
      </thead>
      <tbody>
        {props.urlList.map((url, index) => {
          return (
            <UrlItem
              key = {'url-' + index}
              onDelete = {props.onDelete}
              index = {index}
              url = {url}
            />
          )
        })}
      </tbody>
    </table>
  )
}
