import clsx from 'clsx'
import styles from './tailwind.css'
import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction, LoaderFunctionArgs } from '@remix-run/node'
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from 'remix-themes'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from '@remix-run/react'
import { themeSessionResolver } from './services/theme.server'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { getTheme } = await themeSessionResolver(request)

  const response = await fetch('http://api:4000/health')
  const data = await response.json()

  // const cookieHeader = request.headers.get('Cookie')
  // const cookie = (await userToken.parse(cookieHeader)) || {}

  // if (cookie.token) {
  //   console.log('User Authentication Token', cookie.token)
  // } else {
  //   console.log('User is not authenticated')
  // }

  return json({
    message: data.message,
    theme: getTheme(),
  })
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}

export function App() {
  const user = useLoaderData<typeof loader>()

  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
