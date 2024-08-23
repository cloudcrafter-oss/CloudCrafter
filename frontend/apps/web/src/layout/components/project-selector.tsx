'use client'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/components/ui/popover.tsx'
import { Button } from '@ui/components/ui/button.tsx'
import { ChevronsUpDown } from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@ui/components/ui/command.tsx'

const projects = [
    { value: 'production', label: 'Production' },
    { value: 'staging', label: 'Staging' },
    { value: 'development', label: 'Development' },
]

export const ProjectSelector = () => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState('')

    return (
        <div className="flex items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {value
                            ? projects.find((project) => project.value === value)?.label
                            : 'Select project...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search project..."/>
                        <CommandEmpty>No project found.</CommandEmpty>
                        <CommandGroup>
                            <CommandList>
                                {projects.map((project) => (
                                    <CommandItem
                                        key={project.value}
                                        value={project.value}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? '' : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {/*<Check*/}
                                        {/*    className={cn(*/}
                                        {/*        'mr-2 h-4 w-4',*/}
                                        {/*        value === project.value ? 'opacity-100' : 'opacity-0'*/}
                                        {/*    )}*/}
                                        {/*/>*/}
                                        {project.label}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}