export const error = (content: string) => {
    console.log(`\x1b[31m ${content} \x1b[0m`)
    return `\x1b[31m ${content} \x1b[0m`
}