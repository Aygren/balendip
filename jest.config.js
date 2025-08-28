const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Путь к Next.js приложению для загрузки next.config.js и .env файлов
    dir: './',
})

// Пользовательская конфигурация Jest
const customJestConfig = {
    // Директории для поиска тестов
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],

    // Директории для игнорирования
    testPathIgnorePatterns: [
        '<rootDir>/.next/',
        '<rootDir>/node_modules/',
        '<rootDir>/out/',
        '<rootDir>/dist/',
    ],

    // Окружение для тестов
    testEnvironment: 'jsdom',

    // Настройки для модулей
    moduleNameMapping: {
        // Алиасы путей
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@/types/(.*)$': '<rootDir>/src/types/$1',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
        // Игнорируем CSS модули
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        // Игнорируем изображения и другие статические файлы
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
    },

    // Настройки для тестов
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

    // Настройки для покрытия кода
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!src/**/*.test.{js,jsx,ts,tsx}',
        '!src/**/*.spec.{js,jsx,ts,tsx}',
        '!src/**/__tests__/**',
        '!src/**/__mocks__/**',
        '!src/**/index.ts',
        '!src/**/index.tsx',
    ],

    // Пороги покрытия
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },

    // Настройки для расширений
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    // Настройки для таймаутов
    testTimeout: 10000,

    // Настройки для параллельного выполнения
    maxWorkers: '50%',

    // Настройки для кеширования
    cache: true,
    cacheDirectory: '<rootDir>/.jest-cache',
}

// Экспортируем конфигурацию
module.exports = createJestConfig(customJestConfig)
