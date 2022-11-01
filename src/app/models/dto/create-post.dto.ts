import {City} from '../enums/city.js';
import {HousingType} from '../enums/housing-type.js';
import {FacilityType} from '../enums/facility-type.js';
import {Coordinates} from '../entities/coordinates.js';
import {
  ArrayMaxSize,
  ArrayMinSize, ArrayUnique,
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
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN, GUEST_COUNT_MAX,
  GUEST_COUNT_MIN,
  PHOTOS_ARRAY_LENGTH,
  PREVIEW_MAX, PRICE_MAX, PRICE_MIN, ROOM_COUNT_MAX, ROOM_COUNT_MIN,
  TITLE_MAX,
  TITLE_MIN
} from './constants.js';

export default class CreatePostDto {
  @MinLength(TITLE_MIN, {message: `Minimum title length must be ${TITLE_MIN}`})
  @MaxLength(TITLE_MAX, {message: `Maximum title length must be ${TITLE_MIN}`})
  public title!: string;

  @MinLength(DESCRIPTION_MIN, {message: `Minimum description length must be ${DESCRIPTION_MIN}`})
  @MaxLength(DESCRIPTION_MAX, {message: `Maximum description length must be ${DESCRIPTION_MAX}`})
  public description!: string;

  @IsEnum(City, {message: 'city must be one of this cities: Paris, Cologne, Brussels, Amsterdam, Hamburg, Dusseldorf}'})
  public city!: City;

  @MaxLength(PREVIEW_MAX, {message: 'Too long for field «preview»'})
  public preview!: string;

  @IsArray({message: 'Field photos must be an array'})
  @ArrayMinSize(PHOTOS_ARRAY_LENGTH, {message: `Array of photos must contains ${PHOTOS_ARRAY_LENGTH} photos`})
  @ArrayMaxSize(PHOTOS_ARRAY_LENGTH, {message: `Array of photos must contains ${PHOTOS_ARRAY_LENGTH} photos`})
  public photos!: string[];

  @IsBoolean({message: 'Field premium must be a boolean'})
  public premium!: boolean;

  @IsEnum(HousingType, {message: 'type must be one of this types: apartment, house, room, hotel}'})
  public type!: HousingType;

  @IsInt({message: 'roomCount must be an integer'})
  @Min(ROOM_COUNT_MIN, {message: `Minimum count is ${ROOM_COUNT_MIN}`})
  @Max(ROOM_COUNT_MAX, {message: `Maximum count is ${ROOM_COUNT_MAX}`})
  public roomCount!: number;

  @IsInt({message: 'guestCount must be an integer'})
  @Min(GUEST_COUNT_MIN, {message: `Minimum count is ${GUEST_COUNT_MIN}`})
  @Max(GUEST_COUNT_MAX, {message: `Maximum count is ${GUEST_COUNT_MAX}`})
  public guestCount!: number;

  @IsInt({message: 'Price must be an integer'})
  @Min(PRICE_MIN, {message: `Minimum price is ${PRICE_MIN}`})
  @Max(PRICE_MAX, {message: `Maximum price is ${PRICE_MAX}`})
  public price!: number;

  @ArrayUnique({message: 'type must contains values from this facilities: [Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge] }'})
  public facilities!: FacilityType[];

  @IsMongoId({message: 'userId field must be valid an id'})
  public author!: string;

  @IsObject({message: 'Field coordinates must be an object like {city?: Brussels, latitude!: 12.123, longitude!: 23.1233}'})
  public coordinates!: Coordinates;

  public releaseDate?: string;
}
