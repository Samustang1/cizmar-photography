-- schema.sql — databáza pre rezervácie
-- Cizmar Photography · ukážkový skript (PostgreSQL)

CREATE TABLE zakaznici (
  id      SERIAL PRIMARY KEY,
  meno    VARCHAR(120) NOT NULL,
  email   VARCHAR(160) NOT NULL UNIQUE,
  telefon VARCHAR(30),
  mesto   VARCHAR(80),
  created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE rezervacie (
  id          SERIAL PRIMARY KEY,
  zakaznik_id INTEGER NOT NULL REFERENCES zakaznici(id) ON DELETE CASCADE,
  sluzba      VARCHAR(60) NOT NULL,
  datum       DATE,
  cas         TIME,
  lokalita    VARCHAR(120),
  stav        VARCHAR(20) NOT NULL DEFAULT 'nova',
  created     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_rezervacie_stav ON rezervacie (stav);
CREATE INDEX idx_rezervacie_datum ON rezervacie (datum);

-- Nové rezervácie zoradené podľa dátumu
SELECT z.meno, z.email, r.sluzba, r.datum, r.cas, r.stav
FROM rezervacie r
JOIN zakaznici z ON z.id = r.zakaznik_id
WHERE r.stav = 'nova'
ORDER BY r.datum NULLS LAST, r.cas NULLS LAST;