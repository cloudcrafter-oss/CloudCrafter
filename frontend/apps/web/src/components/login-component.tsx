import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@ui/components/ui/card.tsx";
import {Label} from "@ui/components/ui/label.tsx";
import {Input} from "@ui/components/ui/input.tsx";
import {Button} from "@ui/components";

export const LoginComponent = () => {
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>Enter your email below to login to your account.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Sign in</Button>
            </CardFooter>
        </Card>
    )
}