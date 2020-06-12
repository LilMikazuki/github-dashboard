import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import history from './utils/history'

ReactDOM.render(
	<BrowserRouter history={history}>
		<App/>
	</BrowserRouter>,
	document.getElementById('root')
)