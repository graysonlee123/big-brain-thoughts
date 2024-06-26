import { useEffect, useRef, useState } from 'react'

const useCopyToClipboard = (data: string) => {
  const [status, setStatus] = useState<'not copied' | 'copied' | 'error'>('not copied')
  const timeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (status !== 'copied') return

    timeout.current = setTimeout(() => {
      setStatus('not copied')
    }, 2000)
  }, [status])

  async function copyToClipboard() {
    try {
      const type = 'text/plain'
      const blob = new Blob([data], { type })
      const clipboardItems = [new ClipboardItem({ [type]: blob })]
      await navigator.clipboard.write(clipboardItems)
      setStatus('copied')
    } catch (error) {
      console.error('Failed to copy link.', error)
      setStatus('error')
    }
  }

  return { status, copyToClipboard }
}

export default useCopyToClipboard
