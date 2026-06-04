import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const contentDir = path.join(repoRoot, 'content');

const checkedLanguages = new Set([
    'css',
    'html',
    'htm',
    'js',
    'javascript',
    'jsx',
    'json',
    'ts',
    'tsx',
    'typescript',
]);

const checkedAssetExtensions = new Set([
    '.css',
    '.html',
    '.js',
    '.json',
    '.ts',
]);

const toRepoPath = (filePath) =>
    path.relative(repoRoot, filePath).split(path.sep).join('/');

const collectFiles = (dirPath, predicate) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectFiles(entryPath, predicate));
        } else if (entry.isFile() && predicate(entryPath)) {
            files.push(entryPath);
        }
    }

    return files.sort((left, right) =>
        toRepoPath(left).localeCompare(toRepoPath(right)),
    );
};

const stripFencePrefix = (line, prefix) =>
    prefix !== '' && line.startsWith(prefix) ? line.slice(prefix.length) : line;

const verifyIndentation = (
    lines,
    filePath,
    startLineNumber,
    language,
    errors,
) => {
    let inBlockComment = false;

    for (let offset = 0; offset < lines.length; offset += 1) {
        const line = lines[offset];
        const trimmed = line.trim();
        if (trimmed === '') continue;

        if (inBlockComment) {
            if (
                (language === 'html' && trimmed.includes('-->')) ||
                (language !== 'html' && trimmed.includes('*/'))
            ) {
                inBlockComment = false;
            }
            continue;
        }

        if (language === 'html' && trimmed.includes('<!--')) {
            if (!trimmed.includes('-->')) inBlockComment = true;
            continue;
        }

        if (language !== 'html' && trimmed.includes('/*')) {
            if (!trimmed.includes('*/')) inBlockComment = true;
            continue;
        }

        if (/^\t+/.test(line)) {
            errors.push(
                `${toRepoPath(filePath)}:${startLineNumber + offset}: use spaces, not tabs, for code indentation.`,
            );
            continue;
        }

        const leadingSpaces = line.match(/^ */)[0].length;
        if (leadingSpaces % 4 !== 0) {
            errors.push(
                `${toRepoPath(filePath)}:${startLineNumber + offset}: code indentation must use four-space steps.`,
            );
        }
    }
};

const verifyMarkdownFile = (filePath, errors) => {
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
        const openMatch = lines[index].match(
            /^([ \t>]*)(`{3,}|~{3,})([^\r\n]*)$/,
        );
        if (!openMatch) continue;

        const [, prefix, fence, info] = openMatch;
        const fenceChar = fence[0];
        const minFenceLength = fence.length;
        const closePattern = new RegExp(
            `^[ \\t>]*\\${fenceChar}{${minFenceLength},}\\s*$`,
        );

        if (fence.length > 3) {
            for (
                let innerIndex = index + 1;
                innerIndex < lines.length;
                innerIndex += 1
            ) {
                if (closePattern.test(lines[innerIndex])) {
                    index = innerIndex;
                    break;
                }
            }
            continue;
        }

        const language = info.trim().split(/\s+/)[0].toLowerCase();
        const codeLines = [];
        let closeIndex = index;

        for (
            let innerIndex = index + 1;
            innerIndex < lines.length;
            innerIndex += 1
        ) {
            if (closePattern.test(lines[innerIndex])) {
                closeIndex = innerIndex;
                break;
            }

            codeLines.push(stripFencePrefix(lines[innerIndex], prefix));
        }

        if (checkedLanguages.has(language)) {
            verifyIndentation(codeLines, filePath, index + 2, language, errors);
        }

        index = closeIndex;
    }
};

const verifyAssetFile = (filePath, errors) => {
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    const language = path.extname(filePath).toLowerCase().slice(1);
    verifyIndentation(lines, filePath, 1, language, errors);
};

if (!fs.existsSync(contentDir)) {
    console.error(`Missing content directory: ${toRepoPath(contentDir)}`);
    process.exit(1);
}

const errors = [];
const markdownFiles = collectFiles(contentDir, (filePath) =>
    /\.(md|mdx)$/i.test(filePath),
);
const assetFiles = collectFiles(contentDir, (filePath) =>
    checkedAssetExtensions.has(path.extname(filePath).toLowerCase()),
);

for (const filePath of markdownFiles) verifyMarkdownFile(filePath, errors);
for (const filePath of assetFiles) verifyAssetFile(filePath, errors);

if (errors.length > 0) {
    console.error('Code block indentation verification failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
}

console.log(
    `Code block indentation verification passed for ${markdownFiles.length} Markdown files and ${assetFiles.length} asset files.`,
);
