import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Form,
    FormField,
    Input,
    useToast
} from '@ui/components'
import { Label } from '@ui/components/ui/label.tsx'
import { postLoginUserMutationRequestSchema, usePostLoginUserHook } from '../../../app/generated'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export const LoginComponent = () => {

    const { toast } = useToast()
    const login = usePostLoginUserHook({
        mutation: {
            onSuccess: () => {
                alert('success')
            },
            onError: () => {
                toast({
                    title: 'Something went wrong',
                    description: 'Could not log you in at this time. Please try again later.',
                    variant: 'destructive'
                })
            }
        }
    })

    const handleLogin = () => {
        login.mutate({
            email: '',
            password: ''
        })

    }

    const form = useForm<z.infer<typeof postLoginUserMutationRequestSchema>>({
        resolver: zodResolver(postLoginUserMutationRequestSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    return (
        <Form {...form}>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <FormField render={({ field }) => (
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input {...field} placeholder="m@example.com"/>
                        </div>
                    )} control={form.control}
                               name={'email'}/>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required/>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleLogin} className="w-full">Sign in</Button>
                </CardFooter>
            </Card>
        </Form>
    )
}