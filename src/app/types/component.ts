export const Component = {

  Application: Symbol.for('Application'),
  // INTERFACES
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentRatingsServiceInterface: Symbol.for('CommentRatingsServiceInterface'),
  PostServiceInterface: Symbol.for('PostServiceInterface'),
  PostRatingsServiceInterface: Symbol.for('PostRatingsServiceInterface'),
  FavoriteServiceInterface: Symbol.for('FavoriteServiceInterface'),
  ExceptionFilterInterface: Symbol.for('ExceptionFilterInterface'),
  // MODELS
  FavoriteModel: Symbol.for('FavoriteModel'),
  PostModel: Symbol.for('PostModel'),
  PostRatingsModel: Symbol.for('PostRatingsModel'),
  CommentModel: Symbol.for('CommentModel'),
  CommentRatingsModel: Symbol.for('CommentRatingsModel'),
  UserModel: Symbol.for('UserModel'),
  // CONTROLLERS
  UserController: Symbol.for('UserController'),
  PostController: Symbol.for('PostController'),

} as const;
