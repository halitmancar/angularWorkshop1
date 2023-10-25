import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CarsMockService } from '../../services/cars-mock.service';
import { CarListItemDto } from '../../models/car-list-item-dto';
import { GetCarsListResponse } from '../../models/get-cars-list-response';

@Component({
  selector: 'app-car-card-list',
  templateUrl: './car-card-list.component.html',
  styleUrls: ['./car-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarCardListComponent implements OnInit {
  cars!: CarListItemDto[];
  tempCars!: CarListItemDto[];
  brandsSet = new Set<string>();
  brands!: string[];
  
  @Input() currentPage: number = 1;

  constructor(
    private carsService: CarsMockService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  getList(): void {
    this.carsService.getList({pageIndex: this.currentPage, pageSize: 20}).subscribe({
      next: (response) => {
        this.cars = response.items;
        this.tempCars = this.cars;
        this.getBrandsOfCars();
        this.changeDetector.detectChanges(); // State'ler üzerindeki değişiklikleri Angular'ın algılaması için uyarmış oluyoruz.
      },
    });
  }

  getFilteredList(brandName: string): void{
      this.currentPage = 1;
      this.tempCars = [];
      this.tempCars = this.cars.filter(car => car.model.brand.name == brandName);
  }

  getBrandsOfCars(): Set<string> {
    for(const car of this.cars){
      if(car!=undefined){
        this.brandsSet.add(car.model.brand.name);
      }
    }
    
    return this.brandsSet;
  }
}
