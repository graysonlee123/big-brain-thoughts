import { useSnackbar } from 'notistack'

export default function useEnqueueSnackbar() {
  const { enqueueSnackbar } = useSnackbar()

  return enqueueSnackbar
}
