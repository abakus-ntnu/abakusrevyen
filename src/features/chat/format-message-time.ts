const timeFormat = new Intl.DateTimeFormat('nb-NO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Oslo'
})

export function formatMessageTime(createdAt: string) {
    return timeFormat.format(new Date(createdAt))
}