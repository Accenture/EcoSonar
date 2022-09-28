import React from 'react'
import PropTypes from 'prop-types'

export default function News (props) {
  const { title, date, description } = props

  return (
    <div className='news-card-home card-panel'>
      <p className='date-news-card'>{date}</p>
      <p className='title-news-card'>{title}</p>
      <hr className='divider'/>
      <hr className='Line-news-card'/>
      <p className='desc-news-card'>{description}</p>
    </div>
  )
}

News.propTypes = {
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}
