import { createLazyFileRoute } from '@tanstack/react-router'
import {Button} from '@ui/components';

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <Button>Hello</Button>
    )
}