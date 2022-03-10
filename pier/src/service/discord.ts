import axios from 'axios'

const webhookURL = process.env.DISCORD_WEBHOOK

export async function discordWebHook(message: string) {
  if (!webhookURL) return console.error('Discord webhook url not specified')
  if (process.env.NODE_ENV === 'production') {
    return axios.post(webhookURL, {
      content: message,
    })
  }
}
