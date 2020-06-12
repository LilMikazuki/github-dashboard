import React from 'react'
import styles from './Pagination.module.scss'
import ArrowIcon from '../../assets/icons/ArrowIcon'

function Pagination (props) {
	const { lastPage, range, currentPage } = props

	if (!lastPage) {
		return null
	}

	const numbers = []
	if (currentPage < range - 2) {
		for (let i = 1; i <= range; i++) {
			numbers.push(i)
		}
	} else if (currentPage < lastPage - 2) {
		for (let i = 1; i <= range; i++) {
			numbers.push(i + currentPage - (range - 2))
		}
	} else {
		for (let i = 1; i <= range; i++) {
			numbers.push(i + lastPage - (range))
		}
	}

	return (
		<div className={styles.pagination}>
			<div className={styles['pButton']} onClick={() => props.callback(1)}>
				<ArrowIcon/>
			</div>
			{
				numbers.map(key => {
					return <span onClick={() => props.callback(key)} className={currentPage === key ? styles.current : ''}>
						{key}
					</span>
				})
			}
			<div className={styles['pButton']} onClick={() => props.callback(lastPage)}>
				<ArrowIcon/>
			</div>
		</div>
	)
}

Pagination.defaultProps = {
	range: 8,
	lastPage: 24,
}

export default Pagination