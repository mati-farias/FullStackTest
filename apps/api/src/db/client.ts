import postgres from 'postgres'
import { env } from '../config/env'

export const db = postgres(env.DATABASE_URL)
