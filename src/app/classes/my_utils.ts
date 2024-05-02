export class Utils {

    static vestingShares2HP(variabile: number, total_vesting_fund_hive: number, total_vesting_shares: number): number {
        return total_vesting_fund_hive * variabile / total_vesting_shares;
    }

    static formatDate(date: Date): string {
        //ritorna tipo : 1/12/2020 13:30
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        console.log(`${day}/${month}/${year} ${hours}:${minutes}`);
        console.log(date);
        console.log(day);
        console.log(month);
        console.log(year);
        console.log(hours);
        console.log(minutes);
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    static scrollToElement(targetElement: HTMLElement | null, behavior: ScrollBehavior = 'smooth') {
        if (!targetElement) return;

        targetElement.scrollIntoView({
            behavior: behavior,
            block: 'start',
            inline: 'nearest'
        });
    }
    private static progressiveIds: { [key: string]: number } = {};

    public static getProgressiveId(prefix: string): number {
        if (!this.progressiveIds[prefix]) {
            this.progressiveIds[prefix] = 0;
        }
        this.progressiveIds[prefix]++;
        return this.progressiveIds[prefix];
    }

    public static getSecureRandomNumber(): number {
        // Create an array of 16 bytes
        let randomValues = new Uint8Array(16);
        // Fill the array with secure random numbers
        window.crypto.getRandomValues(randomValues);
        // Create a secure random number
        let randomNumber = randomValues.reduce((acc, val) => acc + val, 0);
        return randomNumber;
    }

    public static toStringParseFloat(value: any): number {
        return parseFloat(value.toString());
    }
}
