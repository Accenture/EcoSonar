import React from 'react'
import UrlItem from './UrlItem'

export default function UrlList (props) {
  if (props.urlList.length === 0) {
    return (
      <div>
        {props.error !== '' && <p className="text-danger">{props.error}</p>}
        <p>
          Your project has no url assigned into EcoSonar. You must at least add
          one url if you want to analyse ecodesign practices.
        </p>
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
