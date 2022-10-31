import {City} from '../enums/city.js';
import {HousingType} from '../enums/housing-type.js';
import {FacilityType} from '../enums/facility-type.js';
import {Coordinates} from '../entities/coordinates.js';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray, IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsObject,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export default class CreatePostDto {
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsEnum(City, {message: 'city must be one of this cities: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf}'})
  public city!: City;

  @MaxLength(256, {message: 'Too long for field «preview»'})
  public preview!: string;

  @IsArray({message: 'Field photos must be an array'})
  @ArrayMinSize(6, {message: 'Array of photos must contains 6 photos'})
  @ArrayMaxSize(6, {message: 'Array of photos must contains 6 photos'})
  public photos!: string[];

  @IsBoolean({message: 'Field premium must be a boolean'})
  public premium!: boolean;

  @IsEnum(City, {message: 'type must be one of this types: apartment, house, room, hotel}'})
  public type!: HousingType;

  @IsInt({message: 'roomCount must be an integer'})
  @Min(100, {message: 'Minimum count is 1'})
  @Max(100000, {message: 'Maximum count is 8'})
  public roomCount!: number;

  @IsInt({message: 'guestCount must be an integer'})
  @Min(100, {message: 'Minimum count is 1'})
  @Max(100000, {message: 'Maximum count is 10'})
  public guestCount!: number;

  @IsInt({message: 'Price must be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public price!: number;

  @IsEnum(FacilityType, {message: 'type must contains values from this facilities: [Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge] }'})
  public facilities!: FacilityType[];

  @IsMongoId({message: 'userId field must be valid an id'})
  public author!: string;

  @IsObject({message: 'Field coordinates must be an object like {city?: Brussels, latitude!: 12.123, longitude!: 23.1233}'})
  public coordinates!: Coordinates;
}
