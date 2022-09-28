import React from 'react'
import PropTypes from 'prop-types'

export default function Key (props) {
  const { icon, keyNumber, contentPart1, contentPart2 } = props

  return (
    <div className='card-home card-panel'>
      <img className='icon' alt='pie icon' src={icon}/>
      {contentPart1 && <p className='text-key'>{contentPart1}</p>}
      <p className='key-number'>{keyNumber}</p>
      {contentPart2 && <p className='text-key'>{contentPart2}</p>}
    </div>
  )
}

Key.propTypes = {
  icon: PropTypes.string.isRequired,
  keyNumber: PropTypes.string.isRequired,
  contentPart1: PropTypes.string,
  contentPart2: PropTypes.string
}
