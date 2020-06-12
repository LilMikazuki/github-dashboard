import React from 'react'
import API from '../../utils/API'
import styles from './MainPage.module.scss'
import Pagination from '../Pagination/Pagination'
import RepoList from '../RepoList/RepoList'
import SearchIcon from '../../assets/icons/SearchIcon'
import Repository from '../Repository/Repository'

class MainPage extends React.Component {
	state = {
		repositories: [],
		currentPage: 1,
		query: '',
		lastPage: null,
		activeRepository: null,
	}

	searchInputRef = React.createRef()
	noResultsSpanRef = React.createRef()

	constructor (props) {
		super(props)
		this.history = this.props.history
	}

	componentDidMount () {
		this.updateRepositoryList(this.activateRepository)
	}

	componentDidUpdate (prevProps, prevState, snapshot) {
		console.log(this.props.location)
		if (prevProps.location.pathname !== this.props.location.pathname) {
			if (this.props.match.params.query !== prevProps.match.params.query
				&& this.props.match.params.page !== prevProps.match.params.page)
				this.setState({
					repositories: []
				})
			this.updateRepositoryList()
		}

		if (this.props.location.hash !== prevProps.location.hash && this.state.repositories.length > 0) {
			this.activateRepository()
		}

		if (this.state.activeRepository) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	}

	/* Updates the list of repositories according to the current request */
	updateRepositoryList = (callback) => {
		if (this.props.match.params.query && this.props.match.params.query.length > 0) {
			const decodeQuery = decodeURIComponent(this.props.match.params.query)
			this.searchInputRef.current.value = decodeQuery
			this.getRepositories({
				q: decodeQuery,
				sort: 'stars',
				order: 'desc',
				per_page: 10,
				page: +this.props.match.params.page
			})
				.then(() => callback ? callback() : false)
		} else {
			this.getRepositories({ q: 'stars:>0', sort: 'stars', order: 'desc', per_page: 10, page: 1 })
				.then(() => callback ? callback() : false)
		}
	}

	/* Sends a GET request for a list of repositories with the specified parameters */
	getRepositories = async (params) => {
		const response = await API.get('/search/repositories', { params: params })
		if (this.props.match.params.query && this.props.match.params.query.length > 0) {
			const lastPage = response.headers?.link?.match(/page=([0-9]+)>;\s*rel="last"/)
			if (lastPage) this.setState({ lastPage: +lastPage[1] })
		} else this.setState({ lastPage: 1 })

		const repositories = []
		response.data.items.forEach((item, index) => {
			repositories.push({
				number: index + 1,
				id: item.id,
				name: item.name,
				shortName: item.name.substring(0, 50) + (item.name.length > 50 ? '…' : ''),
				description: item.description,
				stars: item.watchers_count,
				lastCommitDate: item.updated_at,
				githubUrl: item.html_url,
				language: item.language,
				contributors_url: item.contributors_url,
				owner: {
					id: item.owner.id,
					avatar_url: item.owner.avatar_url,
					profileUrl: item.owner.html_url,
					login: item.owner.login,
				}
			})
		})

		if (repositories.length === 0) {
			this.noResultsSpanRef.current.style.display = 'flex'
		} else {
			this.noResultsSpanRef.current.style.display = ''
		}

		this.setState({ repositories: repositories, showPagination: repositories.length > 0 }, () => {
			const hash = this.getCorrectHash()
			if (hash) this.activate(hash)
		})
	}

	getCorrectHash = () => {
		const queryHash = this.props.location.hash?.match(/[0-9]+/)
		if (queryHash) {
			return Math.min(Math.max(+queryHash[0], 1), 10)
		} else return null
	}

	pushToHistory = (e) => {
		const value = e.currentTarget.value
		if (value) {
			this.props.history.push(`/search/${encodeURIComponent(value)}/1`)
		} else {
			this.props.history.push('/')
		}
	}

	changePage = (page) => {
		if (typeof page === 'number') {
			this.props.history.push(`/search/${this.props.match.params.query}/${page}`)
		} else {
			this.props.history.push('/')
		}
	}

	activateRepository = () => {
		if (this.props.location.hash === '') {
			this.setState({ activeRepository: null })
		} else {
			const hash = this.getCorrectHash()
			if (hash) this.activate(hash)
		}
	}

	activate = async (number) => {
		console.log(this.props.location, number)
		if (this.props.location.hash !== `#${number}`) {
			this.props.history.push(`${this.props.location.pathname}#${+number}`)
		} else {
			const repo = this.state.repositories[number - 1]
			if (repo) {
				const response = await API.get(repo.contributors_url).catch(() => [])
				const contributors = response.data
				const contributorsTop = []
				if (typeof contributors === 'object' && contributors.length > 0) {
					const cycleLimit = Math.min(10, contributors.length)
					for (let i = 0; i < cycleLimit; i++) {
						contributorsTop.push({
							login: contributors[i].login,
							contributions: contributors[i].contributions,
							github_url: contributors[i].html_url
						})
					}
				}
				this.setState({ activeRepository: { ...repo, contributorsTop: contributorsTop } })
			}
		}
	}

	deactivate = () => {
		this.props.history.push(this.props.location.pathname)
	}

	render () {
		return (
			<section className={styles.mainPage}>
				<div className={styles.header}>
					<h1 className={styles.title}>Github Dashboard</h1>
					<div className={styles.search}>
						<input ref={this.searchInputRef} onBlur={this.pushToHistory}
						       onKeyPress={(e) => {
							       if (e.charCode === 13) e.currentTarget.blur()
						       }} placeholder={'Search by repositories...'}/>
						<SearchIcon/>
					</div>
				</div>
				{this.state.query.length > 0 && <h3 className={styles.searchResultsTitle}>Search results</h3>}
				{
					this.state.repositories.length > 0 &&
					<>
						{
							this.props.match.params.query &&
							<Pagination
								currentPage={+this.props.match.params.page}
								range={Math.min(8, this.state.lastPage)}
								lastPage={this.state.lastPage}
								callback={this.changePage}/>
						}
						<RepoList activateCallback={this.activate} repositories={this.state.repositories}/>
						{
							this.props.match.params.query &&
							<Pagination
								currentPage={+this.props.match.params.page}
								range={Math.min(8, this.state.lastPage)}
								lastPage={this.state.lastPage}
								callback={this.changePage}/>
						}
					</>
				}
				<span className={styles.noResults} ref={this.noResultsSpanRef}>Nothing was found for your request</span>
				{this.props.location.hash && this.state.activeRepository &&
				<Repository deactivate={this.deactivate} {...this.state.activeRepository}/>}
			</section>
		)
	}
}

export default MainPage