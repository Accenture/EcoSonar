import React from 'react'
import { Link } from 'react-router-dom'
import logoAccenture from '../images/Logo/AccentureLogo.svg'

export default function Footer () {
  return (
    <footer className='footer'>
      <div className='footer-display'>
        <p className='no-margin'>© 2022 EcoSonar | All rights reserved</p>
      </div>
      <div className='footer-display'>
        <p className='no-margin small-font'>
          <Link className='footer-legal-issues' to='legal-issues'>Legal issues</Link> | Powered by
          <img src={logoAccenture} alt='Accenture logo' className='logo-accenture' />
        </p>
      </div>
    </footer>
  )
}
