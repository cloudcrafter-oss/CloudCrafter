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
import { postLoginUserMutationRequestSchema, usePostLoginUserHook } from '../../../generated'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import AuthService from '../../../services/auth-service.ts'

export const LoginComponent = () => {

    const { toast } = useToast()
    const login = usePostLoginUserHook({
        mutation: {
            onSuccess: (value) => {
                AuthService.setToken(value.token!)
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

    const handleLogin = (values: z.infer<typeof postLoginUserMutationRequestSchema>) => {
        login.mutate(values)
    }

    const form = useForm<z.infer<typeof postLoginUserMutationRequestSchema>>({
        resolver: zodResolver(postLoginUserMutationRequestSchema),
        defaultValues: {
            email: 'admin@admin.com',
            password: 'P@ssw0rd!123'
        }
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
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

                        <FormField render={({ field }) => (
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input {...field} id="password" type="password"/>
                            </div>
                        )} control={form.control}
                                   name={'password'}/>
                    </CardContent>
                    <CardFooter>
                        <Button type={'submit'} className="w-full">Sign in</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}