export class Bus {
    constructor() {
        this.events = {};
    }

    ensure = (eventName) => {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
    };

    on = (eventName, callback) => {
        this.ensure(eventName);
        this.events[eventName].push(callback);
    };

    push = (eventName, eventData) => {
        this.ensure(eventName);
        this.events[eventName].forEach((callback) => callback(eventData));
    };
}
