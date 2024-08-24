'use client'
import { ProjectDto } from '@/src/core/generated'
import { PlusIcon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import { RefreshCwIcon, RepeatIcon, SettingsIcon } from 'lucide-react'
import { Button } from '@ui/components/ui/button.tsx'
import { Sheet, SheetContent, SheetTrigger } from '@ui/components/ui/sheet'
import { CreateProjectSheet } from '@/src/core/features/admin/projects/create-project-sheet.tsx'
import { ProjectListItem } from '@/src/core/features/admin/projects/project-list-item.tsx'
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/navigation'


function CircleStopIcon({ className }: { className: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10"/>
            <rect width="6" height="6" x="9" y="9"/>
        </svg>
    )
}

export const ProjectList = ({ projects }: { projects: ProjectDto[] }) => {
    const [expandedProject, setExpandedProject] = useState<string | null>(null)
    const handleProjectClick = (projectName: string) => {
        setExpandedProject(expandedProject === projectName ? null : projectName)
    }
    const { mutate } = useSWRConfig()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const handleRefresh = async () => {
        await mutate('userProjects')
        router.refresh()
    }

    const closeSheet = async () => {
        setOpen(false)
        await handleRefresh()
    }

    return (
        <div className="p-4 bg-background text-foreground min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <div className="space-y-4">

                {projects.map((project) => (
                    <ProjectListItem onCloseEditSheet={handleRefresh} project={project} key={project.id}/>
                ))}
                <div className="border border-input rounded-lg">

                    <div
                        className="flex justify-between items-center p-4 bg-card rounded-t-lg cursor-pointer"
                        onClick={() => handleProjectClick('Example App')}
                    >
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Example App</span>
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"/>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                                <PlusIcon className="w-4 h-4 text-muted-foreground"/>
                            </button>
                            <button className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                                <SettingsIcon className="w-4 h-4 text-muted-foreground"/>
                            </button>
                        </div>
                    </div>
                    {expandedProject === 'Example App' && (
                        <div className="p-4">
                            <div className="mb-2 text-muted-foreground">Production</div>
                            <div className="space-y-2">
                                {[
                                    { name: 'my-cool-app', status: 'green' },
                                    {
                                        name: 'i-have-a-description',
                                        status: 'green',
                                        description: 'This is a really cool description!',
                                    },
                                    {
                                        name: 'cool-database',
                                        status: 'green',
                                    },
                                    { name: 'worlds-most-critical-app', status: 'red' },
                                    { name: 'another-cool-app', status: 'green' },
                                ].map((app) => (
                                    <div key={app.name}
                                         className="flex justify-between items-center p-2 bg-muted rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-2.5 h-2.5 bg-${app.status}-500 rounded-full`}/>
                                            <div>
                                                <div className="font-medium">{app.name}</div>
                                                {app.description && <div
                                                    className="text-sm text-muted-foreground">{app.description}</div>}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <RepeatIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <RefreshCwIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <CircleStopIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="mt-2 w-full">
                                + New Environment
                            </Button>
                        </div>
                    )}
                </div>
                <div className="border border-input rounded-lg">
                    <div
                        className="flex justify-between items-center p-4 bg-card rounded-t-lg cursor-pointer"
                        onClick={() => handleProjectClick('Super Cool Service')}
                    >
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Super Cool Service</span>
                            <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"/>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                                <PlusIcon className="w-4 h-4 text-muted-foreground"/>
                            </button>
                            <button className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                                <SettingsIcon className="w-4 h-4 text-muted-foreground"/>
                            </button>
                        </div>
                    </div>
                    {expandedProject === 'Super Cool Service' && (
                        <div className="p-4">
                            <div className="mb-2 text-muted-foreground">Production</div>
                            <div className="space-y-2">
                                {[
                                    { name: 'my-cool-app', status: 'green' },
                                    {
                                        name: 'i-have-a-description',
                                        status: 'green',
                                        description: 'This is a really cool description!',
                                    },
                                    {
                                        name: 'cool-database',
                                        status: 'green',
                                    },
                                    { name: 'worlds-most-critical-app', status: 'red' },
                                    { name: 'another-cool-app', status: 'green' },
                                ].map((app) => (
                                    <div key={app.name}
                                         className="flex justify-between items-center p-2 bg-muted rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-2.5 h-2.5 bg-${app.status}-500 rounded-full`}/>
                                            <div>
                                                <div className="font-medium">{app.name}</div>
                                                {app.description && <div
                                                    className="text-sm text-muted-foreground">{app.description}</div>}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <RepeatIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <RefreshCwIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <CircleStopIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="mt-2 w-full">
                                + New Environment
                            </Button>
                        </div>
                    )}
                </div>
                <div className="border border-input rounded-lg">
                    <div
                        className="flex justify-between items-center p-4 bg-card rounded-t-lg cursor-pointer"
                        onClick={() => handleProjectClick('Super Epic Project')}
                    >
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Super Epic Project</span>
                            <span className="w-2.5 h-2.5 bg-green-500 rounded-full"/>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                                <PlusIcon className="w-4 h-4 text-muted-foreground"/>
                            </button>
                            <button className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                                <SettingsIcon className="w-4 h-4 text-muted-foreground"/>
                            </button>
                        </div>
                    </div>
                    {expandedProject === 'Super Epic Project' && (
                        <div className="p-4">
                            <div className="mb-2 text-muted-foreground">Production</div>
                            <div className="space-y-2">
                                {[
                                    { name: 'my-cool-app', status: 'green' },
                                    {
                                        name: 'i-have-a-description',
                                        status: 'green',
                                        description: 'This is a really cool description!',
                                    },
                                    {
                                        name: 'cool-database',
                                        status: 'green',
                                    },
                                    { name: 'worlds-most-critical-app', status: 'red' },
                                    { name: 'another-cool-app', status: 'green' },
                                ].map((app) => (
                                    <div key={app.name}
                                         className="flex justify-between items-center p-2 bg-muted rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-2.5 h-2.5 bg-${app.status}-500 rounded-full`}/>
                                            <div>
                                                <div className="font-medium">{app.name}</div>
                                                {app.description && <div
                                                    className="text-sm text-muted-foreground">{app.description}</div>}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <RepeatIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <RefreshCwIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <CircleStopIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="mt-2 w-full">
                                + New Environment
                            </Button>
                        </div>
                    )}
                </div>
                <div className="border border-input rounded-lg">
                    <div
                        className="flex justify-between items-center p-4 bg-card rounded-t-lg cursor-pointer"
                        onClick={() => handleProjectClick('Dead App')}
                    >
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">Dead App</span>
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full"/>
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                                <PlusIcon className="w-4 h-4 text-muted-foreground"/>
                            </button>
                            <button className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                                <SettingsIcon className="w-4 h-4 text-muted-foreground"/>
                            </button>
                        </div>
                    </div>
                    {expandedProject === 'Dead App' && (
                        <div className="p-4">
                            <div className="mb-2 text-muted-foreground">Production</div>
                            <div className="space-y-2">
                                {[
                                    { name: 'my-cool-app', status: 'green' },
                                    {
                                        name: 'i-have-a-description',
                                        status: 'green',
                                        description: 'This is a really cool description!',
                                    },
                                    {
                                        name: 'cool-database',
                                        status: 'green',
                                    },
                                    { name: 'worlds-most-critical-app', status: 'red' },
                                    { name: 'another-cool-app', status: 'green' },
                                ].map((app) => (
                                    <div key={app.name}
                                         className="flex justify-between items-center p-2 bg-muted rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <span className={`w-2.5 h-2.5 bg-${app.status}-500 rounded-full`}/>
                                            <div>
                                                <div className="font-medium">{app.name}</div>
                                                {app.description && <div
                                                    className="text-sm text-muted-foreground">{app.description}</div>}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <RepeatIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <RefreshCwIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                            <button
                                                className="p-2 bg-muted-foreground/10 rounded-full hover:bg-muted-foreground/20">
                                                <CircleStopIcon className="w-4 h-4 text-muted-foreground"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="mt-2 w-full">
                                + New Environment
                            </Button>
                        </div>
                    )}
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            + New Project
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <CreateProjectSheet onClose={closeSheet}/>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}