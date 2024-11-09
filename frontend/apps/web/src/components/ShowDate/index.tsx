import { formatDate } from '@/src/utils/date/date-utils'
import type React from 'react'

interface ShowDateProps {
	dateString?: string | null
	formatString?: string
	customNullText?: string
}

const ShowDate: React.FC<ShowDateProps> = ({
	dateString,
	formatString,
	customNullText = 'Never',
}) => {
	if (!dateString) {
		return <span>{customNullText}</span>
	}

	const formattedDate = formatDate(dateString, formatString)

	return <span>{formattedDate}</span>
}

export default ShowDate
