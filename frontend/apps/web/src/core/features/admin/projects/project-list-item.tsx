import { updateProjectArgsSchema } from '@/src/core/generated/zod/updateProjectArgsSchema.ts'
import React, { useState } from 'react'
import { fetchProjectDetail, updateProjectAction } from '@/src/app/_actions/project.ts'
import { SettingsIcon } from 'lucide-react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle
} from '@ui/components/ui/sheet.tsx'
import { Button } from '@ui/components/ui/button.tsx'
import { useAction } from 'next-safe-action/hooks'
import { Spinner } from '@ui/components/ui/spinner.tsx'
import { useForm } from 'react-hook-form'
import { ProjectDto } from '@/src/core/generated'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@ui/components/ui/form'
import { Input } from '@ui/components/ui/input.tsx'


type FormValues = z.infer<typeof updateProjectArgsSchema>

export const ProjectListItem = ({ project }: { project: ProjectDto }) => {

    const [showEditSheet, setShowEditSheet] = useState(false)

    const {
        executeAsync: fetchProjectExecuteAsync,
        isExecuting: projectIsFetching,
        result: projectResult
    } = useAction(fetchProjectDetail)

    const { executeAsync: updateProjectExecuteAsync, isExecuting } = useAction(updateProjectAction)

    const form = useForm<FormValues>({
        resolver: zodResolver(updateProjectArgsSchema),
        defaultValues: projectResult.data
    })


    const openProject = async (projectId: string) => {
        setShowEditSheet(true)
        const asyncResult = await fetchProjectExecuteAsync({ id: projectId })

        if (asyncResult?.data) {
            form.reset(asyncResult.data)
        }
    }


    const onSubmit = async (data: FormValues) => {
        const result = await updateProjectExecuteAsync({ id: project.id, project: data })

        console.log({ result })
    }

    return (
        <div className="border border-input rounded-lg">
            <div
                className="flex justify-between items-center p-4 bg-card rounded-t-lg cursor-pointer">
                <div className="flex items-center space-x-2">
                    <span className="font-semibold">{project.name}</span>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full"/>
                </div>
                <div className="flex space-x-2">
                    <Sheet onOpenChange={setShowEditSheet} open={showEditSheet}>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Edit project</SheetTitle>
                                <SheetDescription>
                                    Make changes to your project here. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                {projectIsFetching &&
                                    <div className={'flex flex-1 justify-center items-center'}><Spinner/></div>}

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                                        <FormField
                                            disabled={projectIsFetching || isExecuting}
                                            key={'name'}
                                            control={form.control}
                                            name={'name' as keyof FormValues}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            disabled={projectIsFetching || isExecuting}
                                            key={'description'}
                                            control={form.control}
                                            name={'description' as keyof FormValues}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} value={field.value ?? ''}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                    </form>
                                </Form>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button disabled={isExecuting || projectIsFetching || !form.formState.isDirty}
                                            onClick={form.handleSubmit(onSubmit)}>Save
                                        changes</Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                    <button onClick={async () => await openProject(project.id)}
                            className="p-2 bg-muted rounded-full hover:bg-muted-foreground">
                        <SettingsIcon className="w-4 h-4 text-muted-foreground"/>
                    </button>
                </div>
            </div>
        </div>
    )
}