export default class CreateFavoriteDto {


  constructor(userId: string, postId: string) {
    this.userId = userId;
    this.postId = postId;
  }

  public userId!: string;
  public postId!: string;
}
