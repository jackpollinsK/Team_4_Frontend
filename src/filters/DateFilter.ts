export const dateFilter = (unixTimestamp: number): string => {
    return new Date(unixTimestamp).toDateString();
}