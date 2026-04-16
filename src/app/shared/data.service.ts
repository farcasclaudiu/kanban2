import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { AngularFireDatabase, AngularFireList, QueryFn } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../models/project-info';
import { CardList } from '../models/cardlist-info';
import { Card } from '../models/card-info';
import { Task } from '../models/task-info';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private db = inject(AngularFireDatabase);
  private injector = inject(Injector);

  private projectsRef: AngularFireList<Project>;
  private cardlistsRef: AngularFireList<CardList>;
  private cardsRef: AngularFireList<Card>;
  private tasksRef: AngularFireList<Task>;

  constructor() {
    this.projectsRef = this.db.list('/projects');
    this.cardlistsRef = this.db.list('/cardlist', ref => ref.orderByChild('order'));
    this.cardsRef = this.db.list('/cards');
    this.tasksRef = this.db.list('/tasks');
  }

  private stripKey<T extends { $key?: string }>(obj: T): Omit<T, '$key'> {
    const copy = { ...obj };
    delete copy.$key;
    return copy;
  }

  private queryList<T>(path: string, queryFn: QueryFn): Observable<T[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = this.db.list(path, queryFn);
      return ref.snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ $key: c.payload.key, ...(c.payload.val() as object) } as T))
        )
      );
    });
  }

  private snapshotsWithKey<T>(ref: AngularFireList<unknown>): Observable<T[]> {
    return ref.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ $key: c.payload.key, ...(c.payload.val() as object) } as T))
      )
    );
  }

  // --- Projects ---

  getProjects(): Observable<Project[]> {
    return this.snapshotsWithKey<Project>(this.projectsRef);
  }

  addProject(project: Project) {
    return this.projectsRef.push(this.stripKey(project));
  }

  // --- CardLists ---

  getCardLists(): Observable<CardList[]> {
    return this.snapshotsWithKey<CardList>(this.cardlistsRef);
  }

  getCardListsById(cardListId: string): Observable<CardList | null> {
    return this.db.object<CardList>(`/cardlist/${cardListId}`).snapshotChanges().pipe(
      map(c => ({ $key: c.payload.key, ...c.payload.val() } as CardList))
    );
  }

  getCardListsByOrder(order: number): Observable<CardList[]> {
    return this.queryList<CardList>('/cardlist', ref => ref.orderByChild('order').equalTo(order));
  }

  getCardListsByProject(projectId: string): Observable<CardList[]> {
    return this.queryList<CardList>('/cardlist', ref => ref.orderByChild('projectId').equalTo(projectId));
  }

  addCardList(cardlist: CardList) {
    return this.cardlistsRef.push(this.stripKey(cardlist));
  }

  // --- Cards ---

  getCards(): Observable<Card[]> {
    return this.snapshotsWithKey<Card>(this.cardsRef);
  }

  getCardsByListId(listId: string): Observable<Card[]> {
    return this.queryList<Card>('/cards', ref => ref.orderByChild('cardListId').equalTo(listId)).pipe(
      map(cards => cards.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    );
  }

  addCard(card: Card) {
    return this.cardsRef.push(this.stripKey(card));
  }

  updateCard(key: string, updCard: Card) {
    return this.cardsRef.update(key, this.stripKey(updCard));
  }

  // --- Tasks ---

  getTasks(): Observable<Task[]> {
    return this.snapshotsWithKey<Task>(this.tasksRef);
  }

  getTasksByCardId(cardId: string): Observable<Task[]> {
    return this.queryList<Task>('/tasks', ref => ref.orderByChild('cardId').equalTo(cardId));
  }

  addTask(task: Task) {
    return this.tasksRef.push(this.stripKey(task));
  }

  updateTask(key: string, updTask: Task) {
    return this.tasksRef.update(key, this.stripKey(updTask));
  }

  deleteTask(key: string) {
    return runInInjectionContext(this.injector, () => {
      return this.db.object('/tasks/' + key).remove();
    });
  }
}
