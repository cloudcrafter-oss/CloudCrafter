// 'use client'
// import mermaid from 'mermaid'
// import { useTheme } from 'next-themes'
// import { useEffect, useRef } from 'react'

// interface MermaidProps {
// 	diagram: string
// }

// export const MDXMermaid = ({ diagram }: MermaidProps) => {
// 	const { theme } = useTheme()
// 	const containerRef = useRef<HTMLDivElement>(null)

// 	useEffect(() => {
// 		mermaid.initialize({
// 			startOnLoad: true,
// 			theme: theme === 'dark' ? 'dark' : 'default',
// 			securityLevel: 'loose',
// 			themeVariables: {
// 				fontFamily: 'system-ui, sans-serif',
// 			},
// 		})a

// 		const renderDiagram = async () => {
// 			if (containerRef.current) {
// 				containerRef.current.innerHTML = ''
// 				try {
// 					const { svg } = await mermaid.render(
// 						`mermaid-diagram-${Math.random()}`, // Unique ID
// 						diagram.trim(),
// 					)
// 					containerRef.current.innerHTML = svg
// 				} catch (error) {
// 					console.error('Failed to render mermaid diagram:', error)
// 					containerRef.current.innerHTML = 'Failed to render diagram'
// 				}
// 			}
// 		}

// 		renderDiagram()
// 	}, [diagram, theme])

// 	return (
// 		<div className='w-full overflow-x-auto'>
// 			<div ref={containerRef} className='my-4' />
// 		</div>
// 	)
// }
