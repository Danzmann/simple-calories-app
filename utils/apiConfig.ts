import { AxiosError } from 'axios'

export const isAxiosError = (error: unknown): error is AxiosError => (error as AxiosError).isAxiosError

export const getNextApi = () => {
  if (
    process.env.NEXT_PUBLIC_API_PROTOCOL &&
    process.env.NEXT_PUBLIC_API_BASE_URL
  ) {
    return `${process.env.NEXT_PUBLIC_API_PROTOCOL}${process.env.NEXT_PUBLIC_API_BASE_URL}` || ''
  }
  return ''
}