import { ProjectEnvironmentRouteParams, validateRouteParams } from '@/src/utils/routes/schemas.ts'
import {
    Activity,
    ActivityIcon,
    AlertCircle,
    Box,
    CheckCircle,
    ChevronRight,
    Clock,
    Cloud,
    Database,
    Layers,
    Play,
    Plus,
    RefreshCw,
    Server,
    XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@ui/components/ui/card.tsx'
import { Badge } from '@ui/components/ui/badge.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs.tsx'
import { Button } from '@ui/components/ui/button.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/components/ui/select.tsx'

interface PageProps {
    params: ProjectEnvironmentRouteParams;
}

export default function ProjectEnvironmentPage({ params }: PageProps) {
    // Validate the route params
    const validatedParams = validateRouteParams(params)
    const deployedApps = [
        { name: 'Frontend App', healthy: true },
        { name: 'Backend API', healthy: true },
        { name: 'Database Service', healthy: false },
        { name: 'Caching Layer', healthy: true },
        { name: 'Message Queue', healthy: true },
        { name: 'Monitoring Service', healthy: false },
    ]
    return (
        <>
            <Card className="bg-white dark:bg-gray-800 shadow-lg mb-8">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">My project</h2>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                    <span>Created on: date</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1"/>
                                    <span>Last deployment:yesterdag</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-4">
                            <div className="text-center">
                                <div
                                    className="text-2xl font-bold text-blue-600 dark:text-blue-400">5
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Total Deployments</div>
                            </div>
                            <div className="text-center">
                                <div
                                    className="text-2xl font-bold text-green-600 dark:text-green-400">3
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Active Instances</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">Deployed Stacks</CardTitle>
                        <Layers className="h-5 w-5 text-blue-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">5</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total active stacks</p>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">Health Status</CardTitle>
                        <ActivityIcon className="h-5 w-5 text-yellow-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="h-5 w-5 text-yellow-500"/>
                            <span className="text-lg font-medium">Warning</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">2 services require attention</p>
                    </CardContent>
                </Card>
                <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                        <Play className="h-5 w-5 text-green-500"/>
                    </CardHeader>
                    <CardContent>
                        <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-1"/>
                                New Stack
                            </Button>
                            <Button size="sm" variant="outline">
                                <RefreshCw className="h-4 w-4 mr-1"/>
                                Refresh
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Deployed Applications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {deployedApps.map((app, index) => (
                        <Card key={index}
                              className="bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {app.healthy ? (
                                        <CheckCircle className="text-green-500 h-5 w-5"/>
                                    ) : (
                                        <XCircle className="text-red-500 h-5 w-5"/>
                                    )}
                                    <span className="font-medium text-gray-700 dark:text-gray-200">{app.name}</span>
                                </div>
                                <Badge variant={app.healthy ? 'success' : 'destructive'}>
                                    {app.healthy ? 'Healthy' : 'Unhealthy'}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow">
                    <TabsTrigger value="overview"
                                 className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Overview</TabsTrigger>
                    <TabsTrigger value="stacks"
                                 className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Stacks</TabsTrigger>
                    <TabsTrigger value="servers"
                                 className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Servers</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Card
                            className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Stacks</CardTitle>
                                <Box className="h-4 w-4 text-blue-500"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">5</div>
                                <p className="text-xs text-muted-foreground">+2 from last week</p>
                            </CardContent>
                        </Card>
                        <Card
                            className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Servers</CardTitle>
                                <Server className="h-4 w-4 text-green-500"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">3</div>
                                <p className="text-xs text-muted-foreground">All systems operational</p>
                            </CardContent>
                        </Card>
                        <Card
                            className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last Deployment</CardTitle>
                                <Play className="h-4 w-4 text-indigo-500"/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">2h ago</div>
                                <p className="text-xs text-muted-foreground">Successful deployment</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="stacks">
                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                        <CardHeader>
                            <CardTitle>Available Stacks</CardTitle>
                            <CardDescription>Deploy and manage your Docker stacks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {['Web Application', 'Database Cluster', 'Monitoring Stack'].map((stack, index) => (
                                    <li key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            {index === 0 && <Cloud className="text-blue-500"/>}
                                            {index === 1 && <Database className="text-green-500"/>}
                                            {index === 2 && <Activity className="text-purple-500"/>}
                                            <span className="font-medium">{stack}</span>
                                        </div>
                                        <Button size="sm"
                                                className="bg-blue-500 hover:bg-blue-600 text-white">Deploy</Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="servers">
                    <Card className="bg-white dark:bg-gray-800 shadow-lg">
                        <CardHeader>
                            <CardTitle>Connected Servers</CardTitle>
                            <CardDescription>Manage your server infrastructure</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {['server-01.example.com', 'server-02.example.com', 'server-03.example.com'].map((server, index) => (
                                    <li key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                                        <div className="flex items-center space-x-3">
                                            <Server className="text-indigo-500"/>
                                            <span className="font-medium">{server}</span>
                                        </div>
                                        <Button size="sm" variant="outline"
                                                className="hover:bg-indigo-50 dark:hover:bg-indigo-900">
                                            Manage
                                            <ChevronRight className="ml-2 h-4 w-4"/>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Deploy New Stack</CardTitle>
                    <CardDescription className="text-indigo-100">Select a Docker stack to deploy to the current
                        environment</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <Select>
                            <SelectTrigger className="w-full sm:w-[280px] bg-white/10 border-white/20 text-white">
                                <SelectValue placeholder="Select a stack to deploy"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="web-app">Web Application</SelectItem>
                                <SelectItem value="database">Database Cluster</SelectItem>
                                <SelectItem value="monitoring">Monitoring Stack</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="bg-white text-indigo-600 hover:bg-indigo-100">
                            Deploy Stack
                            <Play className="ml-2 h-4 w-4"/>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}