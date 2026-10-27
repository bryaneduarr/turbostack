-- Creates the least-privilege login roles and hands schema ownership to the
-- migrator. Every statement is safe to repeat. Passwords are set separately so
-- the container entrypoint and `db:provision` share this file unchanged.

DO $$
DECLARE
  role_name text;
BEGIN
  FOREACH role_name IN ARRAY ARRAY['app_migrator', 'app_runtime', 'app_cli'] LOOP
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = role_name) THEN
      EXECUTE format('CREATE ROLE %I LOGIN', role_name);
    END IF;
    IF EXISTS (
      SELECT FROM pg_roles
      WHERE rolname = role_name
        AND (rolsuper OR rolcreaterole OR rolcreatedb OR rolreplication OR rolbypassrls)
    ) THEN
      RAISE EXCEPTION 'Role % must not have administrative attributes.', role_name;
    END IF;
    EXECUTE format('ALTER ROLE %I LOGIN', role_name);
  END LOOP;
END
$$;

-- A non-superuser provider admin needs membership to hand objects to the migrator.
DO $$
BEGIN
  IF NOT (SELECT rolsuper FROM pg_roles WHERE rolname = current_user) THEN
    EXECUTE format('GRANT app_migrator TO %I', current_user);
  END IF;
END
$$;

DO $$
BEGIN
  EXECUTE format('REVOKE ALL ON DATABASE %I FROM PUBLIC', current_database());
  EXECUTE format('GRANT CONNECT, CREATE ON DATABASE %I TO app_migrator', current_database());
  EXECUTE format('GRANT CONNECT ON DATABASE %I TO app_runtime, app_cli', current_database());
END
$$;

ALTER SCHEMA public OWNER TO app_migrator;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO app_runtime, app_cli;

-- Objects created before provisioning, such as by an earlier superuser
-- migration run, move to the migrator. Owned sequences follow their tables.
DO $$
DECLARE
  object record;
BEGIN
  IF EXISTS (SELECT FROM pg_namespace WHERE nspname = 'drizzle') THEN
    ALTER SCHEMA drizzle OWNER TO app_migrator;
  END IF;
  FOR object IN
    SELECT relation.oid::regclass AS name, relation.relkind AS kind
    FROM pg_class AS relation
    JOIN pg_namespace AS namespace ON namespace.oid = relation.relnamespace
    WHERE namespace.nspname IN ('public', 'drizzle')
      AND relation.relkind IN ('r', 'p', 'v', 'm', 'f', 'S')
      AND NOT EXISTS (
        SELECT FROM pg_depend AS dependency
        WHERE dependency.objid = relation.oid
          AND dependency.classid = 'pg_class'::regclass
          AND dependency.deptype IN ('a', 'i')
      )
  LOOP
    IF object.kind = 'S' THEN
      EXECUTE format('ALTER SEQUENCE %s OWNER TO app_migrator', object.name);
    ELSIF object.kind IN ('v', 'm') THEN
      EXECUTE format('ALTER %s %s OWNER TO app_migrator', CASE object.kind WHEN 'v' THEN 'VIEW' ELSE 'MATERIALIZED VIEW' END, object.name);
    ELSE
      EXECUTE format('ALTER TABLE %s OWNER TO app_migrator', object.name);
    END IF;
  END LOOP;
  FOR object IN
    SELECT routine.oid::regprocedure AS name
    FROM pg_proc AS routine
    JOIN pg_namespace AS namespace ON namespace.oid = routine.pronamespace
    WHERE namespace.nspname IN ('public', 'drizzle')
  LOOP
    EXECUTE format('ALTER ROUTINE %s OWNER TO app_migrator', object.name);
  END LOOP;
END
$$;

-- Trigger functions created by migrations must not be callable by every role.
ALTER DEFAULT PRIVILEGES FOR ROLE app_migrator REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
