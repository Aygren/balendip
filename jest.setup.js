// ===== НАСТРОЙКИ JEST ДЛЯ ТЕСТИРОВАНИЯ =====

import '@testing-library/jest-dom'

// Мокаем Next.js router
jest.mock('next/router', () => ({
    useRouter() {
        return {
            route: '/',
            pathname: '/',
            query: {},
            asPath: '/',
            push: jest.fn(),
            pop: jest.fn(),
            reload: jest.fn(),
            back: jest.fn(),
            prefetch: jest.fn().mockResolvedValue(undefined),
            beforePopState: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
                emit: jest.fn(),
            },
            isFallback: false,
        }
    },
}))

// Мокаем Next.js navigation
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
        }
    },
    useSearchParams() {
        return new URLSearchParams()
    },
    usePathname() {
        return '/'
    },
}))

// Мокаем Supabase
jest.mock('@/lib/supabase', () => ({
    supabase: {
        auth: {
            getUser: jest.fn(),
            signInWithPassword: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            resetPasswordForEmail: jest.fn(),
            updateUser: jest.fn(),
            onAuthStateChange: jest.fn(() => ({
                data: { subscription: { unsubscribe: jest.fn() } },
            })),
        },
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    order: jest.fn(() => ({
                        limit: jest.fn(() => ({
                            single: jest.fn(),
                        })),
                    })),
                })),
            })),
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn(),
                })),
            })),
            update: jest.fn(() => ({
                eq: jest.fn(() => ({
                    select: jest.fn(() => ({
                        single: jest.fn(),
                    })),
                })),
            })),
            delete: jest.fn(() => ({
                eq: jest.fn(),
            })),
        })),
    },
}))

// Мокаем React Query
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
    useMutation: jest.fn(),
    useQueryClient: jest.fn(),
    useInfiniteQuery: jest.fn(),
}))

// Мокаем D3
jest.mock('d3', () => ({
    select: jest.fn(() => ({
        append: jest.fn(() => ({
            attr: jest.fn(() => ({
                style: jest.fn(() => ({
                    text: jest.fn(() => ({
                        on: jest.fn(() => ({
                            call: jest.fn(),
                        })),
                    })),
                })),
            })),
        })),
        selectAll: jest.fn(() => ({
            data: jest.fn(() => ({
                enter: jest.fn(() => ({
                    append: jest.fn(() => ({
                        attr: jest.fn(() => ({
                            style: jest.fn(() => ({
                                text: jest.fn(() => ({
                                    on: jest.fn(() => ({
                                        call: jest.fn(),
                                    })),
                                })),
                            })),
                        })),
                    })),
                })),
            })),
        })),
    })),
    scaleLinear: jest.fn(() => ({
        domain: jest.fn(() => ({
            range: jest.fn(),
        })),
    })),
    scaleBand: jest.fn(() => ({
        domain: jest.fn(() => ({
            range: jest.fn(() => ({
                padding: jest.fn(),
            })),
        })),
    })),
    scaleOrdinal: jest.fn(() => ({
        domain: jest.fn(() => ({
            range: jest.fn(),
        })),
    })),
    arc: jest.fn(() => ({
        innerRadius: jest.fn(() => ({
            outerRadius: jest.fn(() => ({
                startAngle: jest.fn(() => ({
                    endAngle: jest.fn(),
                })),
            })),
        })),
    })),
    pie: jest.fn(() => ({
        value: jest.fn(() => ({
            sort: jest.fn(),
        })),
    })),
    line: jest.fn(() => ({
        x: jest.fn(() => ({
            y: jest.fn(),
        })),
    })),
    axisBottom: jest.fn(() => ({
        scale: jest.fn(() => ({
            tickFormat: jest.fn(() => ({
                tickSize: jest.fn(() => ({
                    tickPadding: jest.fn(),
                })),
            })),
        })),
    })),
    axisLeft: jest.fn(() => ({
        scale: jest.fn(() => ({
            tickFormat: jest.fn(() => ({
                tickSize: jest.fn(() => ({
                    tickPadding: jest.fn(),
                })),
            })),
        })),
    })),
    format: jest.fn(),
}))

// Мокаем jsPDF
jest.mock('jspdf', () => ({
    jsPDF: jest.fn(() => ({
        setFont: jest.fn(),
        setFontSize: jest.fn(),
        text: jest.fn(),
        addPage: jest.fn(),
        output: jest.fn(() => 'mock-pdf-blob'),
        internal: {
            pageSize: {
                width: 595.28,
                height: 841.89,
            },
        },
    })),
}))

// Мокаем xlsx
jest.mock('xlsx', () => ({
    utils: {
        book_new: jest.fn(() => ({})),
        json_to_sheet: jest.fn(() => ({})),
        book_append_sheet: jest.fn(),
    },
    write: jest.fn(() => new Uint8Array([1, 2, 3, 4])),
}))

// Мокаем localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}
global.localStorage = localStorageMock

// Мокаем sessionStorage
const sessionStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Мокаем URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url')

// Мокаем URL.revokeObjectURL
global.URL.revokeObjectURL = jest.fn()

// Мокаем document.createElement
const mockLink = {
    href: '',
    download: '',
    click: jest.fn(),
    style: {},
}
document.createElement = jest.fn((tagName) => {
    if (tagName === 'a') {
        return mockLink
    }
    return document.createElement(tagName)
})

// Мокаем document.body.appendChild
document.body.appendChild = jest.fn()

// Мокаем document.body.removeChild
document.body.removeChild = jest.fn()

// Настройки для тестов
beforeEach(() => {
    // Очищаем все моки перед каждым тестом
    jest.clearAllMocks()

    // Сбрасываем localStorage
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()

    // Сбрасываем sessionStorage
    sessionStorageMock.getItem.mockClear()
    sessionStorageMock.setItem.mockClear()
    sessionStorageMock.removeItem.mockClear()
    sessionStorageMock.clear.mockClear()

    // Сбрасываем URL моки
    global.URL.createObjectURL.mockClear()
    global.URL.revokeObjectURL.mockClear()

    // Сбрасываем document моки
    mockLink.click.mockClear()
    document.body.appendChild.mockClear()
    document.body.removeChild.mockClear()
})

// Глобальные настройки для тестов
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Мокаем matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

// Мокаем IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Мокаем ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

// Мокаем requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0))

// Мокаем cancelAnimationFrame
global.cancelAnimationFrame = jest.fn()

// Мокаем getComputedStyle
global.getComputedStyle = jest.fn(() => ({
    getPropertyValue: jest.fn(),
}))

// Мокаем window.scrollTo
global.window.scrollTo = jest.fn()

// Мокаем console методы для тестов
global.console = {
    ...console,
    // Отключаем логи в тестах, кроме ошибок
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: console.error, // Оставляем ошибки для отладки
}
