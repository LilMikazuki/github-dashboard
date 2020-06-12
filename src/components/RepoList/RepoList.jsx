import React from 'react'
import styles from './RepoList.module.scss'
import ExternalLinkIcon from '../../assets/icons/ExternalLinkIcon'
import moment from 'moment'
import numberConverter from '../../utils/numberConverter'
import StarIcon from '../../assets/icons/StarIcon'

const ListItem = ({ shortName, githubUrl, lastCommitDate, stars, activateCallback }) => {
	return <div className={styles.item}>
		<div>
			<span className={styles.name} onClick={activateCallback}>{shortName}</span>
			<div className={styles.info}>
				<span className={styles.lastCommit}>Last commit was {moment(lastCommitDate).format('D MMM YYYY')}</span>
				<div className={styles.stars}>
					<StarIcon/>
					<span>{numberConverter(stars)}</span>
				</div>
			</div>
		</div>
		<a href={githubUrl} target={'blank'} title={'View on GitHub'} className={styles.link}><ExternalLinkIcon/></a>
	</div>
}

function RepoList (props) {
	return (
		<ul className={styles.repoList}>
			{
				props.repositories.map(repo => <li><ListItem
					activateCallback={() => props.activateCallback(repo.number)} {...repo}/></li>)
			}
		</ul>
	)
}

RepoList.defaultProps = {
	repositories: []
}

export default RepoList