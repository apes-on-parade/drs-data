import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


//import '@font....css'
//import './app.css'

// import SearchScene from './scenes/search.jsx'
// import DrsRequestTemplateScene from './scenes/drs-request-template.jsx'
const SearchScene = lazy(() => import('./scenes/search.jsx'))
const DrsRequestTemplateScene = lazy(() => import('./scenes/drs-request-template.jsx'))

const App = () => {
	return <Router>
		<Routes>
			<Route
				path="/"
				element={<Suspense fallback={Loading}><SearchScene /></Suspense>}
				/>
			<Route
				path="/drs-request-template"
				element={<Suspense fallback={Loading}><DrsRequestTemplateScene /></Suspense>}
				/>
			</Routes>
		</Router>
	}

const Loading = <div>Loading...</div>

export {App}
export default App
