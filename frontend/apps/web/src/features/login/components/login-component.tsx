import {Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input} from "@ui/components";
import {Label} from "@ui/components/ui/label.tsx";
import {usePostLoginUser} from "../../../app/generated/api-client.ts";

export const LoginComponent = () => {

    const login = usePostLoginUser({
        mutation: {
            onSuccess: () => {
                alert('success')
            },
            onError: () => {
                alert('error')
            }
        }
    })

    const handleLogin = () => {
        login.mutate({
            data: {
                email: '',
                password: ''
            }
        })

    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required/>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required/>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleLogin} className="w-full">Sign in</Button>
            </CardFooter>
        </Card>
    )
}