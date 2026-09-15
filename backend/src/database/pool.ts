import sql from 'mssql';
import sqlWindows from 'mssql/msnodesqlv8.js';
import { env } from '../config/env.js';

// msnodesqlv8 defaults to an obsolete SQL Server Native Client on Windows. Passing
// `connectionString` inside its configuration object selects the installed ODBC driver.
const windowsConfig = {
  server: env.DB_SERVER!, database: env.DB_DATABASE!,
  connectionString: `Driver={${env.DB_ODBC_DRIVER}};Server=${env.DB_SERVER};Database=${env.DB_DATABASE};Trusted_Connection=Yes;Encrypt=Yes;TrustServerCertificate=Yes`,
  options: { useUTC: true }
};
export const pool = env.DB_DRIVER === 'msnodesqlv8'
  ? new sqlWindows.ConnectionPool(windowsConfig)
  : new sql.ConnectionPool(env.DATABASE_URL!);
export async function connectDatabase() { if (!pool.connected) await pool.connect(); }
export { sql };
