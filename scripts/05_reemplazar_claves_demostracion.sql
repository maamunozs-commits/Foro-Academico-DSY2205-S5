SET VERIFY OFF
SET ECHO OFF
WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK

BEGIN
    IF LENGTH('&1') <> 60 OR LENGTH('&2') <> 60 OR LENGTH('&3') <> 60
        OR '&1' NOT LIKE '$2%' OR '&2' NOT LIKE '$2%' OR '&3' NOT LIKE '$2%'
        OR '&1' = '&2' OR '&2' = '&3' OR '&1' = '&3'
    THEN
        RAISE_APPLICATION_ERROR(-20001, 'Se requieren tres hashes BCrypt distintos y válidos');
    END IF;
END;
/
UPDATE usuarios SET contrasena_hash = '&1' WHERE id = 1;
UPDATE usuarios SET contrasena_hash = '&2' WHERE id = 2;
UPDATE usuarios SET contrasena_hash = '&3' WHERE id = 3;
COMMIT;
EXIT
