import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


//import '@font....css'
import './app.css'

const SearchScene = lazy(() => import('./scenes/search/search.jsx'))
const BrokerScene = lazy(() => import('./scenes/broker/broker.jsx'))
//const DrsRequestTemplateScene = lazy(() => import('./scenes/drs-request-template/drs-request-template.jsx'))

const App = () => {
	return <Router>
		<Routes>
			<Route
				path="/"
				element={<Navigate to="/en/search" replace={true} />}
				/>
			<Route
				path="/search"
				element={<Navigate to="/en/search" replace={true} />}
				/>
			{/*<Route
				path="/drs-request-template"
				element={<Navigate to="/en/drs-request-template" replace={true} />}
				/>*/}
			<Route
				path="/:locale/search"
				element={<Suspense fallback={Loading}><SearchScene /></Suspense>}
				/>
			{/*<Route
				path="/:locale/drs-request-template"
				element={<Suspense fallback={Loading}><DrsRequestTemplateScene /></Suspense>}
				/>*/}
			<Route
				path="/:locale/brokers/:brokerId"
				element={<Suspense fallback={Loading}><BrokerScene /></Suspense>}
				/>
			</Routes>
		</Router>
	}

const Loading = <div>Loading...</div>

export {App}
export default App
