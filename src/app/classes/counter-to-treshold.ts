export class CounterToThreshold {
    private counter: number;
    private counterEnd = false;
    private isCountingActive = false; 
    private threshold: number;
    private isReverseMode: boolean;

    constructor(threshold: number, isReverseMode: boolean) {
        this.isReverseMode = isReverseMode;
        this.threshold = threshold;
        this.counter = isReverseMode ? 0 : threshold;
    }

    public activate(): void {
        this.isCountingActive = true;
    }

    public count(): void {
        if (this.isCountingActive) {
            this.isReverseMode ? this.incrementCount() : this.decrementCount();
        }
    }

    private decrementCount(): void {
        if (this.counter == 0) {
            this.resetCounter();
        } else {
            this.counter--;
            this.counterEnd = false;
        }
    }

    private incrementCount(): void {
        if (this.counter >= this.threshold) {
            this.resetCounter();
        } else {
            this.counter++;
            this.counterEnd = false;
        }
    }

    private resetCounter(): void {
            this.counter = this.isReverseMode ? 0 : this.threshold;
            this.counterEnd = true;
            //this.isCountingActive = false;
    }

    public isActive(): boolean {
        return this.isCountingActive && !this.counterEnd;
    }

    public getCounter(): number {
        return this.counter;
    }
}