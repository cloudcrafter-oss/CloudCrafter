import { ScrollArea } from '@ui/components/ui/scroll-area'
import { BarChart2, FileText, Layers, LayoutDashboard, Menu, Settings, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/components/ui/avatar.tsx'
import { Button } from '@ui/components/ui/button.tsx'
import { Card, CardContent } from '@ui/components/ui/card.tsx'
import { Sheet, SheetContent, SheetTrigger } from '@ui/components/ui/sheet.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/components/ui/select.tsx'

export default async function Page() {

    return (
        <div className="flex flex-col h-screen bg-gray-100 lg:flex-row">
            {/* Mobile/Tablet Sidebar Trigger */}
            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="m-4">
                            <Menu className="h-4 w-4"/>
                            <span className="sr-only">Toggle sidebar</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <Sidebar/>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-64">
                <Sidebar/>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-white border-b">
                    <h1 className="text-2xl font-semibold">Kanban</h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                            <Avatar className="border-2 border-white">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User"/>
                                <AvatarFallback>U1</AvatarFallback>
                            </Avatar>
                            <Avatar className="border-2 border-white">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User"/>
                                <AvatarFallback>U2</AvatarFallback>
                            </Avatar>
                            <Avatar className="border-2 border-white hidden sm:inline-flex">
                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User"/>
                                <AvatarFallback>U3</AvatarFallback>
                            </Avatar>
                        </div>
                        <Button variant="outline" className="hidden sm:inline-flex">Display</Button>
                        <Button>
                            New task
                            <span className="ml-2 text-xs bg-blue-200 text-blue-600 rounded-full px-2">N</span>
                        </Button>
                        <Button variant="outline" className="hidden sm:inline-flex">Share</Button>
                    </div>
                </header>

                {/* Kanban Board */}
                <div className="flex-1 overflow-auto p-4">
                    <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
                        {/* Todo Column */}
                        <Card className="flex-1">
                            <CardContent>
                                <h2 className="font-semibold mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                    Todo
                                    <Button variant="ghost" size="sm" className="ml-auto">+</Button>
                                </h2>
                                <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-240px)]">
                                    <div className="space-y-4">
                                        {/* Task cards go here */}
                                        <Card>
                                            <CardContent className="p-4">
                                                <h3 className="font-semibold">Setup Docker Environment</h3>
                                                <p className="text-sm text-gray-500 mt-1">Configure Docker for remote
                                                    deployments</p>
                                                <div className="flex items-center mt-4">
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarFallback>U1</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-gray-500 ml-2">2pt</span>
                                                    <span className="ml-auto text-sm text-blue-500">$300 estimate</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        {/* More task cards... */}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* In Progress Column */}
                        <Card className="flex-1">
                            <CardContent>
                                <h2 className="font-semibold mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                                    In Progress
                                    <Button variant="ghost" size="sm" className="ml-auto">+</Button>
                                </h2>
                                <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-240px)]">
                                    <div className="space-y-4">
                                        {/* Task cards go here */}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Complete Column */}
                        <Card className="flex-1">
                            <CardContent>
                                <h2 className="font-semibold mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                    Complete
                                    <Button variant="ghost" size="sm" className="ml-auto">+</Button>
                                </h2>
                                <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100vh-240px)]">
                                    <div className="space-y-4">
                                        {/* Task cards go here */}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Sidebar() {
    return (
        <div className="h-full bg-white border-r flex flex-col">
            <div className="p-4">
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select project"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dockerdeploy">DockerDeploy</SelectItem>
                        <SelectItem value="project2">Project 2</SelectItem>
                        <SelectItem value="project3">Project 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <ScrollArea className="flex-1">
                <nav className="space-y-2 px-3">
                    <a href="#"
                       className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                        <LayoutDashboard className="w-5 h-5 mr-3 text-gray-500"/>
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                        <Layers className="w-5 h-5 mr-3"/>
                        Kanban
                    </a>
                    <a href="#"
                       className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                        <FileText className="w-5 h-5 mr-3 text-gray-500"/>
                        Deployments
                    </a>
                    <a href="#"
                       className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                        <Users className="w-5 h-5 mr-3 text-gray-500"/>
                        Team
                    </a>
                    <a href="#"
                       className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                        <BarChart2 className="w-5 h-5 mr-3 text-gray-500"/>
                        Reports
                    </a>
                    <a href="#"
                       className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                        <Settings className="w-5 h-5 mr-3 text-gray-500"/>
                        Settings
                    </a>
                </nav>
                <div className="mt-8 px-6">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Teams</h3>
                    <nav className="space-y-1">
                        <a href="#"
                           className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                            Frontend
                        </a>
                        <a href="#"
                           className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                            Backend
                        </a>
                    </nav>
                </div>
            </ScrollArea>
            <div className="p-4 border-t">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User"/>
                        <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">Aarav Sareen</p>
                        <p className="text-xs text-gray-500">aarav@example.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
