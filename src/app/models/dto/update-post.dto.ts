import {City} from '../enums/city.js';
import {HousingType} from '../enums/housing-type.js';
import {FacilityType} from '../enums/facility-type.js';
import {Coordinates} from '../entities/coordinates.js';

export default class UpdatePostDto {
  public id!: string;
  public title?: string;
  public description?: string;
  public city?: City;
  public preview?: string;
  public photos?: string[];
  public premium?: boolean;
  public type?: HousingType;
  public roomCount?: number;
  public guestCount?: number;
  public price?: number;
  public facilities?: FacilityType[];
  public coordinates?: Coordinates;
}
