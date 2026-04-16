import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, transferArrayItem, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { DataService } from '../shared/data.service';
import { CardList } from '../models/cardlist-info';
import { Card } from '../models/card-info';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-cardlist',
  standalone: true,
  imports: [FormsModule, CdkDropList, CdkDrag, CardComponent],
  templateUrl: './cardlist.component.html',
  styleUrls: ['./cardlist.component.css']
})
export class CardListComponent implements OnInit {
  @Input() item!: CardList;
  @Input() connectedDropLists: string[] = [];
  @Output() cardDropped = new EventEmitter<void>();
  cards: Card[] = [];

  toShowAddCard = false;
  cardname = '';
  carddescription = '';

  private dataService = inject(DataService);

  ngOnInit(): void {
    this.dataService.getCardsByListId(this.item.$key!)
      .subscribe(data => {
        this.cards = data;
      });
  }

  showAddCard(): void {
    this.cardname = '';
    this.carddescription = '';
    this.toShowAddCard = true;
  }

  cancelAddCard(): void {
    this.toShowAddCard = false;
  }

  saveAddCard(): void {
    this.addCard(this.cardname, this.carddescription, true, this.item.$key!, 0);
    this.toShowAddCard = false;
  }

  addCard(name: string, description: string, isExpanded: boolean, cardListId: string, order: number): void {
    const created_at = new Date().toString();
    const newCard = new Card();
    newCard.name = name;
    newCard.description = description;
    newCard.cardListId = cardListId;
    newCard.isExpanded = isExpanded;
    newCard.order = order;
    newCard.created_at = created_at;
    this.dataService.addCard(newCard);
  }

  onCardDrop(event: CdkDragDrop<Card[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // Update order for all cards in this list
    this.cards.forEach((card, i) => {
      card.cardListId = this.item.$key!;
      card.order = i;
      this.dataService.updateCard(card.$key!, card);
    });
  }
}
