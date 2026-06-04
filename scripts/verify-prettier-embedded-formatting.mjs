import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
);

const source = [
    '```html',
    '<p>',
    '  <strong>返却期限を過ぎた本がある場合は、新しく借りる前に返却してください。</strong>',
    '</p>',
    '```',
    '',
].join('\n');

const command = process.platform === 'win32' ? 'cmd.exe' : 'npx';
const args =
    process.platform === 'win32'
        ? [
              '/d',
              '/s',
              '/c',
              'npx -y prettier@3.6.2 --stdin-filepath content/sample.mdx',
          ]
        : ['-y', 'prettier@3.6.2', '--stdin-filepath', 'content/sample.mdx'];
const result = spawnSync(command, args, {
    cwd: repoRoot,
    input: source,
    encoding: 'utf8',
});

if (result.error) {
    throw result.error;
}

assert.equal(result.status, 0, result.stderr);
assert.equal(
    result.stdout,
    source,
    'Prettier must preserve fenced source examples instead of reformatting embedded languages.',
);
