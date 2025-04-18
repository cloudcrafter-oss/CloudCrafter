import { FeatureTable } from '@/components/docs/feature-table/feature-table'
import { openapi, source } from '@/lib/source'
import defaultMdxComponents, { createRelativeLink } from 'fumadocs-ui/mdx'
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from 'fumadocs-ui/page'
import { notFound, redirect } from 'next/navigation'

export default async function Page(props: {
	params: Promise<{ slug?: string[] }>
}) {
	const params = await props.params
	const page = source.getPage(params.slug)

	if (!page) {
		// redirect with 302 to /docs/cloudcrafter
		redirect('/docs/cloudcrafter')
	}

	const MDXContent = page.data.body

	return (
		<DocsPage toc={page.data.toc} full={page.data.full}>
			<DocsTitle>{page.data.title}</DocsTitle>
			<DocsDescription>{page.data.description}</DocsDescription>
			<DocsBody>
				<MDXContent
					components={{
						...defaultMdxComponents,
						// this allows you to link to other pages with relative file paths
						a: createRelativeLink(source, page),
						FeatureTable: FeatureTable,
						// you can add other MDX components here
						APIPage: openapi.APIPage,
					}}
				/>
			</DocsBody>
		</DocsPage>
	)
}

export async function generateStaticParams() {
	return source.generateParams()
}

export async function generateMetadata(props: {
	params: Promise<{ slug?: string[] }>
}) {
	const params = await props.params
	const page = source.getPage(params.slug)
	if (!page) notFound()

	return {
		title: page.data.title,
		description: page.data.description,
	}
}
