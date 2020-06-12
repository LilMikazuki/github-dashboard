// Используется для округления количества звезда
export default function (number) {
	if (number >= 100000) {
		return Math.round(number / 1000) + 'k'
	} else if (number > 1000) {
		return Number.isInteger(+(number / 1000).toFixed(1))
			? (number / 1000).toFixed(0) + 'k'
			: (number / 1000).toFixed(1) + 'k'
	} else {
		return number
	}
}