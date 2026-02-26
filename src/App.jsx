import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Hub from './pages/Hub'
import Timeline from './pages/Timeline'
import Definitions from './pages/Definitions'
import DefinitionDetail from './pages/DefinitionDetail'
import Agitators from './pages/Agitators'
import AgitatorDetail from './pages/AgitatorDetail'
import Misconceptions from './pages/Misconceptions'
import MisconceptionTopic from './pages/MisconceptionTopic'
import Stylesheet from './pages/Stylesheet'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/" element={<Layout />}>
          <Route path="explore" element={<Hub />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="definitions" element={<Definitions />} />
          <Route path="definitions/:slug" element={<DefinitionDetail />} />
          <Route path="agitators" element={<Agitators />} />
          <Route path="agitators/:slug" element={<AgitatorDetail />} />
          <Route path="misconceptions" element={<Misconceptions />} />
          <Route path="misconceptions/:topic" element={<MisconceptionTopic />} />
          <Route path="stylesheet" element={<Stylesheet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
