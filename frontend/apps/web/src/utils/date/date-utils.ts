import { format, parseISO } from 'date-fns'

export const formatDate = (date: string, formatString?: string) => {
	const dateFormat = formatString || 'MMMM d, yyyy HH:mm:ss'

	const parsedDate = parseISO(date)
	return format(parsedDate, dateFormat)
}
