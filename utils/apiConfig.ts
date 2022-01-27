import { AxiosError } from 'axios'

export const isAxiosError = (error: unknown): error is AxiosError => (error as AxiosError).isAxiosError

export const getBackendApi = () => {
    return process.env.NEXT_PUBLIC_BACKEND_API_ENDPOINT || ''
}