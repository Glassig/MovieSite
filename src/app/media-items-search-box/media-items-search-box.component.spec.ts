import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaItemsSearchBoxComponent } from './media-items-search-box.component';

describe('MediaItemsSearchBoxComponent', () => {
  let component: MediaItemsSearchBoxComponent;
  let fixture: ComponentFixture<MediaItemsSearchBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaItemsSearchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaItemsSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
