import fs = require("fs");

export class Ratelimit {
    constructor() { };

    isRated(key: string): boolean {

        if (!key) {
            throw new TypeError("Key is not given");
        };

        if (
            !fs.existsSync("./.daycord") ||
            !fs.existsSync("./.daycord/ratelimit.json")
        ) {
            return false;
        };

        try {

            let json = JSON.parse(fs.readFileSync("./.daycord/ratelimit.json", "utf-8")) as APIRateData[];

            let data = json.find((j) =>
                j.key === key.toLowerCase()
            );

            if (!data) {
                return false;
            };

            if (data.expires_in - (Date.now() - data.limitedAt) > 0) {
                return true;
            };

            return false;

        } catch (e) {
            return false;
        };
    };

    get(key: string): APIRateData | undefined {

        try {

            const json = JSON.parse(fs.readFileSync("./.daycord/ratelimit.json", "utf-8")) as APIRateData[];
            const data = json.find(j =>
                j.key === key.toLowerCase()
            );

            if (!data) {
                return undefined;
            };

            return data;

        } catch (e) {
            return undefined;
        };

    };

    /**
     * @param {string} key
     * The key to set the limit for
     * @param {number} expiryIn
     * The time when it will expiry in ms
     */
    add(key: string, expiryIn: number) {

        if (!key) {
            throw TypeError(`You have to provide the key to set the ratelimit`);
        };

        if (!expiryIn) {
            throw TypeError(`You have to set the ${key} expiry time`);
        };

        const data = {
            key: key,
            limitedAt: Date.now(),
            expires_in: expiryIn
        };

        if (!fs.existsSync("./.daycord")) {
            fs.mkdirSync("./.daycord");
        };

        if (!fs.existsSync("./.daycord/ratelimit.json")) {

            console.log("created");

            fs.appendFile("./.daycord/ratelimit.json", JSON.stringify([data], null, 2), "utf-8", error => {

                if (error) {
                    throw new ReferenceError(`The ratelimit could not be add`);
                };

            });
        } else {

            if (this.get(key)) {
                throw new ReferenceError(`Key: ${key} - is already in the rate limit`);
            };

            let limitJson = JSON.parse(fs.readFileSync("./.daycord/ratelimit.json", "utf-8")) as APIRateData[];
            limitJson.push(data as unknown as APIRateData);

            try {

                fs.writeFileSync("./.daycord/ratelimit.json", JSON.stringify(limitJson, null, 2), "utf-8");

            } catch (e) {
                throw new ReferenceError(`The ratelimit for ${key} could not be add`);
            };
            
        };
    };

    remove(key: string) {

        if (!this.get(key)) {
            throw new ReferenceError(`${key} - does not exist or already removed`);
        };

        let json = JSON.parse(fs.readFileSync("./.daycord/ratelimit.json", "utf-8")) as APIRateData[];

        for (var i = 0; i < json.length; i++) {

            if (json[i].key === key) {
                json.splice(i, 1);
            };
        };

        try {
            fs.writeFileSync("./.daycord/ratelimit.json", JSON.stringify(json, null, 2), "utf-8");
        } catch (e) {
            throw new ReferenceError(`The ratelimit for ${key} could no be remove`);
        };

    };
};


export interface APIRateData {
    key: string;
    limitedAt: number;
    expires_in: number;
};