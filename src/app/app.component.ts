import { Component, OnInit, inject } from '@angular/core';
import { DataService } from './shared/data.service';
import { Project } from './models/project-info';
import { CardList } from './models/cardlist-info';
import { CardListComponent } from './cardlist/cardlist.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CardListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'The Kanban Board';
  projects: Project[] = [];
  cardlists: CardList[] = [];

  private dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.getProjects()
      .subscribe(data => {
        this.projects = data;
      });
    this.dataService.getCardLists()
      .subscribe(c => this.cardlists = c);
    this.dataService.getCards();
    this.dataService.getTasks();
  }

  addProject(name: string): void {
    const created_at = new Date().toString();
    const newProject = new Project();
    newProject.name = name;
    newProject.created_at = created_at;
    this.dataService.addProject(newProject);
  }

  getConnectedDropLists(currentKey: string): string[] {
    return this.cardlists
      .filter(c => c.$key !== currentKey)
      .map(c => c.$key!);
  }

  addCardList(name: string, projectId: string, color: string, order: number): void {
    const created_at = new Date().toString();
    const newCardList = new CardList();
    newCardList.name = name;
    newCardList.projectId = projectId;
    newCardList.color = color;
    newCardList.order = order;
    newCardList.created_at = created_at;
    this.dataService.addCardList(newCardList);
  }
}
