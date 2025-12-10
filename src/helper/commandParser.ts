export function commandParser(command: string): string {
    if (!command.startsWith("jp!")) {
        return "";
    }
    let newCommand = command.slice(3);
    return newCommand;
}