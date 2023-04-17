import { TextField } from '@mui/material'
import { StateQuote } from '@components/AddConvoForm/AddConvoForm'

interface QuoteInputProps {
  quote: StateQuote
  loading: boolean
  onChange: (id: string, payload: StateQuote) => void
}

const QuoteInput = ({ quote, loading, onChange }: QuoteInputProps) => {
  return (
    <TextField
      label="Quote"
      value={quote.content}
      onChange={(e) =>
        onChange(quote.id, { ...quote, textError: undefined, content: e.target.value })
      }
      error={Boolean(quote.textError)}
      helperText={quote.textError}
      disabled={loading}
      required
    />
  )
}

export default QuoteInput
