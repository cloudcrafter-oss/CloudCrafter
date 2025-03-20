import type { FilterCriterea } from './FilterCriterea'

export type PaginatedRequestOfUserDto = {
  /**
   * @type array
   */
  filters: FilterCriterea[]
  /**
   * @type integer, int32
   */
  page: number
  /**
   * @type integer, int32
   */
  pageSize: number
}