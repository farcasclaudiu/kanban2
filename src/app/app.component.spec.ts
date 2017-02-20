/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {TestBed, async} from "@angular/core/testing";
import {AppComponent} from "./app.component";
import {AuthService} from "app/shared/auth.service";
import {AuthServiceStub} from "app/shared/auth.service.stub";

describe('AppComponent', () => {
    beforeEach(() => {
        let authServiceStub = new AuthServiceStub(true);

        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {provide: AuthService, useValue: authServiceStub}
            ]
        });;
    });

    it('should create the app', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have as title 'app works!'`, async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual('app works! - kanban2');
    }));

    it('should render title in a h1 tag', async(() => {
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        let compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('app works! - kanban2');
    }));
});
