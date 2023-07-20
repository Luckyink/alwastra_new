import { AfterViewInit, Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { DxScrollViewComponent } from 'devextreme-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{
  private activatedRoute = inject(ActivatedRoute);
  screenWidth = 0; 
  rowCount = 1;
  tileDirection = "horizontal";
  segment = "transactions";

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
      
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 993)
      {
        this.rowCount = 2;
        this.tileDirection = "horizontal";

      }
      else
      {
        this.rowCount = 1;
        this.tileDirection = "vertical";

      }
  }

  @HostListener('window:resize', ['$event'])  
    onResize(event : any) {  
      this.screenWidth = window.innerWidth;  
      
      if(this.screenWidth < 993)
      {
        this.rowCount = 2;
        this.tileDirection = "horizontal";
      }
      else
      {
        this.rowCount = 1;
        this.tileDirection = "vertical";
      }
    }  

  
}
