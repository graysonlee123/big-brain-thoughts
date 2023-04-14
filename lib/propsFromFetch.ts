import { GetServerSidePropsResult } from 'next'
import { getErrorMessage } from './errors'

export interface PropsFromFetchResult<T> {
  error?: string
  data?: T
}

/**
 * Generates a props object for `getServerSideProps` based on a fetch result.
 * @param url The URL to fetch.
 * @param options Any options for the fetch.
 * @returns The props object.
 */
const propsFromFetch = async <T>(
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<GetServerSidePropsResult<PropsFromFetchResult<T>>> => {
  try {
    const res = await fetch(url, options)
    const json = (await res.json()) as APIResponse<T>

    if (!res.ok) throw new Error(json.msg ?? 'There was an issue loading the data for this page.')

    return {
      props: {
        data: json.data,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        error: getErrorMessage(error),
      },
    }
  }
}

export default propsFromFetch
