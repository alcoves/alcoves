import { OAuth2Client } from 'google-auth-library'

const CLIENT_ID = process.env.ALCOVES_AUTH_GOOGLE_ID
const CLIENT_SECRET = process.env.ALCOVES_AUTH_GOOGLE_SECRET
const REDIRECT_URI = process.env.ALCOVES_AUTH_GOOGLE_REDIRECT_URL

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

export async function getGoogleOAuthTokens(authCode: string) {
    try {
        const { tokens } = await oAuth2Client.getToken(authCode)
        return tokens?.access_token ? tokens : Promise.reject()
    } catch (e) {
        console.error(e)
        throw new Error('Failed to get Google OAuth tokens')
    }
}

export async function getUserInfo(accessToken: string) {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo'
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    const userInfo = await res.json()
    console.log(userInfo)
    return userInfo
}
