import type { EntityHealthDtoValue } from './EntityHealthDtoValue'

export type EntityHealthDto = {
  /**
   * @type string, date-time
   */
  statusAt?: string | null
  value: EntityHealthDtoValue
}