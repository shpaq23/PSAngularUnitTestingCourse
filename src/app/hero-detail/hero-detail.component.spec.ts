import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {HeroDetailComponent} from './hero-detail.component';
import {HeroService} from '../hero.service';
import {ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import {of} from 'rxjs/internal/observable/of';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

describe('HeroDetailComponent', () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockActivatedRoute, mockHeroService, mockLocation;

  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
    mockLocation = jasmine.createSpyObj(['back']);
    mockActivatedRoute = {snapshot: {paramMap: {get: () => '3'}}};
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        {provide: HeroService, useValue: mockHeroService},
        {provide: Location, useValue: mockLocation},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
      ],
    });
    fixture = TestBed.createComponent(HeroDetailComponent);
    mockHeroService.getHero.and.returnValue(of({id: 4, name: 'Mr. Dude', strength: 101}));
  });
  it('should render the hero name in h2 tag', () => {
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('MR. DUDE');
  });
  it('should call updateHero when save is called', fakeAsync(() => {
    mockHeroService.updateHero.and.returnValue(of({}));
    fixture.detectChanges();

    fixture.componentInstance.save();
    // tick(260);
    flush();
    expect(mockHeroService.updateHero).toHaveBeenCalled();

  }));
  // it('should call updateHero when save is called', async(() => {
  //   mockHeroService.updateHero.and.returnValue(of({}));
  //   fixture.detectChanges();
  //
  //   fixture.componentInstance.save();
  //   fixture.whenStable().then(() => {
  //     expect(mockHeroService.updateHero).toHaveBeenCalled();
  //   });
  // }));
});
