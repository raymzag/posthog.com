import React from 'react'
import Highlight, { defaultProps, Language } from 'prism-react-renderer'
import ReactMarkdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { ZoomImage } from 'components/ZoomImage'
import { TransformImage } from 'react-markdown/lib/ast-to-react'

export const Markdown = ({
    children,
    transformImageUri,
}: {
    children: string
    transformImageUri?: TransformImage | undefined
}) => {
    return (
        <ReactMarkdown
            transformImageUri={transformImageUri}
            rehypePlugins={[rehypeSanitize]}
            className="flex-1 text-base overflow-hidden text-ellipsis squeak-post-markdown"
            components={{
                pre: ({ children }) => {
                    return (
                        <>
                            <Highlight
                                {...defaultProps}
                                code={(children[0] as any)?.props?.children[0]}
                                language={'js' as Language}
                            >
                                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                    <pre className={className} style={style}>
                                        {tokens.map((line, i) => (
                                            <div key={i} {...getLineProps({ line, key: i })}>
                                                {line.map((token, key) => (
                                                    <span key={key} {...getTokenProps({ token, key })} />
                                                ))}
                                            </div>
                                        ))}
                                    </pre>
                                )}
                            </Highlight>
                        </>
                    )
                },
                a: ({ node, ...props }) => {
                    return <a rel="nofollow" {...props} />
                },
                img: ZoomImage,
            }}
        >
            {children}
        </ReactMarkdown>
    )
}

export default Markdown
