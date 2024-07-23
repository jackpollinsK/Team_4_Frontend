export const dateFilter = (unixTimestamp: number): String => {
    return new Date(unixTimestamp).toDateString();
}