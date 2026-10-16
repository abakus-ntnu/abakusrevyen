import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatPreview } from './chat-preview'

describe('ChatPreview', () => {
  it('shows the example messages', () => {
    render(<ChatPreview />)

    expect(screen.getByText('Gleder meg til sending!')).toBeInTheDocument()
    expect(screen.getByText('Revyfan')).toBeInTheDocument()
  })

  it('has a labelled message field', () => {
    render(<ChatPreview />)

    expect(screen.getByLabelText('Skriv en melding')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send melding' })).toBeInTheDocument()
  })
})
