/* Safe to re-run if an earlier attempt stopped mid-migration. */
IF COL_LENGTH('dbo.users', 'mfa_secret_encrypted') IS NULL
  ALTER TABLE dbo.users ADD mfa_secret_encrypted NVARCHAR(MAX) NULL;
IF COL_LENGTH('dbo.users', 'password_changed_at') IS NULL
  ALTER TABLE dbo.users ADD password_changed_at DATETIME2 NULL;
GO

IF COL_LENGTH('dbo.sessions', 'state') IS NULL
  ALTER TABLE dbo.sessions ADD state NVARCHAR(20) NOT NULL CONSTRAINT DF_sessions_state DEFAULT 'authenticated';
IF COL_LENGTH('dbo.sessions', 'last_activity_at') IS NULL
  ALTER TABLE dbo.sessions ADD last_activity_at DATETIME2 NOT NULL CONSTRAINT DF_sessions_last_activity DEFAULT SYSUTCDATETIME();
GO

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_sessions_state')
  ALTER TABLE dbo.sessions ADD CONSTRAINT CK_sessions_state CHECK (state IN ('authenticated', 'mfa_pending'));
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_sessions_user_state' AND object_id = OBJECT_ID('dbo.sessions'))
  CREATE INDEX IX_sessions_user_state ON dbo.sessions(user_id, state, expires_at);
GO

IF OBJECT_ID('dbo.mfa_enrollments', 'U') IS NULL
CREATE TABLE dbo.mfa_enrollments (
  id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY, user_id UNIQUEIDENTIFIER NOT NULL,
  secret_encrypted NVARCHAR(MAX) NOT NULL, expires_at DATETIME2 NOT NULL, created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_mfa_enrollments_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE,
  CONSTRAINT UQ_mfa_enrollments_user UNIQUE(user_id)
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_mfa_enrollments_expiry' AND object_id = OBJECT_ID('dbo.mfa_enrollments'))
  CREATE INDEX IX_mfa_enrollments_expiry ON dbo.mfa_enrollments(expires_at);
GO

IF OBJECT_ID('dbo.recovery_codes', 'U') IS NULL
CREATE TABLE dbo.recovery_codes (
  id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY, user_id UNIQUEIDENTIFIER NOT NULL,
  code_hash NVARCHAR(255) NOT NULL, used_at DATETIME2 NULL, created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_recovery_codes_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
);
GO
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_recovery_codes_user_unused' AND object_id = OBJECT_ID('dbo.recovery_codes'))
  CREATE INDEX IX_recovery_codes_user_unused ON dbo.recovery_codes(user_id, used_at);
GO
