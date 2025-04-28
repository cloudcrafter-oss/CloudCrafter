import { FormControl } from '@cloudcrafter/ui/components/form'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@cloudcrafter/ui/components/select'

interface Props<T> {
	defaultValue?: string
	onValueChange?(value: string): void
	selectValue: string
	testPrefix: string
	options?: T[]
	getOptionKey: (option: T) => string | number
	getOptionValue: (option: T) => string
	getOptionLabel: (option: T) => string
}

export const CloudcrafterSelect = <T,>({
	defaultValue,
	testPrefix,
	getOptionLabel,
	getOptionValue,
	onValueChange,
	selectValue,
	options,
	getOptionKey,
	...props
}: Props<T>) => {
	return (
		<Select defaultValue={defaultValue} onValueChange={onValueChange}>
			<FormControl>
				<SelectTrigger
					data-testid={`${testPrefix}-select-trigger`}
					className='w-full'
				>
					<SelectValue
						data-testid={`${testPrefix}-select-value`}
						placeholder={selectValue}
					/>
				</SelectTrigger>
			</FormControl>

			<SelectContent>
				{options?.map((option) => (
					<SelectItem
						data-testid={`${testPrefix}-select-item-${getOptionKey(option)}`}
						key={getOptionKey(option)}
						value={getOptionValue(option)}
					>
						{getOptionLabel(option)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
