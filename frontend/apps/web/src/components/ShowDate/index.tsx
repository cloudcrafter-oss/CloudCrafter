import React from 'react'
import { format, parseISO } from 'date-fns'

interface ShowDateProps {
    dateString?: string | null
    formatString?: string;
    customNullText?: string
}

const ShowDate: React.FC<ShowDateProps> = ({
                                               dateString,
                                               formatString = 'MMMM d, yyyy HH:mm:ss',
                                               customNullText = 'Never'
                                           }) => {
    if (!dateString) {
        return <span>{customNullText}</span>
    }

    const date = parseISO(dateString)
    const formattedDate = format(date, formatString)

    return <span>{formattedDate}</span>
}

export default ShowDate
