'use client'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/components/ui/popover.tsx'
import { Button } from '@ui/components/ui/button.tsx'
import { Check, ChevronRight, ChevronsUpDown } from 'lucide-react'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@ui/components/ui/command.tsx'
import { cn } from '@ui/lib/utils.ts'

const projects = [
    {
        value: 'my-project',
        label: 'My Project',
        environments: [
            { value: 'production', label: 'Production' },
            { value: 'staging', label: 'Staging' },
        ],
    },

    {
        value: 'another-project',
        label: 'My Other Project',
        environments: [
            { value: 'production', label: 'Production' },
            { value: 'staging', label: 'Staging' },
        ],
    },
]

export const ProjectSelector = () => {
    const [open, setOpen] = useState(false)
    const [selectedEnvironment, setSelectedEnvironment] = useState('')
    const [selectedProject, setSelectedProject] = useState('')


    return (
        <div className="flex items-center">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[250px] justify-between"
                    >
                        {selectedProject
                            ? `${selectedEnvironment} / ${selectedProject}`
                            : 'Select environment / project...'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0">
                    <Command>
                        <CommandInput placeholder="Search environment or project..."/>
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {projects.map((project) => (
                                <CommandGroup key={project.value} heading={project.label}>
                                    {project.environments.map((env) => (
                                        <CommandItem
                                            key={`${env.value}-${project.value}`}
                                            onSelect={() => {
                                                setSelectedEnvironment(env.label)
                                                setSelectedProject(project.label)
                                                setOpen(false)
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <ChevronRight className="mr-2 h-4 w-4"/>
                                                {project.label}
                                            </div>
                                            <Check
                                                className={cn(
                                                    'ml-auto h-4 w-4',
                                                    selectedEnvironment === env.label && selectedProject === project.label
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>)
}