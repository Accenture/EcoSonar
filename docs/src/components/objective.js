import React from 'react'
import PropTypes from 'prop-types'
import Check from '../images/Icon/Check.svg'

export default function Objective (props) {
  const { title } = props

  return (
    <p><img src={Check} alt=''/>{title}</p>
  )
}

Objective.propTypes = {
  title: PropTypes.string.isRequired
}
