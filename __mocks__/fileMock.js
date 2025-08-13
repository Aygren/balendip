// ===== МОКИ ДЛЯ СТАТИЧЕСКИХ ФАЙЛОВ =====

// Мок для изображений и других статических файлов
module.exports = 'test-file-stub'

// Альтернативный мок для разных типов файлов
module.exports = {
    // Мок для изображений
    'test-file-stub': 'test-file-stub',

    // Мок для SVG файлов
    '.svg': 'test-file-stub',

    // Мок для других типов файлов
    '.png': 'test-file-stub',
    '.jpg': 'test-file-stub',
    '.jpeg': 'test-file-stub',
    '.gif': 'test-file-stub',
    '.webp': 'test-file-stub',

    // Мок для шрифтов
    '.ttf': 'test-file-stub',
    '.woff': 'test-file-stub',
    '.woff2': 'test-file-stub',
    '.eot': 'test-file-stub',
    '.otf': 'test-file-stub',

    // Мок для медиа файлов
    '.mp4': 'test-file-stub',
    '.webm': 'test-file-stub',
    '.wav': 'test-file-stub',
    '.mp3': 'test-file-stub',
    '.m4a': 'test-file-stub',
    '.aac': 'test-file-stub',
    '.oga': 'test-file-stub',
}
