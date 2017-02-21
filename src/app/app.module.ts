import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {authConfig, firebaseConfig} from "environments/firebaseConfig";
import {AngularFireModule} from "angularfire2";
import {AlertModule} from "ng2-bootstrap";
import {ModalModule} from 'ng2-bootstrap';

import {DataService} from "app/shared/data.service";
import {CardListComponent} from "app/cardlist/cardlist.component";
import {CardComponent} from "app/card/card.component";
import {DndModule} from 'ng2-dnd';

@NgModule({
    declarations: [
        AppComponent,
        CardListComponent,
        CardComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        DndModule.forRoot(),
        AngularFireModule.initializeApp(firebaseConfig, authConfig)
    ],
    providers: [DataService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
