'use client'
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
import { usePostValidateGithubRepoHook } from '@/src/core/__generated__'

const formSchema = z.object({
    gitRepository: z.string().url('Please enter a valid URL'),
    name: z.string().min(1, 'Name is required'),
})

export const ProjectDetailCreateStackSheet = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gitRepository: 'https://github.com/cloudcrafter-oss/demo-examples',
            name: '',
        },
    })

    const { mutateAsync, isPending } = usePostValidateGithubRepoHook()

    async function validateRepository(url: string) {
        const errorMessage = 'The provided Git repository is not valid'
        try {
            const result = await mutateAsync({ repository: url })
            if (!result.isValid) {
                form.setError('gitRepository', {
                    type: 'manual',
                    message: errorMessage,
                })
            } else {
                form.clearErrors('gitRepository')
            }
            return result.isValid
        } catch (error) {
            form.setError('gitRepository', {
                type: 'manual',
                message: errorMessage,
            })
            return false
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const isValid = await validateRepository(values.gitRepository)
        if (!isValid) {
            return
        }
        // Handle form submission
        console.log(values)
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {form.formState.errors.gitRepository && (
                            <div className="text-red-500">
                                {form.formState.errors.gitRepository.message}
                            </div>
                        )}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} autoComplete="off"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="gitRepository"
                            render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Git Repository (Public)</FormLabel>
                                    <div className="flex space-x-2">
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
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
                                            disabled={isPending}
                                        >
                                            {isPending ? (
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
