@echo off
setlocal

set "TEAM_SERVICE_CONTAINER=team_service"
set "MIGRATION_REVERT_TARGET="

if not "%~1"=="" (
  set "MIGRATION_REVERT_TARGET=%~1"
)

echo ================================================
echo Running team-service reverts
echo ================================================

if defined MIGRATION_REVERT_TARGET (
  echo Target: %MIGRATION_REVERT_TARGET%
) else (
  echo Target: latest migration
)

echo.
if defined MIGRATION_REVERT_TARGET (
  docker exec -e MIGRATION_REVERT_TARGET=%MIGRATION_REVERT_TARGET% %TEAM_SERVICE_CONTAINER% npm run migrate:revert
) else (
  docker exec %TEAM_SERVICE_CONTAINER% npm run migrate:revert
)

if errorlevel 1 (
  echo [ERROR] Team service reverts failed.
  exit /b 1
)

echo.
echo [OK] Team service reverts completed successfully.
exit /b 0
