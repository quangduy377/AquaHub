CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
  ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS aquariums (
  id UUID PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(50) NOT NULL,
  volume_litres DOUBLE PRECISION NOT NULL CHECK (volume_litres > 0),
  ph DOUBLE PRECISION CHECK (ph >= 0 AND ph <= 14),
  gh DOUBLE PRECISION CHECK (gh >= 0),
  tds DOUBLE PRECISION CHECK (tds >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS aquariums_owner_id_index
  ON aquariums(owner_id);


CREATE TABLE IF NOT EXISTS water_quality_readings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    aquarium_id UUID NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ph DOUBLE PRECISION CHECK (ph >= 0 AND ph <= 14),
    gh DOUBLE PRECISION CHECK (gh >= 0),
    kh DECIMAL(5,2) NOT NULL,
    tds DOUBLE PRECISION CHECK (tds >= 0),
    temperature DECIMAL(5,2) NOT NULL,
    ammonia DECIMAL(6,3) NOT NULL CHECK(ammonia >= 0),
    nitrite DECIMAL(6,3) NOT NULL CHECK(nitrite >= 0),
    nitrate DECIMAL(6,2) NOT NULL CHECK(nitrate >= 0),
    note TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_reading_aquarium
        FOREIGN KEY (aquarium_id)
        REFERENCES aquariums(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_readings_aquarium_recorded
    ON water_quality_readings(aquarium_id, recorded_at DESC);
