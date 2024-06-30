import {createLazyFileRoute} from '@tanstack/react-router'
import {LoginComponent} from "../features/login/components/login-component.tsx";

export const Route = createLazyFileRoute('/login')({
    component: Login,
})

function Login() {
    return (
        <LoginComponent/>
    )
}