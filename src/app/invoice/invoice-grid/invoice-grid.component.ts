import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { DataService } from 'src/@core/services/data.service';

@Component({
  selector: 'app-invoice-grid',
  templateUrl: './invoice-grid.component.html',
  styleUrls: ['./invoice-grid.component.scss'],
})
export class InvoiceGridComponent  implements OnInit {

  @Output() onChange: EventEmitter<any> = new EventEmitter();

  gridDataSource: DataSource;
  selectedRows: Array<number>;

  customerChanged(event: any): void {
      this.onChange.emit(event);
  }

  constructor(private dataService: DataService) { }

  ngOnInit() {
      this.dataService.getData('companies', {}).subscribe(data => {
          this.gridDataSource = new DataSource({ store: { type: 'array', key: 'id', data: data }});
          this.selectedRows = [1];
      });
  }

}

