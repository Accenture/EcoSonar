import React from 'react'
import Key from '../components/key'
import News from '../components/news'
import Objective from '../components/objective'
import youlazyInit from '../globalFunctions/youlazyInit'
import FlowerIcon from '../images/Flower/FlowerIcon.svg'
import FlowerWhite1 from '../images/Flower/FlowerWhite1.svg'
import FlowerWhite2 from '../images/Flower/FlowerWhite2.svg'
import Bubble from '../images/Icon/Bubble.svg'
import co2 from '../images/Icon/Co2.svg'
import Pie from '../images/Icon/Pie.svg'
import Server from '../images/Icon/Server.svg'

const newsList = [
  { title: 'ecosonar.org', date: 'September 26th 2022', description: 'Release of EcoSonar Website : ecosonar.org' },
  { title: 'EcoSonar V2', date: 'July 13th 2022', description: 'Integration of Google Lighthouse audits with 24 new ecodesign and 44 accessibility audits' },
  { title: 'EcoSonar Release', date: 'April 12th 2022', description: 'First Release of EcoSonar with integration of 24 ecodesign best practices' }
]

const keyList = [
  { icon: co2, contentPart1: 'Web creation represents', contentPart2: 'Share of digital in global carbon emission', keyNumber: '4%' },
  { icon: Pie, contentPart1: 'Digital carbon footprint increases', contentPart2: 'per year', keyNumber: '8%' },
  { icon: Bubble, contentPart2: 'Comes from usages, driven by developers', keyNumber: '55%' },
  { icon: Server, contentPart2: 'operative servers around the world', keyNumber: '45 million' }
]

class Home extends React.Component {
  componentDidMount () {
    youlazyInit()
  }

  render () {
    return (
      <div>
        <div className='banner-home'>
          <div className='title-introduction'>
            <p className='banner banner-title no-margin'>EcoSonar</p>
            <div className='banner-flex-title'>
              <p className='banner banner-subtitle no-margin'>Eco-design audit tool to
                <br /><span className='banner'> minimize web carbon footprint</span> easily</p>
            </div>
            <form action='https://github.com/Accenture/EcoSonar' method='get' target='_blank'>
              <button aria-label='redirection to the github of ecosonar' className='btn-access-tool' type='submit' >Score your website</button>
            </form>
          </div>
        </div>
        <div className='key-figures'>
          <p className='title key-figures-text'>Why promoting <b>eco-design?</b></p>
          <div className='row'>
            {keyList.map((keyElement, index) => (
              <Key key={index} icon={keyElement.icon} contentPart1={keyElement.contentPart1} contentPart2={keyElement.contentPart2} keyNumber={keyElement.keyNumber} />
            ))}
          </div>
        </div>
        <div className='objectives-ecosonar'>
          <p className='title bold section-title'>EcoSonar, the eco-design audit tool</p>
          <div className='row content'>
            <div className='objectives'>
              <div>
                <p className='sub-title'>Our <b>objectives</b></p>
                <div className='objective'>
                  <img alt='' src={FlowerIcon} />
                  <p className='objective-text'><span>Raising awareness</span> to environmental issues and eco-design practices</p>
                </div>
                <div className='objective'>
                  <img alt='' src={FlowerIcon} className='img-rotate'/>
                  <p className='objective-text'>Measuring the <span>carbon impact</span> across digital services</p>
                </div>
                <div className='objective'>
                  <img alt='' src={FlowerIcon} />
                  <p className='objective-text'>Proving that <span>websites can have minimal carbon footprint</span></p>
                </div>
                <div className='objective'>
                  <img alt='' src={FlowerIcon} className='img-rotate'/>
                  <p className='objective-text'>Get an <span>environmental & performance</span> monitoring solution</p>
                </div>
              </div>
              <form action='https://github.com/Accenture/EcoSonar/blob/main/README.md' method='get' target='_blank'>
                <button aria-label='redirection to the EcoSonar user guide' type='submit' >User guide</button>
              </form>
            </div>
            <div className='youtube-video'>
              <a href='https://www.youtube.com/watch?v=DoAoMxHIYAE' aria-label='EcoSonar Presentation Video' target='_blank' className='youlazy' data-w='480' data-h='270' data-start='100' rel='noreferrer'>EcoSonar Presentation Video</a>
            </div>
          </div>
        </div>
        <div className='solutions-differentiators'>
          <img alt='' src={FlowerWhite1} className='img-flower1' />
          <div className='row'>
            <div className='text-solutions-differentiators'>
              <div className='column'>
                <p className='title'>About <b>EcoSonar</b></p>
                <div className='check-solutions-differentiators'>
                  <Objective title='Open source' />
                  <Objective title='Integrated into CI/CD pipelines: through Sonarqube or API Request' />
                  <Objective title='Based on standard, recognized and open-source audits' />
                  <Objective title='Decision support to help delivery teams reduce efficiently environmental impact' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='contribute-project'>
          <div className='contribute-block'>
            <p className='title'><b>Contribute</b> to the project</p>
            <div>
              <p className='content'>
                EcoSonar is a young tool that will be <span className='green-text'>constantly evolving</span> and adapting the documentation to the latest technologies and solutions. Keeping this release pace is hard but <span> with your help we can build features faster</span> and make our team grow.
              </p>
              <p className='content'>
                Contributing to the project will help <span className='green-text'>eco-design practices to be in the mainstream landscape</span> of website creation.
              </p>
            </div>
            <div className='contribute-buttons'>
              <form action='https://github.com/Accenture/EcoSonar/blob/main/CONTRIBUTING.md' method='get' target='_blank'>
                <button aria-label='redirection to contributing' className='contained' type='submit' >Make a contribution</button>
              </form>
              <form action='https://github.com/Accenture/EcoSonar' method='get' target='_blank'>
                <button className='outlined' aria-label='redirection to github repo' type='submit' >Go to our Github</button>
              </form>
            </div>
          </div>
          <div className='img-flower-right'>
            <img alt='' src={FlowerWhite2} className='img-flower2' />
          </div>
        </div>
        <div className='news'>
          <p className='title'>Latest<b> News</b></p>
          <div className='row center'>
            {newsList.map((news, index) => (
              <News date={news.date} title={news.title} description={news.description} key={index} />
            ))}
          </div>
          {newsList.length > 4 &&
            <div>
              <button className='outlined left' aria-label='See more news'>More news...</button>
            </div>}
        </div>
        {/* <div className='green-container'>
          <div className='content-green-container'>
            <h4>They trust us</h4>
            <p>These companies are reducing their digital carbon footprint with EcoSonar</p>
            <img className='icon' src={WeDontHaveTheImageForNow} alt='logo of XXX company'/>
            <img className='icon' src={WeDontHaveTheImageForNow} alt='logo of XXX company'/>
            <img className='icon' src={WeDontHaveTheImageForNow} alt='logo of XXX company'/>
            <img className='icon' src={WeDontHaveTheImageForNow} alt='logo of XXX company'/>
            <img className='icon' src={WeDontHaveTheImageForNow} alt='logo of XXX company'/>
            <img className='icon' src={WeDontHaveTheImageForNow} alt='logo of XXX company'/>
          </div>
        </div> */}
      </div>
    )
  }
}

export default Home
