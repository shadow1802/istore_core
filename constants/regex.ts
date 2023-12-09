const REGEX = {
    INCLUDE_SPACE: RegExp(`^(?!\\s*$)[^\\s]+$`),
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}

export default REGEX