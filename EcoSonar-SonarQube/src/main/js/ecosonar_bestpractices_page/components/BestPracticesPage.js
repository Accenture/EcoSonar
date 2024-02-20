import React, { useEffect, useState } from 'react'
import { getBestPractices, getBestPracticesForUrl } from '../../services/bestpracticesService'
import { getProcedure, addProcedure } from '../../services/procedureService'
import { getUrlsConfiguration } from './../../services/configUrlService'
import ProcedureChoice from './Procedure/ProcedureChoice'
import AccessibilityAlert from '../../utils/AccessibilityAlert'
import BestPracticesBody from './BestPracticesBody'
import formatError from '../../format/formatError'
import errors from '../../utils/errors.json'

export default function BestPracticesPage (props) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveProcedureError, setSaveProcedureError] = useState('')
  const [isFolded, setIsFolded] = useState(false)
  const [bestPracticesEcodesign, setBestPracticesEcodesign] = useState({})
  const [bestPracticesAccessibility, setBestPracticesAccessibility] = useState({})
  const [dateAnalysisBestPractices, setDateAnalysisBestPractices] = useState('')
  const [selectedProcedure, setSelectedProcedure] = useState('')
  const [savedProcedure, setSavedProcedure] = useState('')
  const [editProcedureMode, setEditProcedureMode] = useState(false)
  const [ariaAlertForAccessibility, setAriaAlertForAccessibility] = useState(false)
  const [urls, setUrls] = useState([])
  const [selectedUrl, setSelectedUrl] = useState('All')

  const ariaHidden = true

  useEffect(() => {
    setLoading(true)
    getProcedure(props.project.key)
      .then((procedure) => {
        if (procedure.procedure === '') {
          setSavedProcedure('scoreImpact')
        } else {
          setSavedProcedure(procedure.procedure)
        }
        setEditProcedureMode(false)
        getUrlsConfiguration(props.project.key)
          .then((data) => {
            data.unshift('All')
            setUrls(data)
          })
          .catch((result) => {
            if (result instanceof Error) {
              setError(result.message)
              setLoading(false)
            }
          })
        getBestPractices(props.project.key)
          .then((data) => {
            if (Object.keys(data).length === 0) {
              setError(formatError(errors.noAnalysisLaunched, props.project.key))
            } else {
              setResultData(data)
            }
            setLoading(false)
          })
          .catch((result) => {
            if (result instanceof Error) {
              setError(result.message)
            }
            setLoading(false)
          })
      })
      .catch((result) => {
        if (result instanceof Error && result.message === '') {
          setEditProcedureMode(true)
        } else if (result instanceof Error) {
          setError(result.message)
        }
        setLoading(false)
      })
  }, [])

  async function changeSelectedUrl (event) {
    setError(null)
    setLoading(true)
    setSelectedUrl(event.target.value)
    if (event.target.value === 'All') {
      getBestPractices(props.project.key)
        .then((data) => {
          if (Object.keys(data).length === 0) {
            setError(formatError(errors.noAnalysisLaunched, props.project.key))
          } else {
            setResultData(data)
          }
        })
        .catch((result) => {
          if (result instanceof Error) {
            setError(result.message)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      getBestPracticesForUrl(props.project.key, event.target.value)
        .then((data) => {
          if (Object.keys(data).length === 0) {
            setError(formatError(errors.noAnalysisFoundForURL, props.project.key, event.target.value))
          } else {
            setResultData(data)
          }
        })
        .catch((result) => {
          if (result instanceof Error) {
            setError(result.message)
          }
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  function selectProcedure (name) {
    setSelectedProcedure(name)
    setSaveProcedureError('')
  }

  function changeProcedure () {
    setEditProcedureMode(true)
  }

  function cancel () {
    setSelectedProcedure('')
    setEditProcedureMode(false)
  }

  function confirm () {
    setLoading(true)
    addProcedure(props.project.key, selectedProcedure)
      .then(() => {
        setSavedProcedure(selectedProcedure)
        setEditProcedureMode(false)
        getUrlsConfiguration(props.project.key)
          .then((data) => {
            data.unshift('All')
            setUrls(data)
          })
          .catch((result) => {
            if (result instanceof Error) {
              setError(result.message)
            }
          })
        getBestPractices(props.project.key)
          .then((data) => {
            if (Object.keys(data).length === 0) {
              setError(formatError(errors.noAnalysisLaunched, props.project.key))
            } else {
              setResultData(data)
            }
          })
          .catch((result) => {
            if (result instanceof Error) {
              setError(result.message)
            }
          })
      })
      .catch((err) => {
        if (err instanceof Error) {
          setSaveProcedureError(err.message)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function setResultData (data) {
    setBestPracticesEcodesign(data.ecodesign)

    setBestPracticesAccessibility(data.accessibility)
    const formattedDate3 = new Date(data.dateAnalysisBestPractices)
    setDateAnalysisBestPractices(`${formattedDate3.toDateString()} - ${formattedDate3.toLocaleTimeString([], { hour12: false })}`)
  }

  function handleAccessibilityAlert () {
    setAriaAlertForAccessibility(false)
    setAriaAlertForAccessibility(true)
  }

  function handleCloseAll () {
    setIsFolded(!isFolded)
    handleAccessibilityAlert()
  }

  return (
    <main role='main' className='page' aria-hidden={ariaHidden}>
      <h1 className='title-best-practices'>
        Best Practices for project {props.project.key} - last analysis at {dateAnalysisBestPractices}
      </h1>
      <div className='header-best-practices'>
        <p>
          When analysing the different pages from your website, EcoSonar will be able to detect if some ecodesign good practices have been implemented in your web application. For each practices
          analysed, it will give you a score from A to G according to the compliance level and will guide you to apply them. Achieve an A Score in each of the practices to better optimize your
          ressources.
        </p>
      </div>
      {ariaAlertForAccessibility && <AccessibilityAlert />}
      {editProcedureMode
        ? (
          <ProcedureChoice
            loading = {loading}
            saveProcedureError = {saveProcedureError}
            error = {error}
            selectedProcedure = {selectedProcedure}
            selectProcedure = {selectProcedure}
            cancel = {cancel}
            confirm = {confirm}
            savedProcedure = {savedProcedure}
          />
          )
        : (
            <div className='best-practices'>
              {loading
                ? <div className="loader"></div>
                : <BestPracticesBody
                    isFolded={isFolded}
                    setIsFolded={setIsFolded}
                    handleCloseAll={handleCloseAll}
                    error={error}
                    urls={urls}
                    selectedUrl={selectedUrl}
                    changeSelectedUrl={changeSelectedUrl}
                    bestPracticesEcodesign={bestPracticesEcodesign}
                    bestPracticesAccessibility={bestPracticesAccessibility}
                    savedProcedure={savedProcedure}
                    changeProcedure={changeProcedure}
                    />
                  }
            </div>
          )}
    </main>
  )
}
