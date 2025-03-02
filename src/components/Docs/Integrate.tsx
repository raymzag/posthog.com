import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import Link from 'components/Link'
import docs from 'sidebars/docs.json'
import CheckIcon from '../../images/check.svg'
import XIcon from '../../images/x.svg'

type LibraryNode = {
    fields: {
        slug: string
    }
    frontmatter: {
        title: string
        icon: {
            publicURL: string
        }
        features: LibraryFeatures | null
    }
}

type FrameworkNode = {
    fields: {
        slug: string
    }
    frontmatter: {
        title: string
        icon: {
            publicURL: string
        }
    }
}

type LibraryFeatures = {
    eventCapture: boolean
    autoCapture: boolean
    featureFlags: boolean
    groupAnalytics: boolean
    sessionRecording: boolean
    userIdentification: boolean
}

type LibraryData = {
    sdks: {
        nodes: LibraryNode[]
    }
    frameworks: {
        nodes: FrameworkNode[]
    }
}

const sdkSidebar = docs.find((item) => item.name === 'SDKs')?.children || []

const IntegrateOption = (props: LibraryNode | FrameworkNode) => (
    <Link
        to={props.fields.slug}
        className="cta p-0.5 text-primary/75 hover:text-primary/90 dark:text-primary-dark/75 dark:hover:text-primary-dark/90 border-r border-b border-dashed border-gray-accent-light dark:border-gray-accent-dark"
    >
        <div className="px-4 !py-3 flex items-center relative rounded hover:bg-gray-accent-light dark:hover:bg-gray-accent-dark active:top-[0.5px] active:scale-[.99]">
            <span className="w-8 h-8 rounded flex items-center justify-center mr-1.5">
                <img src={props.frontmatter.icon?.publicURL} className="w-6 h-6" />
            </span>
            <h4 className="!text-base font-semibold !m-0 p-0 whitespace-nowrap">{props.frontmatter.title}</h4>
        </div>
    </Link>
)

export const SDKs = () => {
    const { sdks } = useStaticQuery<LibraryData>(query)

    sdks.nodes.sort(
        (a, b) =>
            sdkSidebar.findIndex((c) => c.url === a.fields.slug) - sdkSidebar.findIndex((c) => c.url === b.fields.slug)
    )

    return (
        <div className="grid grid-cols-3 -mt-2 mb-6 border-t border-l border-dashed border-gray-accent-light dark:border-gray-accent-dark">
            {sdks.nodes.map((node) => (
                <IntegrateOption key={node.frontmatter.title} {...node} />
            ))}
        </div>
    )
}

export const Frameworks = () => {
    const { frameworks } = useStaticQuery<LibraryData>(query)

    return (
        <div className="grid grid-cols-2 -mt-2 mb-6 border-t border-l border-dashed border-gray-accent-light dark:border-gray-accent-dark">
            {frameworks.nodes.map((node) => (
                <IntegrateOption key={node.frontmatter.title} {...node} />
            ))}
        </div>
    )
}

const query = graphql`
    {
        sdks: allMdx(
            filter: { slug: { glob: "docs/libraries/*" } }
            sort: { fields: fields___pageViews, order: DESC }
        ) {
            nodes {
                ...sdk
            }
        }
        frameworks: allMdx(
            filter: { slug: { glob: "docs/libraries/*" } }
            sort: { fields: fields___pageViews, order: DESC }
        ) {
            nodes {
                ...framework
            }
        }
    }

    fragment framework on Mdx {
        fields {
            slug
        }
        frontmatter {
            title
            icon {
                publicURL
            }
        }
    }

    fragment sdk on Mdx {
        fields {
            slug
        }
        frontmatter {
            title
            icon {
                publicURL
            }
            features {
                eventCapture
                userIdentification
                autoCapture
                sessionRecording
                featureFlags
                groupAnalytics
            }
        }
    }
`
