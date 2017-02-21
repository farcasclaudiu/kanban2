import {Component, OnInit} from "@angular/core";
import {DataService} from "app/shared/data.service";
import {Observable} from "rxjs";

import {Project} from "app/models/project-info";
import {CardList} from "app/models/cardlist-info";
import {Card} from "app/models/card-info";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {
    title = 'The Kanban Board';
    projects: Project[];
    cardlists: CardList[];

    constructor(private dataService: DataService) {
    }

    ngOnInit(){
        this.dataService.getProjects()
            .subscribe(data => {
                this.projects = data;
                let firstProject = this.projects[0];
                //console.log(firstProject);
                // this.addAddCardList(
                //     'Done', 
                //     firstProject.$key,
                //     'green'
                // );
            });
        this.dataService.getCardLists()
            .subscribe(c => this.cardlists = c)
        ;
        this.dataService.getCards();
        this.dataService.getTasks();
        //this.addProject("TestProject1");
    }

    addProject(name: string)
    {
        let created_at = new Date().toString();
        let newProject:Project = new Project();
        newProject.name = name;
        newProject.created_at= created_at;
        this.dataService.addProject(newProject);
    }

    addCardList(
        name: string,
        projectId: string,
        color: string,
        order: number)
    {
        let created_at = new Date().toString();
        let newCardList:CardList = new CardList();
        newCardList.name = name;
        newCardList.projectId = projectId;
        newCardList.color = color;
        newCardList.order = order;
        newCardList.created_at = created_at;
        this.dataService.addCardList(newCardList);
    }

}
