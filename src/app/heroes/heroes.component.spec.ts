import {HeroesComponent} from './heroes.component';
import {of} from 'rxjs/internal/observable/of';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HeroService} from '../hero.service';
import {Component, DebugElement, Directive, HostListener, Input} from '@angular/core';
import {Hero} from '../hero';
import {By} from '@angular/platform-browser';
import {HeroComponent} from '../hero/hero.component';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroService;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 15},
      {id: 3, name: 'SuperMetal Guy', strength: 11}
    ];
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    component = new HeroesComponent(mockHeroService);
  });

  describe('delete', () => {
    it('should remove hero from the heroes list', () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;
      component.delete(HEROES[2]);
      expect(component.heroes.length).toBe(2);
    });
    it('should remove given hero', () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;
      component.delete(HEROES[1]);
      expect(component.heroes.indexOf(HEROES[1])).toBe(-1);
    });
    it('should call delete Hero', () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[1]);

      expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[1]);
    });
  });

});
describe('HeroesComponent (shallow tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  @Component({
    selector: 'app-hero',
    template: '<div></div>'
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
    // @Output() delete = new EventEmitter();
  }
    beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 15},
      {id: 3, name: 'SuperMetal Guy', strength: 11}
    ];
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        FakeHeroComponent
      ],
      providers: [{provide: HeroService, useValue: mockHeroService}],


    });
    fixture = TestBed.createComponent(HeroesComponent);
  });
  it('should set heroes correctly from the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toBe(3);
  });
  it('should generate one child component for each hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
  });

});
@Directive({
  selector: '[routerLink]',
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  @HostListener('click') onClick() {
    this.navigatedTo = this.linkParams;
  }
}
describe('HeroesComponent (deep tests)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 15},
      {id: 3, name: 'SuperMetal Guy', strength: 11}
    ];
    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [{provide: HeroService, useValue: mockHeroService}],
      // schemas: [NO_ERRORS_SCHEMA]
    });
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture = TestBed.createComponent(HeroesComponent);
    fixture.detectChanges();
  });

  it('should render each hero as a HeroComponent', () => {
    const heroComponentDEs: DebugElement[] = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponentDEs.length).toBe(3);
    let i = 0;
    heroComponentDEs.forEach(de => {
      expect(de.componentInstance.hero).toEqual(HEROES[i++]);
    });
  });

  it('should call heroService.deleteHero when the Hero Components delete button is clicked', () => {
    spyOn(fixture.componentInstance, 'delete');
    const heroComponents: DebugElement[] = fixture.debugElement.queryAll(By.directive(HeroComponent));
    heroComponents.forEach( de => {
      (<HeroComponent>de.componentInstance).delete.emit(undefined);
      expect(fixture.componentInstance.delete).toHaveBeenCalledWith(de.componentInstance.hero);
    });
  });
  it('should add a new hero to the hero list when the add button is clicked', () => {
    const name = 'Mr. Dude';
    mockHeroService.addHero.and.returnValue(of({id: 5, name: name, strength: 4}));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    inputElement.value = name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const heroComponents: DebugElement[] = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponents[heroComponents.length - 1].componentInstance.hero.name).toBe('Mr. Dude');
  });
  it('should have correct route for the first hero', () => {
    const heroComponents: DebugElement[] = fixture.debugElement.queryAll(By.directive(HeroComponent));
    heroComponents.forEach(de => {
      const router = de.query(By.directive(RouterLinkDirectiveStub))
        .injector.get(RouterLinkDirectiveStub);
      de.query(By.css('a')).triggerEventHandler('click', null);
      expect(router.navigatedTo).toBe('/detail/' + de.componentInstance.hero.id);
    });
  });
});
