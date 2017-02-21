import {Injectable, EventEmitter, Output} from "@angular/core";
import {AngularFire, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable, Subject, ReplaySubject, AsyncSubject} from "rxjs";
import {Project} from "../models/project-info";
import {CardList} from "../models/cardlist-info";
import {Card} from "../models/card-info";
import {Task} from "../models/task-info";

@Injectable()
export class DataService {
    
    projects: FirebaseListObservable<Project[]>;
    cardlists: FirebaseListObservable<CardList[]>;
    cards: FirebaseListObservable<Card[]>;
    tasks: FirebaseListObservable<Task[]>;
    
    constructor(private af: AngularFire) {
        //console.log("DataService");
    }

    getProjects(){
        this.projects = this.af.database.list('/projects') as
            FirebaseListObservable<Project[]>;
        return this.projects;
    }

    addProject(project) {
        return this.projects.push(project);
    }



    getCardLists(){
        this.cardlists = this.af.database.list('/cardlist',{
            query: {
                orderByChild: 'order'
            }}
        ) as
            FirebaseListObservable<CardList[]>;
        return this.cardlists;
    }
    getCardListsById(cardListId:string): FirebaseObjectObservable<CardList> {
        return this.af.database.object(`/cardlist/${cardListId}`) as FirebaseObjectObservable<CardList>;
    }
    getCardListsByOrder(order:number): FirebaseListObservable<CardList[]> {
        let _cardlist = this.af.database.list('/cardlist',{
            query: {
                orderByChild: 'order',
                equalTo: order,
            }}
        ) as FirebaseListObservable<CardList[]>;
        return _cardlist;
    }
    getCachedCardListsById(cardListId:string):CardList {
        return this.cardlists
            .filter(d => d.$key == cardListId)
            .map(d=> d.$key)
            ;
            //.first();
    }
    getCardListsByProject(projectId: string){
        let _cardlist = this.af.database.list('/cardlist',{
            query: {
                orderByChild: 'projectId',
                equalTo: projectId,
            }}
        ) as FirebaseListObservable<CardList[]>;
        return _cardlist
    }
    addCardList(cardlist){
        return this.cardlists.push(cardlist);
    }




    getCards(){
        this.cards = this.af.database.list('/cards') as
            FirebaseListObservable<Card[]>;
        return this.cards;
    }
    getCardsByListId(listId:string){
        this.cards = this.af.database.list('/cards',{
            query: {
                orderByChild: 'cardListId',
                equalTo: listId,
            }}
        ) as
            FirebaseListObservable<Card[]>;
        return this.cards;
    }
    addCard(card){
        return this.cards.push(card);
    }
    updateCard(key, updCard){
        return this.cards.update(key, updCard);
    }



    getTasks(){
        this.tasks = this.af.database.list('/tasks') as
            FirebaseListObservable<Task[]>;
        return this.cards;
    }
    getTasksByCardId(cardId:string){
        let _tasks = this.af.database.list('/tasks',{
            query: {
                orderByChild: 'cardId',
                equalTo: cardId,
            }}
        ) as FirebaseListObservable<Task[]>;
        return _tasks;
    }
    addTask(task){
        return this.tasks.push(task);
    }
    updateTask(key, updTask){
        return this.tasks.update(key, updTask);
    }
}