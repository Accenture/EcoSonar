import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from '../images/Logo/EcoSonarLogo.svg'

export default function NavBar () {
  const location = useLocation()
  const [selectedPage, setSelectedPage] = useState(location.pathname.replace('/', ''))

  useEffect(() => {
    const urlTab = location.pathname.replace('/', '')
    if (urlTab === '') {
      setSelectedPage('home')
    } else {
      setSelectedPage(urlTab)
    }
  }, [location])

  function selectePageClass (pageName) {
    if (selectedPage === pageName) {
      return 'active-tab'
    } else {
      return 'navigation'
    }
  }

  return (
    <div>
      <nav className='navbar'>
        <div className='container-fluid'>
          <div >
            <a href='/'><img src={Logo} className='home-logo' alt='go to home page' /></a>
          </div>
          <ul className='nav navbar-nav navbar-right margin-right row'>
            <li>
              <Link className={`${selectePageClass('home')} column`} to='/'>Home</Link>
            </li>
            <li>
              <Link className={`${selectePageClass('how-it-works')} column`} to='how-it-works'>How it works</Link>
            </li>
            <li>
              <Link className={`${selectePageClass('best-practices')} column`} to='best-practices'>Best practices</Link>
            </li>
            <li>
              <Link className={`${selectePageClass('who-are-we')} column`} to='who-are-we'>Who are we?</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  )
}
