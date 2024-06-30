import React, { useEffect } from 'react';
import axios from 'axios'
import { Toaster } from '@ui/components';

export const CloudcrafterProvider = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        axios.defaults.baseURL = 'http://localhost:57680/' // TODO: Move to env (how to do on build products? .NET magic?)
    }, [])

    return <>
        <Toaster/>
        {children}
    </>
}