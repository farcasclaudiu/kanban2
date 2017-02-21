import {Component, OnInit, Input, ViewChild} from "@angular/core";
import {DataService} from "app/shared/data.service";
import {Observable} from "rxjs";
import {CardList} from "app/models/cardlist-info";
import {Card} from "app/models/card-info";
import {Task} from "app/models/task-info";
import { ModalDirective } from 'ng2-bootstrap/modal';

@Component({
    selector: 'card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
    @ViewChild('childModal') public childModal:ModalDirective;
    @Input() item: Card;
    tasks : Task[]

    newtaskdesc;


    constructor(private dataService: DataService) {
        //console.log(this.item);
    }

    ngOnInit() {
        //console.log(this.item);
        this.dataService.getTasksByCardId(this.item.$key)
            .subscribe(data => {
                this.tasks = data;
            })
    }

    addNewTask(){
        //console.log('Add new subtask!');
        let newTask = new Task();
        newTask.cardId = this.item.$key;
        newTask.description = this.newtaskdesc;
        newTask.isCompleted = false;
        newTask.order = 0;
        newTask.created_at = new Date().toString();
        this.dataService.addTask(newTask)
            .then(() => {
                this.newtaskdesc = '';
            });
    }

    deleteTask(task){
        //console.log(task);
        this.childModal.show();
    }
    public hideChildModal():void {
        this.childModal.hide();
    }

    changeTaskCompleted(task){
        //console.log(task);
        this.dataService.updateTask(task.$key, task);
    }

    clickCarret(){
        this.item.isExpanded = !this.item.isExpanded;
        this.dataService.updateCard(this.item.$key,this.item);
    }
}
