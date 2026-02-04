const STATIC_ASSET_EXTENSIONS = new Set([
  '7z',
  'bz2',
  'gz',
  'rar',
  'tar',
  'tgz',
  'xz',
  'zip',

  'aac',
  'flac',
  'm4a',
  'mp3',
  'ogg',
  'opus',
  'wav',

  'csv',
  'json',
  'pdf',
  'txt',
  'xml',
  'yaml',
  'yml',

  'otf',
  'ttf',
  'woff',
  'woff2',

  'apng',
  'avif',
  'bmp',
  'gif',
  'ico',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'tif',
  'tiff',
  'webp',

  'mkv',
  'mov',
  'mp4',
  'webm',

  'css',
  'htm',
  'html',
  'js',
  'map',
]);

const isStaticAssetLike = (segment: string) => {
  const dotIndex = segment.lastIndexOf('.');
  if (dotIndex <= 0) {
    return false;
  }

  const extension = segment.slice(dotIndex + 1).toLowerCase();
  return STATIC_ASSET_EXTENSIONS.has(extension);
};

export const shouldIgnoreMdxPath = (mdxPath: string[] | undefined) => {
  if (!mdxPath || mdxPath.length === 0) {
    return true;
  }

  if (mdxPath[0] === '_next') {
    return true;
  }

  return isStaticAssetLike(mdxPath[mdxPath.length - 1] ?? '');
};
