import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { db } from './client'

export async function migrate(): Promise<void> {
  await db`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `

  const dir = join(__dirname, 'migrations')
  const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()

  for (const file of files) {
    const rows = await db`SELECT name FROM schema_migrations WHERE name = ${file}`
    if (rows.length > 0) continue

    const sql = await readFile(join(dir, file), 'utf-8')
    await db.begin(async (tx) => {
      await tx.unsafe(sql)
      await tx`INSERT INTO schema_migrations (name) VALUES (${file})`
    })
  }
}
