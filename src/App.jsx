import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing'
import Hub from './pages/Hub'
import Timeline from './pages/Timeline'
import Definitions from './pages/Definitions'
import DefinitionDetail from './pages/DefinitionDetail'
import Agitators from './pages/Agitators'
import AgitatorDetail from './pages/AgitatorDetail'
import Huckabee36Falsehoods from './pages/Huckabee36Falsehoods'
import Misconceptions from './pages/Misconceptions'
import MisconceptionTopic from './pages/MisconceptionTopic'
import MisconceptionEntryDetail from './pages/MisconceptionEntryDetail'
import Conspiracies from './pages/Conspiracies'
import ConspiracyDetail from './pages/ConspiracyDetail'
import Talmud from './pages/Talmud'
import TalmudDetail from './pages/TalmudDetail'
import Slideshow from './pages/Slideshow'
import Stylesheet from './pages/Stylesheet'
import Layout from './components/Layout'
import ContactFAB from './components/ContactFAB'
import { TransitionContext } from './context/TransitionContext'
import './App.css'

const EXIT_MS = 320
const ENTER_MS = 320

function AppRoutes() {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionState, setTransitionState] = useState('idle')
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      setDisplayLocation(location)
      return
    }
    if (location.key === displayLocation.key) return

    setTransitionState('exiting')
    const exitTimer = setTimeout(() => {
      setDisplayLocation(location)
      setTransitionState('entering')
      const enterTimer = setTimeout(() => setTransitionState('idle'), ENTER_MS)
      return () => clearTimeout(enterTimer)
    }, EXIT_MS)
    return () => clearTimeout(exitTimer)
  }, [location, displayLocation.key])

  const currentYear = new Date().getFullYear()
  return (
    <TransitionContext.Provider value={transitionState}>
      <Routes location={displayLocation}>
        <Route path="/" element={<Landing />} />
        <Route path="/" element={<Layout />}>
          <Route path="explore" element={<Hub />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="definitions" element={<Definitions />} />
          <Route path="definitions/:slug" element={<DefinitionDetail />} />
          <Route path="agitators" element={<Agitators />} />
          <Route path="agitators/tucker-carlson/36-falsehoods" element={<Huckabee36Falsehoods />} />
          <Route path="agitators/:slug" element={<AgitatorDetail />} />
          <Route path="misconceptions" element={<Misconceptions />} />
          <Route path="misconceptions/:topic" element={<MisconceptionTopic />} />
          <Route path="misconceptions/:topic/:slug" element={<MisconceptionEntryDetail />} />
          <Route path="conspiracies" element={<Conspiracies />} />
          <Route path="conspiracies/:slug" element={<ConspiracyDetail />} />
          <Route path="talmud" element={<Talmud />} />
          <Route path="talmud/:slug" element={<TalmudDetail />} />
          <Route path="slideshow" element={<Slideshow />} />
          <Route path="stylesheet" element={<Stylesheet />} />
        </Route>
      </Routes>
      <ContactFAB />
      <div className="app-copyright" aria-label="Copyright and disclaimer">
        © {currentYear} Ari Daniel Bradshaw. All rights reserved. This site is for educational purposes.
      </div>
    </TransitionContext.Provider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
