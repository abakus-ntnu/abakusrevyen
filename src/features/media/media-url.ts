const defaultMediaBaseUrl = 'https://pub-562633bc548840b783ccab28f75a6915.r2.dev'
const configuredBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL?.replace(/\/$/, '')
const mediaBaseUrl = configuredBaseUrl && !configuredBaseUrl.includes('replace-me') ? configuredBaseUrl : defaultMediaBaseUrl

export function getMediaUrl(objectKey: string) {
  return `${mediaBaseUrl}/${objectKey.replace(/^\//, '')}`
}
