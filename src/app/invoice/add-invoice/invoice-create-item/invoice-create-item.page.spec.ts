import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { InvoiceCreateItemPage } from './invoice-create-item.page';

describe('InvoiceCreateItemPage', () => {
  let component: InvoiceCreateItemPage;
  let fixture: ComponentFixture<InvoiceCreateItemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InvoiceCreateItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
