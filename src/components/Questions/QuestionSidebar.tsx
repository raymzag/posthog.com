import React, { useEffect, useRef, useState } from 'react'
import Link from 'components/Link'
import { useUser } from 'hooks/useUser'
import SidebarSection from 'components/PostLayout/SidebarSection'
import { useQuestion } from 'components/Squeak'
import getAvatarURL from 'components/Squeak/util/getAvatar'

type QuestionSidebarProps = {
    permalink: string
}

export const QuestionSidebar = (props: QuestionSidebarProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [sidecarHeight, setSidecarHeight] = useState(0)
    const { isModerator } = useUser()
    const { question } = useQuestion(props.permalink)
    const avatar = getAvatarURL(question?.attributes?.profile?.data)

    const adjustHeight = () => {
        if (window.innerWidth < 1024) return setSidecarHeight(400)
        const actions = document.getElementById('post-actions')
        const containerTop = containerRef?.current?.getBoundingClientRect().top ?? 0
        const actionsTop = actions?.getBoundingClientRect().top ?? 0
        const height = actionsTop - containerTop
        setSidecarHeight(height)
    }

    useEffect(() => {
        if (typeof window !== 'undefined' && containerRef.current) {
            window.addEventListener('scroll', adjustHeight)
            window.addEventListener('resize', adjustHeight)
            adjustHeight()
        }

        return () => {
            window.removeEventListener('scroll', adjustHeight)
            window.addEventListener('resize', adjustHeight)
        }
    }, [])

    return question ? (
        <div className="relative" ref={containerRef}>
            {!isModerator && (
                <SidebarSection title="Posted by">
                    <div className="flex items-center space-x-2">
                        {avatar ? (
                            <img className="w-8 h-8 rounded-full" src={avatar} />
                        ) : (
                            <svg
                                className="w-8 h-8 rounded-full bg-gray-accent-light"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 40 40"
                            >
                                <path d="M0 0h40v40H0z"></path>
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M21.19 6.57c-5.384-.696-9.938 3.89-9.93 10.343.013.1.026.229.042.378.045.443.11 1.067.262 1.67.883 3.445 2.781 6.077 6.305 7.132 3.117.938 5.86.04 8.14-2.242 3.008-3.016 3.805-8.039 1.891-12.047-1.36-2.844-3.484-4.82-6.71-5.234ZM2.5 40c-.64-1.852 1.119-6.454 2.947-7.61 2.48-1.563 5.076-2.942 7.671-4.32.48-.255.96-.51 1.438-.766.313-.164.899.008 1.29.188 2.827 1.242 5.624 1.25 8.468.03.492-.21 1.242-.241 1.695-.015 2.688 1.367 5.352 2.774 7.961 4.281 2.352 1.36 4.35 6.056 3.53 8.212h-35Z"
                                    fill="#fff"
                                ></path>
                            </svg>
                        )}

                        <div className="w-full">
                            <Link to={`/community/profiles/${question?.attributes?.profile?.data?.id}`}>
                                {question.attributes?.profile?.data?.attributes?.firstName
                                    ? `${question.attributes?.profile?.data?.attributes?.firstName} ${question.attributes?.profile?.data?.attributes?.lastName}`
                                    : 'Anonymous'}
                            </Link>
                        </div>
                    </div>
                </SidebarSection>
            )}

            {isModerator && (
                <iframe
                    style={{ height: sidecarHeight }}
                    className="m-0 border-none w-full h-full lg:absolute"
                    src={`https://sidecar-panel.vercel.app/?email=${question.attributes?.profile?.data?.attributes?.user?.data?.attributes?.email}`}
                />
            )}
        </div>
    ) : null
}

export default QuestionSidebar
