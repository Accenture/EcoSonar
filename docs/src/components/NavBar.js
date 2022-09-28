import React from 'react'
import Logo from '../images/Logo/EcoSonarLogo.svg'

class NavBar extends React.Component {
  constructor () {
    super()
    this.state = {
      selectedPage: ''
    }
  }

  componentDidMount () {
    const url = window.location.pathname
    const tab = url.split('/')
    if (tab[1] === '') {
      this.setState({ selectedPage: 'home' })
    } else {
      this.setState({ selectedPage: tab[1] })
    }
  }

  render () {
    return (
      <div>
        <nav className='navbar'>
          <div className='container-fluid'>
            <div >
              <a href='/'><img src={Logo} className='home-logo' alt='go to home page'/></a>
            </div>
            <ul className='nav navbar-nav navbar-right margin-right row'>
              <li>
                <a className={`${this.state.selectedPage === 'home' ? 'active-tab' : 'navigation'} column`} href='/'>Home</a>
              </li>
              <li>
                <a className={`${this.state.selectedPage === 'how-it-works' ? 'active-tab' : 'navigation'} column`} href='how-it-works'>How it works</a>
              </li>
              <li>
                <a className={`${this.state.selectedPage === 'best-practices' ? 'active-tab' : 'navigation'} column`} href='best-practices'>Best practices</a>
              </li>
              <li>
                <a className={`${this.state.selectedPage === 'who-are-we' ? 'active-tab' : 'navigation'} column`} href='who-are-we'>Who are we?</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}
export default NavBar
