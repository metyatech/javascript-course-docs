import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const npxCommand = 'npx';
const npmCommand = 'npm';

const readPackageName = (dirPath) => {
  const packageJsonPath = path.join(dirPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) return null;

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return typeof packageJson.name === 'string' ? packageJson.name : null;
  } catch {
    return null;
  }
};

const isCourseDocsSiteDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) return false;
  if (!fs.existsSync(path.join(dirPath, 'scripts', 'content-source.mjs'))) return false;
  return readPackageName(dirPath) === 'course-docs-site';
};

const resolveCourseDocsSiteDir = () => {
  const configuredPath = process.env.COURSE_DOCS_SITE_DIR?.trim();
  if (configuredPath) {
    const resolvedPath = path.resolve(repoRoot, configuredPath);
    if (isCourseDocsSiteDir(resolvedPath)) return resolvedPath;

    throw new Error(
      `COURSE_DOCS_SITE_DIR does not point to a course-docs-site checkout: ${resolvedPath}`,
    );
  }

  let currentDir = repoRoot;
  while (true) {
    const candidateDir = path.join(currentDir, 'course-docs-site');
    if (isCourseDocsSiteDir(candidateDir)) return candidateDir;

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  throw new Error(
    'Unable to locate course-docs-site automatically. Set COURSE_DOCS_SITE_DIR to a local checkout path.',
  );
};

const run = (command, args, options = {}) => {
  console.log(`> ${command} ${args.join(' ')}`);
  const result =
    process.platform === 'win32'
      ? spawnSync(
          [command, ...args.map((arg) => `"${arg.replaceAll('"', '\\"')}"`)].join(' '),
          {
            stdio: 'inherit',
            cwd: repoRoot,
            shell: true,
            ...options,
          },
        )
      : spawnSync(command, args, {
          stdio: 'inherit',
          cwd: repoRoot,
          ...options,
        });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    throw new Error(`${command} exited with code ${result.status}`);
  }
};

const courseDocsSiteDir = resolveCourseDocsSiteDir();
const siteEnv = {
  ...process.env,
  COURSE_CONTENT_SOURCE: repoRoot,
};

run(npxCommand, [
  '-y',
  'markdownlint-cli',
  '**/*.md',
  '--config',
  '.markdownlint.json',
  '--ignore',
  'AGENTS.md',
  '--ignore',
  'agent-rules-private/**',
]);

run(npmCommand, ['run', 'lint'], { cwd: courseDocsSiteDir, env: siteEnv });
run(npmCommand, ['run', 'build:verified'], { cwd: courseDocsSiteDir, env: siteEnv });
