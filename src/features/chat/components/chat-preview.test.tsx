import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ChatPreview } from './chat-preview'

describe('ChatPreview', () => {
  it('shows the example messages', () => {
    render(<ChatPreview />)

    expect(screen.getByText('Gleder meg til sendingen!')).toBeInTheDocument()
    expect(screen.getByText('Kari')).toBeInTheDocument()
    expect(screen.getByText('18:45')).toBeInTheDocument()
  })

  it('has a labelled message field', () => {
    render(<ChatPreview />)

    expect(screen.getByLabelText('Skriv en melding')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send melding' })).toBeInTheDocument()
  })

  it('adds a sent message to the list and empties the field', async () => {
    const user = userEvent.setup()
    render(<ChatPreview />)
    const field = screen.getByLabelText('Skriv en melding')

    await user.type(field, 'Hei fra testen{Enter}')

    expect(screen.getByText('Hei fra testen')).toBeInTheDocument()
    expect(field).toHaveValue('')
  })

  it('does not send a message with only spaces', async () => {
    const user = userEvent.setup()
    render(<ChatPreview />)

    await user.type(screen.getByLabelText('Skriv en melding'), '    ')

    expect(screen.getByRole('button', { name: 'Send melding'})).toBeDisabled()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })
})
