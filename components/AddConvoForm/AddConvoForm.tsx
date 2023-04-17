import { Fragment, useCallback, useEffect, useState } from 'react'
import { User } from 'next-auth'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import useFetchApiCallback from '@hooks/useFetchApiCallback'
import useEnqueueSnackbar from '@hooks/useEnqueueSnackbar'
import QuoteInput from '@components/QuoteInput'
import UserSelect from '@components/UserSelect'
import UserAvatar from '@components/UserAvatar'

export interface StateQuote extends QuoteBase {
  id: string
  textError?: string
  selectError?: string
}

interface AddConvoFormProps {
  users: User[]
}

const AddConvoForm = ({ users }: AddConvoFormProps) => {
  const [quotes, setQuotes] = useState<StateQuote[]>([])
  const newQuote = useCallback((): StateQuote => ({ id: uuid(), content: '', speakerId: '' }), [])
  const enqueueSnackbar = useEnqueueSnackbar()
  const { error, loading, res, fetcher } = useFetchApiCallback('/api/convos', {
    method: 'POST',
    headers: { type: 'application/json' },
    body: JSON.stringify({
      quotes: quotes.map((quote) => ({
        content: quote.content,
        speakerId: quote.speakerId,
      })),
    }),
  })
  const router = useRouter()
  const maxQuotes = 5

  useEffect(() => {
    if (quotes.length === 0) {
      setQuotes([newQuote()])
    }
  }, [quotes, newQuote])

  useEffect(() => {
    if (quotes.length === maxQuotes + 1) {
      setQuotes((quotes) => [...quotes.slice(0, maxQuotes)])
      enqueueSnackbar('Maximum number of quotes reached.', { variant: 'warning' })
    }
  }, [quotes, enqueueSnackbar])

  useEffect(() => {
    if (error) {
      console.error(error)
      enqueueSnackbar('Sorry, there was an error adding that quote.', { variant: 'error' })
    }
  }, [error, enqueueSnackbar])

  useEffect(() => {
    if (res?.ok) {
      enqueueSnackbar('Your quote was added!', { variant: 'success' })
      setQuotes([])
      router.push('/convos')
    }
  }, [res, enqueueSnackbar, router])

  const validateForm = () => {
    let isValid = true

    const newQuotes = quotes.map((quote) => {
      if (!quote.content) {
        isValid = false
        quote.textError = 'Quote is required.'
      }

      if (quote.content.length > 256) {
        isValid = false
        quote.textError = 'Quote is too long.'
      }

      if (!quote.speakerId) {
        isValid = false
        quote.selectError = 'User is required.'
      }

      return quote
    })
    setQuotes(newQuotes)

    return isValid
  }

  const submit = () => {
    if (validateForm()) {
      fetcher()
    }
  }

  const updateQuote = (id: string, payload: StateQuote) => {
    setQuotes((quotes) => {
      return quotes.map((quote) => (quote.id === id ? payload : quote))
    })
  }

  const addQuote = (index: number) => {
    const quote = newQuote()
    setQuotes((quotes) => [...quotes.slice(0, index + 1), quote, ...quotes.slice(index + 1)])
  }

  const subtractQuote = (index: number) => {
    setQuotes((quotes) => [...quotes.slice(0, index), ...quotes.slice(index + 1)])
  }

  return (
    <Paper sx={{ p: 4 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4">Add quote</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          A quote can have multiple people.
        </Typography>
      </Box>
      <Stack gap={4}>
        {quotes.map((quote, index) => (
          <Fragment key={quote.id}>
            <Stack gap={2}>
              <QuoteInput quote={quote} loading={loading} onChange={updateQuote} />
              <Stack direction="row" gap={1}>
                <UserSelect quote={quote} loading={loading} onChange={updateQuote}>
                  {users.map((user) => (
                    <MenuItem value={user._id ?? ''} key={user._id}>
                      <Stack direction="row" alignItems="center">
                        <UserAvatar user={user} sx={{ mr: 2 }} />
                        <Typography variant="body1">{user.username}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </UserSelect>
              </Stack>
            </Stack>
            {index + 1 < maxQuotes && (
              <Divider>
                <ButtonGroup variant="text" color="inherit">
                  <Button onClick={() => addQuote(index)} title="Add quote after">
                    +
                  </Button>
                  {index > 0 && (
                    <Button onClick={() => subtractQuote(index)} title="Remove quote above">
                      -
                    </Button>
                  )}
                </ButtonGroup>
              </Divider>
            )}
          </Fragment>
        ))}
      </Stack>
      <Stack direction="row" gap={2} sx={{ mt: 6 }}>
        <Button variant="contained" onClick={() => submit()} disabled={loading}>
          Submit
        </Button>
        {loading && <CircularProgress />}
      </Stack>
    </Paper>
  )
}

export default AddConvoForm
