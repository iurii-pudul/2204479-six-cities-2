export const Component = {
  Application: Symbol.for('Application'),
  LoggerInterface: Symbol.for('LoggerInterface'),
  ConfigInterface: Symbol.for('ConfigInterface'),
  DatabaseInterface: Symbol.for('DatabaseInterface'),
  UserServiceInterface: Symbol.for('UserServiceInterface'),
  UserModel: Symbol.for('UserModel'),
  CommentServiceInterface: Symbol.for('CommentServiceInterface'),
  CommentModel: Symbol.for('CommentModel'),
  CommentRatingsModel: Symbol.for('CommentRatingsModel'),
  CommentRatingsServiceInterface: Symbol.for('CommentRatingsServiceInterface'),
  PostServiceInterface: Symbol.for('PostServiceInterface'),
  PostModel: Symbol.for('PostModel'),
  PostRatingsModel: Symbol.for('PostRatingsModel'),
  PostRatingsServiceInterface: Symbol.for('PostRatingsServiceInterface'),
  FavoriteServiceInterface: Symbol.for('FavoriteServiceInterface'),
  FavoriteModel: Symbol.for('FavoriteModel')
} as const;
