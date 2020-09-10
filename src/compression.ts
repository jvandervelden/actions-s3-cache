export interface CompressionType {
    fileExt: string,
    tarOption: string
};

interface Compressions {
    [key: string]: CompressionType
};

const compressionMap: Compressions = {
    bzip2:  { fileExt: 'bz2', tarOption: '-j' },
    xz: { fileExt: 'xz', tarOption: '-J' },
    lzip: { fileExt: 'lzip', tarOption: '--lzip' },
    lzma: { fileExt: 'lzma', tarOption: '--lzma' },
    lzop: { fileExt: 'lzop', tarOption: '--lzop' },
    gzip: { fileExt: 'gz', tarOption: '-z' },
    compress: { fileExt: 'Z', tarOption: '-Z' },
    zstd: { fileExt: 'zst', tarOption: '--zstd' },
};

export function getCompressionType(compression: string): CompressionType {
    const compressionType: CompressionType = compressionMap[compression];

    if (!compressionType) { throw new Error(`Unknown compression ${compression}`); }

    return compressionType;
}