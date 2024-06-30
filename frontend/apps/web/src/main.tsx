// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import '@repo/ui/main.css';
//
// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {createRouter, RouterProvider} from '@tanstack/react-router'

// Import the generated route tree
import {routeTree} from './routeTree.gen'
import {RootProvider} from './providers/root-provider.tsx';

// Create a new router instance
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <RootProvider>
                <RouterProvider router={router}/>
            </RootProvider>
        </StrictMode>,
    )
}