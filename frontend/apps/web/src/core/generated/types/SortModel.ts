import type { SortDirection } from './SortDirection'

export type SortModel = {
	/**
	 * @type string
	 */
	field: string
	direction: SortDirection
}
