@echo off
setlocal

if defined COURSE_DOCS_SITE_DIR (
  set "SITE=%COURSE_DOCS_SITE_DIR%"
) else if exist "%~dp0..\..\course-docs-site\" (
  set "SITE=%~dp0..\..\course-docs-site"
)

if not defined SITE (
  echo Set COURSE_DOCS_SITE_DIR to your course-docs-site checkout path. 1>&2
  exit /b 1
)

set "COURSE_CONTENT_SOURCE=%CD%"
call npm --prefix "%SITE%" run build
