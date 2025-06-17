import { Routes, Route } from 'react-router-dom'

import About from './components/About'
import Docs from './components/Docs/Docs'
import FrontPage from './components/FrontPage'
import NavBar from './components/NavBar'
import Data from './components/Data'
import Target from './components/Target'
import TargetNew from './components/TargetNew'
import Model from './components/Model'
import SideBar from './components/SideBar'


const View = (props) => {
  return (
    <div className="sidebar-layout">
      <SideBar />
      <div>
        {props.children}
      </div>
    </div>
  )
}

function App() {

  return (
  <div>
    <NavBar />
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/about-us" element={<About />} />
      <Route path="/dataset" element={<Data />}/>
      <Route path="/variables" element={<TargetNew />}/>
      <Route path="/model" element={<Model />} />
      <Route path="/side" element={<View><h1>Test</h1></View>} />
      <Route path="/docs" element={<Docs />} />
    </Routes>

  </div>
  )
}

export default App
