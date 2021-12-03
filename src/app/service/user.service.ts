import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, shareReplay, switchMap, takeUntil, tap, timer } from "rxjs";
import { UserApi } from "../api/users.api";
import { User } from "../model/user.dto";

const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 3000;

@Injectable({
    providedIn: "root",
})
export class UserNotificationService {
    private cacheUsers$!: Observable<Array<User>>;
    private page: number = 0;

    constructor(private api: UserApi) { }

    get users() {
        if (!this.cacheUsers$) {
            const timer$ = timer(0, REFRESH_INTERVAL);
            this.cacheUsers$ = timer$.pipe(
                takeUntil(timer(30000)),
                switchMap(() => this.requestUsers()),
                shareReplay(CACHE_SIZE)
            )
        }

        return this.cacheUsers$;
    }

    private requestUsers(): Observable<User[]> {
        this.page += 1;
        return this.api.requestUsers(this.page).pipe(
            tap((res: any) => {
                console.log('http result: ', res);
            }),
            catchError(error => {
                console.log("something went wrong " + error)
                return of([]);
            })
        );
    }
}