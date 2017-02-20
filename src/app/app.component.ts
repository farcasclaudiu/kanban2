import {Component} from "@angular/core";
import {AuthService} from "app/shared/auth.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'app works! - kanban2';

    constructor(private authService: AuthService) {
    }

    isLoggedIn(): Observable<boolean> {
        return this.authService.isLoggedIn();
    }
}
