import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

const MOCK_API_SERVER = 'https://61a97f9c33e9df0017ea3df4.mockapi.io/api';

@Injectable({
    providedIn: "root",
})
export class UserApi {
    private static getUsersURL = '/user';

    constructor(private http: HttpClient) { }

    public requestUsers(id: number) {
        return this.http.get(MOCK_API_SERVER + UserApi.getUsersURL + `?page=${id}&limit=10`)
    }
}