CREATE TABLE dbo.activity_log (
  id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
  user_id UNIQUEIDENTIFIER NOT NULL,
  action_type NVARCHAR(100) NOT NULL,
  entity_type NVARCHAR(100) NULL,
  entity_id NVARCHAR(100) NULL,
  metadata NVARCHAR(MAX) NULL,
  created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

  CONSTRAINT FK_activity_log_user FOREIGN KEY (user_id) REFERENCES dbo.users(id) ON DELETE CASCADE
);

CREATE INDEX IX_activity_log_user ON dbo.activity_log(user_id);
CREATE INDEX IX_activity_log_created_at ON dbo.activity_log(created_at);

