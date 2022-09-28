import React from 'react'
import Accordion from '../components/accordion'
import PlusIcon from '../images/Icon/Plus.svg'
import ThreeDotIcon from '../images/Icon/ThreeDot.svg'
import EcoSonarLogo from '../images/Logo/EcoSonarLogo2.svg'
import GreenITLogo from '../images/Logo/GreenITLogo.svg'
import LighthouseLogo from '../images/Logo/LighthouseLogo.svg'
import SonarQubeLogo from '../images/Logo/SonarQubeLogo.svg'

const accordionList = [
  {
    title: 'Sonarqube',
    icon: SonarQubeLogo,
    ariaLabel: 'open explication of code analysis tool Sonarqube',
    content: <p><a className='link bold' href='https://www.sonarqube.org/'>Sonarqube</a> is a well-known code analysis tool that allows users to write cleaner and safer code. He is able to detect quite a number of security vulnerabilities as well as code smells (bad development practices). He was developed by SonarSource and does now offer code analysis on 29 programming languages. Sonarqube can be integrated directly into CI/CD pipelines to provide automatic reviews and continuous improvement.</p>
  },
  {
    title: 'GreenIT-Analysis',
    icon: GreenITLogo,
    ariaLabel: 'open explication of the greenit analysis audit',
    content: <p>The audit allows:<br /><br />
      • to measure the EcoIndex of a website as defined by <a className='link bold' href='http://www.ecoindex.fr/quest-ce-que-ecoindex/'>the EcoIndex website.</a> Click <a className='link bold' href='https://blog.octo.com/sous-le-capot-de-la-mesure-ecoindex/'>here</a> for a detailed article about EcoIndex.<br /><br />
      • to verify the application of best practices in web eco-design defined by the <a className='link bold' href='https://collectif.greenit.fr/ecoconception-web/'>&apos;Responsible digital collective&apos;</a> and <a className='link bold' href='http://www.ecometer.org/rules/'>Ecometer</a>.<br /><br />
      EcoSonar is a fork of the audit tool made by “Responsible digital collective” <a className='link bold' href='https://github.com/cnumr/GreenIT-Analysis-cli'>Green-IT Analysis</a>.<br /><br />
      You can also use it directly through your web browser using <a className='link bold' href='https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=fr'>this Chrome Extension.</a></p>
  },
  {
    title: 'Lighthouse Performance',
    icon: LighthouseLogo,
    ariaLabel: 'explication of the lihthouse performance audit',
    content: <p><a className='link bold' href='https://web.dev/performance-scoring/'>Lighthouse performance</a> calculates your overall Performance score based on the following metric values: <br /><br />
      <a className='link bold' href='https://web.dev/first-contentful-paint/'>• First Contentful Paint.</a><br /><br />
      <a className='link bold' href='https://web.dev/speed-index/'>• Speed Index.</a><br /><br />
      <a className='link bold' href='https://web.dev/lcp/'>• Largest Contentful Paint.</a><br /><br />
      <a className='link bold' href='https://web.dev/interactive/'>• Time to Interactive.</a><br /><br />
      <a className='link bold' href='https://web.dev/lighthouse-total-blocking-time/'>• Total Blocking Time.</a><br /><br />
      <a className='link bold' href='https://web.dev/cls/'>• Cumulative Layout Shift.</a><br /><br />
      These metrics are then converted into scores and weighted to give the <a className='link bold' href='https://googlechrome.github.io/lighthouse/scorecalc/'>final performance score</a>.<br />
      To improve your overall score, Lighthouse provides you a list of opportunities to implement with personalized details. We have filtered this list of opportunities to keep only ones that are related to ecodesign.</p>
  },
  {
    title: 'Lighthouse Accessibility',
    icon: LighthouseLogo,
    ariaLabel: 'explication of the lighthouse accessibility audit',
    content: <p>This audit is based on <a className='link bold' href='https://www.w3.org/WAI/standards-guidelines/wcag'>WCAG guidelines</a> that can be measured automatically. You can find <a className='link bold' href='https://web.dev/lighthouse-accessibility/'>here</a> the list of accessibility checks that have been integrated into Lighthouse.It will check for opportunities to improve the accessibility of your website and gives your <a className='link bold' href='https://web.dev/accessibility-scoring/'>score</a> according to the passed audits. However, only a subset of accessibility issues can be automatically detected so we encourage manual testing and dedicated training.</p>
  }
]

