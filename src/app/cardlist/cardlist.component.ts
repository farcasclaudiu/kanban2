import {Component, OnInit, Input} from "@angular/core";
import {DataService} from "app/shared/data.service";
import {Observable} from "rxjs";
import {CardList} from "app/models/cardlist-info";
import {Card} from "app/models/card-info";
import {Task} from "app/models/task-info";

@Component({
    selector: 'cardlist',
    templateUrl: './cardlist.component.html',
    styleUrls: ['./cardlist.component.css']
})
export class CardListComponent implements OnInit {
    @Input() item: CardList;
    cards : Card[]

    toShowAddCard:boolean;
    editCard: Card;
    cardname;
    carddescription;
    allowedDropFrom = [];
    allowedDragTo = false;


    constructor(private dataService: DataService) {
    }

    ngOnInit() {
        this.dataService.getCardsByListId(this.item.$key)
            .subscribe(data => {
                this.cards = data;
            });
        //fill allowed drop-from containers
        this.dataService.getCardListsByOrder(this.item.order-1)
            .subscribe(d => {
                    if(d.length>0)
                        this.allowedDropFrom.push(d[0].$key);
                }
            );
        //fill if it has next containers
        this.dataService.getCardListsByOrder(this.item.order+1)
            .subscribe(d => {
                    if(d.length>0)
                        this.allowedDragTo = true;
                }
            );
    }

    showAddCard(){
        this.cardname = '';
        this.carddescription = '';
        this.toShowAddCard = true;
    }

    cancelAddCard(){
        this.toShowAddCard = false;
    }
    saveAddCard(){
        //console.log('save card');
        this.addCard(
            this.cardname, 
            this.carddescription, 
            true, 
            this.item.$key,
        0);
        this.toShowAddCard = false;
    }


    addCard(
        name: string,
        description: string,
        isExpanded: boolean,
        cardListId: string,
        order: number
        )
    {
        let created_at = new Date().toString();
        let newCard:Card = new Card();
        newCard.name = name;
        newCard.description = description;
        newCard.cardListId = cardListId;
        newCard.isExpanded = isExpanded;
        newCard.order =  order;
        newCard.created_at = created_at;
        this.dataService.addCard(newCard);
    }

    cardDropped(ev){
        let card:Card = ev.dragData;
        if(card.cardListId !== this.item.$key){
            card.cardListId = this.item.$key;
            this.dataService.updateCard(card.$key, card);
        }
    }

    allowDragFunction(card: Card){
        return this.allowedDragTo;
    }

    allowDropFunction(): any {
        return (dragData: Card) => {
            return this.allowedDropFrom.indexOf(dragData.cardListId) > -1;
        };
    }

}
