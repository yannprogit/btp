import { readdir, readFile } from 'fs/promises';
import path from 'path';
import pool from '../config/db';
import { initDB } from './initDB';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'migrations');

const resolveTargetMigrationFiles = (
  targetValue: string | undefined,
  allFiles: string[],
  pendingFiles: string[]
): string[] => {
  if (pendingFiles.length === 0) {
    return [];
  }

  if (!targetValue || targetValue.trim() === '') {
    return [pendingFiles[pendingFiles.length - 1]];
  }

  const normalizedTarget = targetValue.trim();
  if (normalizedTarget.toLowerCase() === 'all') {
    return pendingFiles;
  }

  const directMatch = allFiles.find((file) => file === normalizedTarget);
  if (directMatch) {
    return pendingFiles.includes(directMatch) ? [directMatch] : [];
  }

  const idMatches = allFiles.filter(
    (file) =>
      file.startsWith(`${normalizedTarget}_`) ||
      file.startsWith(`${normalizedTarget}.`) ||
      file === `${normalizedTarget}.sql`
  );

  if (idMatches.length === 1) {
    return pendingFiles.includes(idMatches[0]) ? idMatches : [];
  }

  if (idMatches.length > 1) {
    throw new Error(
      `MIGRATION_TARGET=${normalizedTarget} matches multiple migrations. Use full filename.`
    );
  }

  throw new Error(`MIGRATION_TARGET=${normalizedTarget} does not match any migration file.`);
};

export const runMigrations = async () => {
  try {
    await initDB();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((file) => file.endsWith('.sql') && !file.endsWith('.down.sql'))
      .sort((a, b) => a.localeCompare(b));

    const appliedRows = await pool.query<{ version: string }>(
      'SELECT version FROM schema_migrations'
    );
    const appliedSet = new Set(appliedRows.rows.map((row) => row.version));
    const pendingFiles = files.filter((file) => !appliedSet.has(file));
    const targetValue = process.env.MIGRATION_TARGET;
    const filesToApply = resolveTargetMigrationFiles(targetValue, files, pendingFiles);

    if (filesToApply.length === 0) {
      console.log('No migration applied. Target is already applied or no pending migration found.');
      return;
    }

    for (const file of filesToApply) {
      const sqlPath = path.join(MIGRATIONS_DIR, file);
      const content = await readFile(sqlPath, 'utf8');

      await pool.query('BEGIN');
      try {
        await pool.query(content);

        await pool.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          [file]
        );
        await pool.query('COMMIT');
        console.log(`Migration applied: ${file}`);
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    }
  } catch (error) {
    console.error('Error while running migrations: ', error);
    throw error;
  }
};

const isRunAsScript = (() => {
  const entryPoint = process.argv[1];
  if (!entryPoint) {
    return false;
  }

  return path.basename(entryPoint) === 'runMigrations.js';
})();

if (isRunAsScript) {
  runMigrations();
}
