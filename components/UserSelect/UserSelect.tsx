import { FormControl, FormHelperText, InputLabel, Select } from '@mui/material'
import { StateQuote } from '@components/AddConvoForm/AddConvoForm'
import { ReactNode } from 'react'

interface UserSelectProps {
  quote: StateQuote
  loading: boolean
  onChange: (id: string, payload: StateQuote) => void
  children: ReactNode
}

const UserSelect = ({ quote, loading, onChange, children }: UserSelectProps) => {
  const label = 'User'
  const labelId = `select-${quote.id}-label`

  return (
    <FormControl error={Boolean(quote.selectError)} disabled={loading} fullWidth required>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        value={quote.speakerId}
        onChange={(e) =>
          onChange(quote.id, { ...quote, selectError: undefined, speakerId: e.target.value })
        }
        labelId={labelId}
        label={label}
        MenuProps={{ PaperProps: { sx: { maxHeight: '14rem' } } }}
      >
        {children}
      </Select>
      {Boolean(quote.selectError) && <FormHelperText>{quote.selectError}</FormHelperText>}
    </FormControl>
  )
}

export default UserSelect
