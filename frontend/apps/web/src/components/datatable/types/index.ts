import type React from 'react'

export interface Option {
	label: string
	value: string
	icon?: React.ComponentType<{ className?: string }>
	withCount?: boolean
}

export interface DataTableFilterField<TData> {
	label: string
	value: string
	placeholder?: string
	options?: Option[]
	debugField?: keyof TData
}

export interface DataTableFilterOption<TData> {
	id: string
	label: string
	value: keyof TData
	options: Option[]
	filterValues?: string[]
	filterOperator?: string
	isMulti?: boolean
}

export interface SearchParams {
	[key: string]: string | string[] | undefined
}
