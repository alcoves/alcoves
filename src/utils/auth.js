import { useEffect } from 'react'
import Router from 'next/router'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import jwt from 'jsonwebtoken'

export const login = ({ accessToken }) => {
  cookie.set('accessToken', accessToken, { expires: 1 })
  Router.push('/account')
}

export const auth = ctx => {
  const { accessToken } = nextCookie(ctx)
  // If there's no accessToken, it means the user is not logged in.
  if (!accessToken) {
    if (typeof window === 'undefined') {
      ctx.res.writeHead(302, { Location: '/login' })
      ctx.res.end()
    } else {
      Router.push('/login')
    }
  }

  return accessToken
}

export const logout = () => {
  cookie.remove('accessToken')
  // to support logging out from all windows
  window.localStorage.setItem('logout', Date.now())
  Router.push('/login')
}

export const withAuthSync = WrappedComponent => {
  const Wrapper = props => {
    const syncLogout = event => {
      if (event.key === 'logout') {
        console.log('logged out from storage!')
        // Router.push('/login')
      }
    }

    useEffect(() => {
      window.addEventListener('storage', syncLogout)

      return () => {
        window.removeEventListener('storage', syncLogout)
        window.localStorage.removeItem('logout')
      }
    }, [])

    return <WrappedComponent {...props} />
  }

  Wrapper.getInitialProps = async ctx => {
    const token = auth(ctx)

    const user = jwt.decode(token)
    console.log('user', user);

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx))

    return { ...componentProps, user }
  }

  return Wrapper
}