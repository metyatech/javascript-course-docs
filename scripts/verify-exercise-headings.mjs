import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const contentDir = path.join(repoRoot, 'content');
const headingPattern = /^ {0,3}#{3,6}[ \t]+\S/;

const toPosixPath = (filePath) =>
    path.relative(repoRoot, filePath).split(path.sep).join('/');

const collectMdxFiles = (dirPath) => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            files.push(...collectMdxFiles(entryPath));
        } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
            files.push(entryPath);
        }
    }

    return files.sort((left, right) =>
        toPosixPath(left).localeCompare(toPosixPath(right)),
    );
};

const isFenceLine = (line) => /^\s*(```|~~~)/.test(line);

const isExerciseTagBoundary = (char) =>
    char === undefined || /[\s>/]/.test(char);

const readOpeningTag = (lines, startLineIndex, startColumnIndex) => {
    let quote = null;
    let escaped = false;
    let braceDepth = 0;
    let tagText = '';

    for (
        let lineIndex = startLineIndex;
        lineIndex < lines.length;
        lineIndex += 1
    ) {
        const line = lines[lineIndex];
        const startColumn = lineIndex === startLineIndex ? startColumnIndex : 0;

        for (
            let columnIndex = startColumn;
            columnIndex < line.length;
            columnIndex += 1
        ) {
            const char = line[columnIndex];
            tagText += char;

            if (quote) {
                if (escaped) {
                    escaped = false;
                } else if (char === '\\') {
                    escaped = true;
                } else if (char === quote) {
                    quote = null;
                }
                continue;
            }

            if (char === '"' || char === "'" || char === '`') {
                quote = char;
                continue;
            }

            if (char === '{') {
                braceDepth += 1;
                continue;
            }

            if (char === '}' && braceDepth > 0) {
                braceDepth -= 1;
                continue;
            }

            if (char === '>' && braceDepth === 0) {
                return { endLineIndex: lineIndex, tagText };
            }
        }

        tagText += '\n';
    }

    return { endLineIndex: lines.length - 1, tagText, unterminated: true };
};

const maskQuotedAndBracedText = (tagText) => {
    let quote = null;
    let escaped = false;
    let braceDepth = 0;
    let masked = '';

    for (const char of tagText) {
        if (quote) {
            masked += ' ';
            if (escaped) {
                escaped = false;
            } else if (char === '\\') {
                escaped = true;
            } else if (char === quote) {
                quote = null;
            }
            continue;
        }

        if (char === '"' || char === "'" || char === '`') {
            quote = char;
            masked += ' ';
            continue;
        }

        if (char === '{') {
            braceDepth += 1;
            masked += ' ';
            continue;
        }

        if (braceDepth > 0) {
            if (char === '}') braceDepth -= 1;
            masked += ' ';
            continue;
        }

        masked += char;
    }

    return masked;
};

const hasTitleProp = (tagText) =>
    /\stitle\s*=/.test(maskQuotedAndBracedText(tagText));

const hasImmediateHeading = (lines, startLineIndex) => {
    for (let lineIndex = startLineIndex - 1; lineIndex >= 0; lineIndex -= 1) {
        const line = lines[lineIndex];
        if (line.trim() === '') continue;
        return headingPattern.test(line);
    }

    return false;
};

if (!fs.existsSync(contentDir)) {
    console.error(`Missing content directory: ${toPosixPath(contentDir)}`);
    process.exit(1);
}

const errors = [];
let exerciseCount = 0;

for (const filePath of collectMdxFiles(contentDir)) {
    const relativePath = toPosixPath(filePath);
    const fileText = fs.readFileSync(filePath, 'utf8');
    const lines = fileText.split(/\r?\n/);
    let inFence = false;

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
        const line = lines[lineIndex];

        if (isFenceLine(line)) {
            inFence = !inFence;
            continue;
        }

        if (inFence) continue;

        let searchColumn = 0;
        while (searchColumn < line.length) {
            const startColumn = line.indexOf('<Exercise', searchColumn);
            if (startColumn === -1) break;

            const nextChar = line[startColumn + '<Exercise'.length];
            if (!isExerciseTagBoundary(nextChar)) {
                searchColumn = startColumn + '<Exercise'.length;
                continue;
            }

            const tag = readOpeningTag(lines, lineIndex, startColumn);
            exerciseCount += 1;

            if (tag.unterminated) {
                errors.push(
                    `${relativePath}:${lineIndex + 1}: Unterminated <Exercise> opening tag.`,
                );
            }

            if (hasTitleProp(tag.tagText)) {
                errors.push(
                    `${relativePath}:${lineIndex + 1}: <Exercise> opening tag must not use a title prop.`,
                );
            }

            if (!hasImmediateHeading(lines, lineIndex)) {
                errors.push(
                    `${relativePath}:${lineIndex + 1}: <Exercise> must be immediately preceded by a non-empty Markdown exercise heading (### through ######), allowing only blank lines between them.`,
                );
            }

            searchColumn = startColumn + tag.tagText.length;
        }
    }
}

if (errors.length > 0) {
    console.error('Exercise heading verification failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exit(1);
}

console.log(
    `Exercise heading verification passed for ${exerciseCount} <Exercise> blocks.`,
);
