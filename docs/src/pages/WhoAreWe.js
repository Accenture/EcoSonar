import React from 'react'
import LiquidStudioLogo from '../images/Logo/LiquidStudioLogo.svg'
import AliceHaupais from '../images/People/AliceHaupais.webp'
import ArthurJan from '../images/People/ArthurJan.webp'
import EliaLejzerowicz from '../images/People/EliaLejzerowicz.webp'
import JustinePatte from '../images/People/JustinePatte.webp'
import KevinGalerne from '../images/People/KevinGalerne.webp'
import LeilaThiery from '../images/People/LeilaThiery.webp'
import OlivierDemarez from '../images/People/OlivierDemarez.webp'
import AugustinDeLaTaille from '../images/People/AugustinDeLaTaille.webp'

export default function WhoAreWe () {
  return (
    <div>
      <p className='title-pages'>Who are we ?</p>
      <div className='page-content row'>
        <div className='column'>
          <div className='content-contact-us'>
            <p className='title'>Liquid Studio France</p>
            <p>EcoSonar has been built by the Accenture Liquid Studio France. Our purpose is to help our clients understand how innovative technologies can improve their way of working by delivering innovative Proof of Concepts or Minimum Viable Products. EcoSonar is a project that comes from our reflection to help accelerate business becoming sustainable while minimizing the impact of Technology itself on the environment.</p>
            <form action='mailto:ecosonar-team@accenture.com' method='get' target='_blank'>
              <button aria-label='send a mail to ecosonar team' className='primary contained' type='submit' >Contact us</button>
            </form>
          </div>
        </div>
        <img src={LiquidStudioLogo} className='team-logo' alt='Accenture Liquid Studio France logo' />
      </div>
      <div className='green-container'>
        <div className='content-green-container'>
          <p className='title'>Team</p>
          <div className='row-contact-us space-between'>
            <div>
              <img src={AliceHaupais} alt='Alice Haupais' />
              <p className='name-team bold'>HAUPAIS Alice</p>
              <p className='name-team'>Product Manager</p>
            </div>
            <div>
              <img src={OlivierDemarez} alt='Olivier Demarez' />
              <p className='name-team bold'>DEMAREZ Olivier</p>
              <p className='name-team'>Manager</p>
            </div>
            <div>
              <img src={KevinGalerne} alt='Kevin Galerne' />
              <p className='name-team bold'>GALERNE Kévin</p>
              <p className='name-team'>Developer</p>
            </div>
            <div>
              <img src={LeilaThiery} alt='Leila Thiery' />
              <p className='name-team bold'>THIERY Leïla</p>
              <p className='name-team'>Developer</p>
            </div>
            <div>
              <img src={AugustinDeLaTaille} alt='Augustin De La Taille' />
              <p className='name-team bold'>DE LA TAILLE Augustin</p>
              <p className='name-team'>Developer</p>
            </div>
            <div>
              <img src={JustinePatte} alt='Justine Patte' />
              <p className='name-team bold'>PATTE Justine</p>
              <p className='name-team'>UX/UI Designer</p>
            </div>
            <div>
              <img src={ArthurJan} alt='Arthur Jan' />
              <p className='name-team bold'>JAN Arthur</p>
              <p className='name-team'>Data Scientist</p>
            </div>
            <div>
              <img src={EliaLejzerowicz} alt='Elia Lejzerowicz' />
              <p className='name-team bold'>LEJZEROWICZ Elia</p>
              <p className='name-team'>Data Scientist</p>
            </div>
          </div>
          <p className='row-contact-us'>With the participation of<b>&nbsp;Kugilika Saththinathan, Juul Petit, Louis Muzellec, Marine Guldener and Benjamin Ninassi</b>.</p>
        </div>
      </div>
    </div>
  )
}
