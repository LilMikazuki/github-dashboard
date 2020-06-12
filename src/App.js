import React from 'react'
import './App.scss'
import { Redirect, Route, Switch } from 'react-router-dom'
import MainPage from './components/MainPage/MainPage'

function App () {
	return (
		<div className="App">
			<Switch>
				<Route exact path={'/'} component={MainPage}/>
				<Route exact path={'/search/:query/:page/'} component={MainPage}/>
				<Redirect from='/search/:query' to='/search/:query/1'/>
				<Redirect to='/'/>
			</Switch>
		</div>
	)
}

export default App