export default function HowItWorks () {
  return (
    <div>
      <h1 className='title-pages'>How it works?</h1>
      <div className='howitworks-content'>
        <p className='title'>Ecodesign and Accessibility Best Practices</p>
        <div className='additional-block'>
          <div className='white-card'>
            <div className='center-children'>
              <div className='center-children-col calcul-tools '>
                <img src={GreenITLogo} alt='plus sign' className='audits-img' />
                <div >
                  <p className='green bold no-space-up-down'>Greenit-Analysis-cli</p>
                  <p className='no-space-up-down' >based on Ecometer rules</p>
                </div>
              </div>
              <img src={PlusIcon} alt='plus sign' className='plus-sign' />
              <div className='center-children-col calcul-tools '>
                <img src={LighthouseLogo} alt='' className='audits-img' />
                <p className='green bold'>Google Lighthouse</p>
              </div>
              <img src={PlusIcon} alt='plus sign' className='plus-sign' />
              <div className='center-children-col calcul-tools '>
                <img src={ThreeDotIcon} alt='' className='audits-img'/>
                <p className='green'>and many others potential eco-design and accessibility audits</p>
              </div>
            </div>
            <div className='center-children-col'>
              <h2 className='title'>EcoSonar API</h2>
              <p><span className='green center'>A standalone API</span> that will run audits on your website pages. EcoSonar worked as an audit aggregator to<span className='green'> run dynamic analysis of your code</span> (how your page will be rendered within a browser).</p>
            </div>
          </div>
          <img src={PlusIcon} alt='plus' className='plus-sign' />
          <div className='white-card'>
            <img src={SonarQubeLogo} alt='plus' className='sonarqube-logo' />
            <div className='center-children-col'>
              <h2 className='title'>EcoSonar plugin</h2>
              <p><span className='green'>A Sonarqube plugin</span> to include EcoSonar audits <span className='green'>into your Sonarqube project</span> and launch <span className='green'>automatically</span> EcoSonar analysis once a Sonarqube analysis is triggered.
              </p>
            </div>
          </div>
        </div>
        <div className='addition-result'>
          <p className='box-number'>=</p>
          <img src={EcoSonarLogo} alt='result ecosonar tool' className='ecosonar-logo' />
          <p className='basic-content'>EcoSonar</p>
        </div>
      </div>
      <div className='green-container'>
        <div className='content-green-container'>
          <p className='title strenghs'>Our strenghs</p>
          <p>EcoSonar purpose is to <b>integrate directly into developers tool suite</b> eco-design and best practices audits to allow <b>continous improvement</b> and add <b>key sustainability metrics within reach</b>.</p>
          <div className='row'>
            <div className='cards-good-practices center-children-col'>
              <p className='box-number'>1</p>
              <div>
                <p className='text-good-practices-card bold'>An industrialized audit aggregator</p>
                <p className='text-good-practices-card' >all your audits run automatically and available in one place</p>
              </div>
            </div>
            <div className='cards-good-practices center-children-col'>
              <p className='box-number'>2</p>
              <div>
                <p className='text-good-practices-card bold'>CI/CD pipeline integration for continuous improvement</p>
                <p className='text-good-practices-card'>either with Sonarqube or with an API Request</p>
              </div>
            </div>
            <div className='cards-good-practices center-children-col'>
              <p className='box-number'>3</p>
              <div>
                <p className='text-good-practices-card bold'>Analysis of your website and not a single URL</p>
                <p className='text-good-practices-card'>to detect eco-design practices that can be resolved through project configuration</p>
              </div>
            </div>
            <div className='cards-good-practices center-children-col'>
              <p className='box-number'>4</p>
              <div>
                <p className='text-good-practices-card bold'>Custom recommendations on best practices to implement </p>
                <p className='text-good-practices-card'>with details specific and a How-To guide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='audits'>
        <p className='title tools-title'>Integrated tools</p>
        <div className='audits-content'>
          {accordionList.map((value, index) => (
            <Accordion icon={value.icon} key={index} title={value.title} ariaLabel={value.ariaLabel} content={value.content} />
          ))}
        </div>
      </div>
    </div>
  )
}
