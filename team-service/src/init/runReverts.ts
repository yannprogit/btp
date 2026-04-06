import { access, readFile } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import pool from '../config/db';
import { initDB } from './initDB';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'migrations');

dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') });
dotenv.config();

const parseRevertCount = (value: string | undefined): number => {
  if (!value || value.trim() === '') {
    return 1;
  }

  if (value.toLowerCase() === 'all') {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error('MIGRATION_REVERT_COUNT must be a positive integer or "all"');
  }

  return parsed;
};

const parseSkipVersions = (value: string | undefined): Set<string> => {
  if (!value || value.trim() === '') {
    return new Set<string>();
  }

  return new Set(
    value
      .split(',')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0)
  );
};

const resolveTargetVersions = (
  targetValue: string | undefined,
  appliedVersions: string[]
): string[] | null => {
  if (!targetValue || targetValue.trim() === '') {
    return null;
  }

  const normalizedTarget = targetValue.trim();
  if (normalizedTarget.toLowerCase() === 'all') {
    return appliedVersions;
  }

  const directMatch = appliedVersions.find((version) => version === normalizedTarget);
  if (directMatch) {
    return [directMatch];
  }

  const idMatches = appliedVersions.filter(
    (version) =>
      version.startsWith(`${normalizedTarget}_`) ||
      version.startsWith(`${normalizedTarget}.`) ||
      version === `${normalizedTarget}.sql`
  );

  if (idMatches.length === 1) {
    return idMatches;
  }

  if (idMatches.length > 1) {
    throw new Error(
      `MIGRATION_REVERT_TARGET=${normalizedTarget} matches multiple applied migrations. Use full filename.`
    );
  }

  throw new Error(`MIGRATION_REVERT_TARGET=${normalizedTarget} does not match an applied migration.`);
};

const resolveDownMigrationName = (version: string): string =>
  version.endsWith('.sql')
    ? version.replace(/\.sql$/, '.down.sql')
    : `${version}.down.sql`;

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const runReverts = async () => {
  try {
    await initDB();

    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const skipVersions = parseSkipVersions(process.env.MIGRATION_REVERT_SKIP);
    const targetValue = process.env.MIGRATION_REVERT_TARGET;

    const appliedMigrations = await pool.query<{ version: string }>(`
      SELECT version
      FROM schema_migrations
      ORDER BY applied_at DESC, version DESC
    `);

    if (!appliedMigrations.rowCount || appliedMigrations.rowCount <= 0) {
      console.log('No applied migration found to revert.');
      return;
    }

    const appliedVersions = appliedMigrations.rows.map((row) => row.version);
    const targetVersions = resolveTargetVersions(targetValue, appliedVersions);
    const revertLimit = targetVersions
      ? Number.POSITIVE_INFINITY
      : parseRevertCount(process.env.MIGRATION_REVERT_COUNT);

    const versionsToProcess = targetVersions
      ? appliedMigrations.rows.filter((row) => targetVersions.includes(row.version))
      : appliedMigrations.rows;

    let revertedCount = 0;

    for (const { version } of versionsToProcess) {
      if (revertedCount >= revertLimit) {
        break;
      }

      if (skipVersions.has(version)) {
        console.log(`Revert skipped by config: ${version}`);
        continue;
      }

      const downMigrationName = resolveDownMigrationName(version);
      const downMigrationPath = path.join(MIGRATIONS_DIR, downMigrationName);

      if (!(await fileExists(downMigrationPath))) {
        console.log(`Revert skipped (missing down migration): ${version}`);
        continue;
      }

      const downMigrationSql = await readFile(downMigrationPath, 'utf8');

      await pool.query('BEGIN');
      try {
        await pool.query(downMigrationSql);
        await pool.query('DELETE FROM schema_migrations WHERE version = $1', [version]);
        await pool.query('COMMIT');

        revertedCount += 1;
        console.log(`Migration reverted: ${version}`);
      } catch (error) {
        await pool.query('ROLLBACK');
        throw error;
      }
    }

    if (revertedCount === 0) {
      console.log('No migration reverted. Check your skip list or down migration files.');
    }
  } catch (error) {
    console.error('Error while reverting migrations: ', error);
    throw error;
  }
};

runReverts();
