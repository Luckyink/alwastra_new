import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Logout', url: '/home/outbox', icon: 'power' }
    
  ];
  public labels = [];
  constructor(private menuController : MenuController) {
  }

  closeMenu()
  {
    this.menuController.close();
  }
}
