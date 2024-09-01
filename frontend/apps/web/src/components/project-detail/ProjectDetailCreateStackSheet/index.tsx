'use client'
import { useState } from 'react'
import { Button } from '@ui/components/ui/button'
import { Input } from '@ui/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from '@ui/components/ui/sheet'
import { CheckCircle, Loader2, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@ui/components/ui/form'
import { usePostValidateGithubRepoHook, } from '@/src/core/__generated__'

const formSchema = z.object({
    gitRepository: z.string().url('Please enter a valid URL'),
})

export const ProjectDetailCreateStackSheet = () => {
    const [isValidating, setIsValidating] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gitRepository: '',
        },
    })

    const { mutateAsync, isPending } = usePostValidateGithubRepoHook()

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Handle form submission
        console.log(values)
    }

    async function validateRepository(url: string) {
        setIsValidating(true)
        try {
            // TODO: Implement the actual validation logic here
            // This should call your backend API to validate the repository
            console.log('Validating repository:', url)
            // For now, we'll just simulate a delay
            const result = await mutateAsync({ repository: url })
            console.log(result)
            await new Promise((resolve) => setTimeout(resolve, 1000))
            // Return true if validation is successful, false otherwise
            return true
        } finally {
            setIsValidating(false)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="sm" variant="outline">
                    Add New Stack
                    <Plus className="ml-2 h-4 w-4"/>
                </Button>
            </SheetTrigger>
            <SheetContent style={{ maxWidth: '33vw' }}>
                <SheetHeader>
                    <SheetTitle>Deploy new Stack</SheetTitle>
                    <SheetDescription>
                        Enter the details for your new Stack.
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="gitRepository"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Git Repository (Public)</FormLabel>
                                    <div className="flex space-x-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isValidating}
                                                autoComplete="off"
                                                onBlur={(e) => {
                                                    field.onBlur()
                                                    validateRepository(e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="outline"
                                            onClick={() => validateRepository(field.value)}
                                            disabled={isValidating}
                                        >
                                            {isValidating ? (
                                                <Loader2 className="h-4 w-4 animate-spin"/>
                                            ) : (
                                                <CheckCircle className="h-4 w-4"/>
                                            )}
                                        </Button>
                                    </div>
                                    <FormDescription>
                                        Enter the URL of your public Git repository.
                                    </FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Add Stack</Button>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}
