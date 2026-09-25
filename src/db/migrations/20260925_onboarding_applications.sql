-- Additive migration for server-backed onboarding drafts and submissions.
-- Apply only after taking the normal PostgreSQL backup for a release.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS onboarding_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_type VARCHAR(16) NOT NULL CHECK (application_type IN ('merchant', 'courier', 'host')),
    token_hash CHAR(64) NOT NULL,
    status VARCHAR(16) NOT NULL CHECK (status IN ('draft', 'submitted')),
    payload_version INTEGER NOT NULL DEFAULT 1 CHECK (payload_version BETWEEN 1 AND 20),
    payload_ciphertext BYTEA NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_onboarding_application_token UNIQUE (application_type, token_hash),
    CONSTRAINT ck_onboarding_submission_time CHECK (
      (status = 'draft' AND submitted_at IS NULL) OR
      (status = 'submitted' AND submitted_at IS NOT NULL)
    ),
    CONSTRAINT ck_onboarding_expiry CHECK (
      (status = 'draft' AND expires_at IS NOT NULL) OR
      (status = 'submitted' AND expires_at IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_onboarding_drafts_expiry
  ON onboarding_applications(expires_at) WHERE status = 'draft';
CREATE INDEX IF NOT EXISTS idx_onboarding_submitted_type_date
  ON onboarding_applications(application_type, submitted_at DESC) WHERE status = 'submitted';
