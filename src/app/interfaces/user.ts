export interface User {
    userid: string;
    username: string;
    email: string;
    rank: string;
    uploaded: {value: number, unit: string};
    downloaded: {value: number, unit: string};
    registered: {year: number, month: number, day: number, hour: number, minute: number, second: number};
}
