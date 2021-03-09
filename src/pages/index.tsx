import tw, { css } from 'twin.macro'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div tw="flex flex-col h-screen bg-gray-yellow-100">
      <Head>
        <title>Layout examples</title>
      </Head>

      <Header>
        <button
          onClick={() => setShowSidebar((prev) => !prev)}
          aria-label={showSidebar ? 'Close sidebar' : 'Open sidebar'}
          css={[
            tw`w-6 h-8 ml-2 text-2xl text-gray-yellow-100 font-icon`,
            css`
              font-variation-settings: 'TIME' 1;
              transition: font-variation-settings 0.4s ease;
            `,
            showSidebar
              ? css`
                  font-variation-settings: 'TIME' 100;
                `
              : null,
          ]}
        >
          A
        </button>
        <Link href="/" passHref>
          <a tw="ml-2 text-2xl font-bold font-display text-gray-yellow-100">
            Home
          </a>
        </Link>
        {/* TODO: add avatar */}
      </Header>

      <div tw="flex flex-row flex-1 overflow-hidden">
        <Sidebar showSidebar={showSidebar}>
          <div tw="pt-2 pl-4 space-y-8 text-gray-yellow-300 bl-text-xl">
            {Array.from({ length: 20 }).map((_, idx) => (
              <p key={idx}>Sidebar content</p>
            ))}
          </div>
        </Sidebar>
        <Main>
          <article>
            <section tw="pt-2 pl-4 space-y-8 text-gray-yellow-600 bl-text-lg">
              {Array.from({ length: 20 }).map((_, idx) => (
                <p key={idx}>Content</p>
              ))}
            </section>
          </article>
          <Footer tw="text-gray-yellow-600 bl-text-base">
            Hi, I'm the footer
          </Footer>
        </Main>
      </div>
    </div>
  )
}

type HeaderProps = {
  className?: string
  children?: React.ReactNode
}
function Header({ className, children }: HeaderProps) {
  return (
    <header
      tw="w-full h-12 flex flex-row items-center bg-gray-yellow-500"
      className={className}
    >
      {children}
    </header>
  )
}

// taken from https://heroicons.com/
function HamburgerIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      tw="w-6 h-6 text-gray-yellow-100"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}
function CloseIcon(props: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      tw="w-6 h-6 text-gray-yellow-100"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

type MainProps = {
  className?: string
  children?: React.ReactNode
}
function Main({ className, children }: MainProps) {
  return (
    <main tw="flex-1 overflow-x-hidden overflow-y-auto" className={className}>
      {children}
    </main>
  )
}

type SidebarProps = {
  showSidebar: boolean
  className?: string
  children?: React.ReactNode
}
type AnimationStatus = 'closing' | 'closed' | 'open'
function Sidebar({ showSidebar, className, children }: SidebarProps) {
  const previousShowSidebar = useRef(showSidebar)
  const [animationStatus, setAnimationStatus] = useState<AnimationStatus>(() =>
    showSidebar ? 'open' : 'closed'
  )

  useEffect(() => {
    if (!previousShowSidebar.current && showSidebar) {
      setAnimationStatus('open')
    }
    if (previousShowSidebar.current && !showSidebar) {
      setAnimationStatus('closing')
    }

    previousShowSidebar.current = showSidebar
  }, [showSidebar])

  return (
    <aside
      css={[
        tw`static inset-y-0 left-0 w-64 h-screen overflow-y-auto bg-gray-yellow-600`,
        showSidebar ? tw`ml-0` : tw`-ml-64`,
        animationStatus === 'closed' ? tw`invisible` : tw`visible`,
        css`
          transition: margin-left 0.5s ease-in-out;
        `,
      ]}
      className={className}
      onTransitionEnd={() => {
        if (animationStatus === 'closing') {
          setAnimationStatus('closed')
        }
      }}
    >
      {animationStatus === 'closed' ? null : children}
    </aside>
  )
}

type FooterProps = {
  className?: string
  children?: React.ReactNode
}
function Footer({ className, children }: FooterProps) {
  return <footer className={className}>{children}</footer>
}
