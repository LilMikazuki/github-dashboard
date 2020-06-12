import React from 'react'
import styles from './Repository.module.scss'
import BackArrowIcon from '../../assets/icons/BackArrowIcon'
import StarIcon from '../../assets/icons/StarIcon'
import numberConverter from '../../utils/numberConverter'
import moment from 'moment'
import PropTypes from 'prop-types'
import ExternalLinkIcon from '../../assets/icons/ExternalLinkIcon'

function Repository (props) {
	return (
		<section className={styles.repository}>
			<div className={styles.header}>
				<div onClick={props.deactivate} className={styles.backButton}>
					<BackArrowIcon/>
				</div>
				<a target={'blank'} href={props.githubUrl} className={styles.name}>{props.name}</a>
				<div className={styles.stars}>
					<StarIcon/>
					<span>{numberConverter(props.stars)}</span>
				</div>
				<span
					className={styles.lastCommitDate}>Last commit was {moment(props.lastCommitDate).format('D MMM YYYY')}</span>
			</div>
			<div className={`${styles.author} ${styles.block}`}>
				<h4>Author</h4>
				<div className={styles.avatar}>
					<img src={props.owner.avatar_url} alt={'userAvatar'}/>
					<a target={'blank'} href={props.owner.profileUrl}>{props.owner.login}</a>
				</div>
			</div>
			<div className={`${styles.description} ${styles.block}`}>
				<h4>Description</h4>
				<p>{props.description}</p>
			</div>
			<div className={`${styles.language} ${styles.block}`}>
				<span>Language:</span>{props.language}
			</div>
			{
				props.contributorsTop.length > 0 &&
				<div className={`${styles.contributors} ${styles.block}`}>
					<h4>Top 10 Contributors</h4>
					<ul>
						{
							props.contributorsTop.map(contributor => (
								<li>
									<div>
										<span>{contributor.login}</span>
										<span>{contributor.contributions}</span>
									</div>
									<a href={contributor.github_url} target={'blank'}><ExternalLinkIcon/></a>
								</li>
							))
						}
					</ul>
				</div>
			}
		</section>
	)
}

Repository.propTypes = {
	number: PropTypes.number.isRequired,
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	shortName: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	stars: PropTypes.number.isRequired,
	lastCommitDate: PropTypes.string.isRequired,
	githubUrl: PropTypes.string.isRequired,
	language: PropTypes.string.isRequired,
	contributors_url: PropTypes.string.isRequired,
	owner: PropTypes.object.isRequired
}

export default Repository