import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';
import {CloudcrafterProvider} from './cloudcrafter-provider.tsx';

const queryClient = new QueryClient()

export const RootProvider = ({children}: { children: React.ReactNode }) => {
    return <CloudcrafterProvider>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </CloudcrafterProvider>
}