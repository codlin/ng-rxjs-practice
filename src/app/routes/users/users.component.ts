import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { mapTo, merge, mergeMap, Observable, skip, Subject, take, tap } from 'rxjs';
import { User } from 'src/app/model/user.dto';
import { UserNotificationService } from 'src/app/service/user.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnChanges {
    users$!: Observable<User[]>;
    updateClick$: Subject<void> = new Subject<void>();
    showNotificatoin$!: Observable<boolean>;

    constructor(private notifySvc: UserNotificationService) { }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ng changes', changes);
    }

    ngOnInit(): void {
        console.log('**********OnInit Begin**********');

        const initialUser$ = this.getUserOnce();
        const updateUser$ = this.updateClick$.pipe(
            mergeMap(() => this.getUserOnce()),
            tap(() => console.log('click update')),
        );
        this.users$ = merge(initialUser$, updateUser$);

        const initNotification$ = this.getNotification();
        const show$ = initNotification$.pipe(
            tap((res) => console.log('notify', res)),
            mapTo(true),
        );
        const hide$ = this.updateClick$.pipe(
            tap(() => console.log('click update')),
            mapTo(false),
        );
        this.showNotificatoin$ = merge(show$, hide$);

        console.log('**********OnInit Finished**********');
    }

    getUserOnce() {
        return this.notifySvc.users.pipe(take(1));
    }

    getNotification() {
        return this.notifySvc.users.pipe(skip(5));
    }
}
