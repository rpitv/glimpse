import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { AccessLog as AccessLogModel, AlertLog as AlertLogModel, AuditLog as AuditLogModel, BlogPost as BlogPostModel, Category as CategoryModel, ContactSubmissionAssignee as ContactSubmissionAssigneeModel, ContactSubmission as ContactSubmissionModel, Credit as CreditModel, GroupPermission as GroupPermissionModel, Group as GroupModel, Image as ImageModel, Person as PersonModel, PersonImage as PersonImageModel, ProductionImage as ProductionImageModel, ProductionRSVP as ProductionRSVPModel, ProductionTag as ProductionTagModel, Production as ProductionModel, Redirect as RedirectModel, Role as RoleModel, UserPermission as UserPermissionModel, UserGroup as UserGroupModel, User as UserModel, Video as VideoModel, VoteResponse as VoteResponseModel, Vote as VoteModel } from '.prisma/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = undefined | T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
  Upload: any;
};

export type AccessLog = {
  __typename?: 'AccessLog';
  id: Scalars['ID'];
  ip?: Maybe<Scalars['String']>;
  service?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};

export type AlertLog = {
  __typename?: 'AlertLog';
  id: Scalars['ID'];
  message?: Maybe<Scalars['String']>;
  severity?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
};

export type AuditLog = {
  __typename?: 'AuditLog';
  comment?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  metadata?: Maybe<Scalars['JSON']>;
  modificationType?: Maybe<Scalars['String']>;
  modifiedField?: Maybe<Scalars['String']>;
  modifiedTable?: Maybe<Scalars['String']>;
  previousValue?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};

export type BlogPost = {
  __typename?: 'BlogPost';
  author?: Maybe<Person>;
  authorDisplayName?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  postedAt?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Category>;
  priority?: Maybe<Scalars['Int']>;
  productions?: Maybe<Array<Production>>;
};

export type ContactSubmission = {
  __typename?: 'ContactSubmission';
  additionalData?: Maybe<Scalars['JSON']>;
  assignees?: Maybe<Array<ContactSubmissionAssignee>>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  resolved?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['DateTime']>;
};

export type ContactSubmissionAssignee = {
  __typename?: 'ContactSubmissionAssignee';
  id: Scalars['ID'];
  submission?: Maybe<ContactSubmission>;
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
};

export type Credit = {
  __typename?: 'Credit';
  id: Scalars['ID'];
  person?: Maybe<Person>;
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
  title?: Maybe<Scalars['String']>;
};

export type Group = {
  __typename?: 'Group';
  children?: Maybe<Array<Group>>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Group>;
  permissions?: Maybe<Array<GroupPermission>>;
  users?: Maybe<Array<UserGroup>>;
};

export type GroupPermission = {
  __typename?: 'GroupPermission';
  action?: Maybe<Scalars['String']>;
  conditions?: Maybe<Scalars['JSON']>;
  fields?: Maybe<Array<Scalars['String']>>;
  group?: Maybe<Group>;
  id: Scalars['ID'];
  inverted?: Maybe<Scalars['Boolean']>;
  reason?: Maybe<Scalars['String']>;
  subject?: Maybe<Array<Scalars['String']>>;
};

export type Image = {
  __typename?: 'Image';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageFor?: Maybe<Array<ProductionImage>>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  people?: Maybe<Array<PersonImage>>;
  thumbnailFor?: Maybe<Array<Production>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a Credit in a Production for a Person. */
  addCredit?: Maybe<Credit>;
  /** Link an Image to a Production. */
  addImageToProduction?: Maybe<Scalars['Boolean']>;
  /** Link a Video to a Production. */
  addVideoToProduction?: Maybe<Scalars['Boolean']>;
  /** Create a new Category. */
  createCategory?: Maybe<Category>;
  /** Create a new embed-based video in the database. Requires a url that begins with "http://" or "https://". */
  createEmbedVideo?: Maybe<Video>;
  /** Create a new image which is hosted at an off-site URL. */
  createOffsiteImage?: Maybe<Image>;
  /** Create a new person in the database. Returns the newly created Person. */
  createPerson?: Maybe<Person>;
  /** Create a new Production in the database. */
  createProduction?: Maybe<Production>;
  /**
   * Create a new RTMP-based video in the database. Requires a url that begins with "rtmp://". RTMP requires
   * Flash Player, and as such, this type of video should soon be deprecated.
   */
  createRTMPVideo?: Maybe<Video>;
  /** Add a role to a person in the database. Returns the newly created Role. */
  createRole?: Maybe<Role>;
  /**
   * Delete a Category. Will update any child Categories to have the parent of this Category's parent. Will
   * also update any Categories that appear after this Category to appear after the Category that this Category
   * appears after.
   * Returns true on success, false otherwise.
   */
  deleteCategory?: Maybe<Scalars['Boolean']>;
  /**
   * Delete a Credit from a Production. Will update any Credits which appear after this Credit to appear after the
   * Credit that this Credit appears after.
   * Returns true on success, false otherwise.
   */
  deleteCredit?: Maybe<Scalars['Boolean']>;
  /**
   * Delete an image from the database. Also deletes any image-links to productions using this Image.
   * Returns true on success, false otherwise.
   */
  deleteImage?: Maybe<Scalars['Boolean']>;
  /**
   * Delete a person from the database. Will also delete all of their roles.
   * Returns true on success, false otherwise.
   */
  deletePerson?: Maybe<Scalars['Boolean']>;
  /**
   * Delete a production from the database. Also deletes any Credits, video-links, and image-links from the database.
   * Returns true on success, false otherwise.
   */
  deleteProduction?: Maybe<Scalars['Boolean']>;
  /**
   * Delete a role from the database.
   * Returns true on success, false otherwise.
   */
  deleteRole?: Maybe<Scalars['Boolean']>;
  /**
   * Delete a video from the database. Also deletes any video-links to productions using this Video.
   * Returns true on success, false otherwise.
   */
  deleteVideo?: Maybe<Scalars['Boolean']>;
  /** Unlink an Image from a Production. */
  removeImageFromProduction?: Maybe<Scalars['Boolean']>;
  /** Unlink a Video from a Production. */
  removeVideoFromProduction?: Maybe<Scalars['Boolean']>;
  /** Update a Category. */
  updateCategory?: Maybe<Category>;
  /** Update a Credit. */
  updateCredit?: Maybe<Credit>;
  /**
   * Update an embed-based video in the database.
   * If the video with the provided ID is not an embed video, an error will be thrown.
   */
  updateEmbedVideo?: Maybe<Video>;
  /** Update an image in the database. */
  updateImage?: Maybe<Image>;
  /** Update a person in the database with new information. Returns the updated person. */
  updatePerson?: Maybe<Person>;
  /** Update a production in the database. */
  updateProduction?: Maybe<Production>;
  /**
   * Update an RTMP-based video in the database.
   * If the video with the provided ID is not an RTMP video, an error will be thrown.
   */
  updateRTMPVideo?: Maybe<Video>;
  /** Update an existing Role in the database with new information. Returns the new Role. */
  updateRole?: Maybe<Role>;
  /** Upload an image to the database. */
  uploadImage?: Maybe<Image>;
};


export type MutationAddCreditArgs = {
  appearsAfter?: InputMaybe<Scalars['Int']>;
  job?: InputMaybe<Scalars['String']>;
  person: Scalars['Int'];
  production: Scalars['Int'];
};


export type MutationAddImageToProductionArgs = {
  image: Scalars['Int'];
  production: Scalars['Int'];
};


export type MutationAddVideoToProductionArgs = {
  production: Scalars['Int'];
  video: Scalars['Int'];
};


export type MutationCreateCategoryArgs = {
  appearsAfter?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  parent?: InputMaybe<Scalars['Int']>;
};


export type MutationCreateEmbedVideoArgs = {
  name: Scalars['String'];
  url: Scalars['String'];
};


export type MutationCreateOffsiteImageArgs = {
  link: Scalars['String'];
  name: Scalars['String'];
};


export type MutationCreatePersonArgs = {
  classYear?: InputMaybe<Scalars['Int']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  preferredName?: InputMaybe<Scalars['String']>;
};


export type MutationCreateProductionArgs = {
  category?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  startTime?: InputMaybe<Scalars['DateTime']>;
  thumbnail?: InputMaybe<Scalars['Int']>;
  visible?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateRtmpVideoArgs = {
  name: Scalars['String'];
  rtmpUrl: Scalars['String'];
};


export type MutationCreateRoleArgs = {
  appearsAfter?: InputMaybe<Scalars['Int']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  owner: Scalars['Int'];
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCreditArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteImageArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePersonArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVideoArgs = {
  id: Scalars['ID'];
};


export type MutationRemoveImageFromProductionArgs = {
  image: Scalars['Int'];
  production: Scalars['Int'];
};


export type MutationRemoveVideoFromProductionArgs = {
  production: Scalars['Int'];
  video: Scalars['Int'];
};


export type MutationUpdateCategoryArgs = {
  appearsAfter?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateCreditArgs = {
  appearsAfter?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  job?: InputMaybe<Scalars['String']>;
  person?: InputMaybe<Scalars['Int']>;
};


export type MutationUpdateEmbedVideoArgs = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateImageArgs = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
};


export type MutationUpdatePersonArgs = {
  classYear?: InputMaybe<Scalars['Int']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  preferredName?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateProductionArgs = {
  category?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  thumbnail?: InputMaybe<Scalars['Int']>;
  visible?: InputMaybe<Scalars['Boolean']>;
};


export type MutationUpdateRtmpVideoArgs = {
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  rtmpUrl?: InputMaybe<Scalars['String']>;
};


export type MutationUpdateRoleArgs = {
  appearsAfter?: InputMaybe<Scalars['Int']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type MutationUploadImageArgs = {
  file: Scalars['Upload'];
  name: Scalars['String'];
};

export type Person = {
  __typename?: 'Person';
  blogPosts?: Maybe<Array<BlogPost>>;
  credits?: Maybe<Array<Credit>>;
  description?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['DateTime']>;
  graduation?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  images?: Maybe<Array<PersonImage>>;
  name?: Maybe<Scalars['String']>;
  pronouns?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Role>>;
  start?: Maybe<Scalars['DateTime']>;
  users?: Maybe<Array<User>>;
};

export type PersonImage = {
  __typename?: 'PersonImage';
  id: Scalars['ID'];
  image?: Maybe<Image>;
  person?: Maybe<Person>;
  priority?: Maybe<Scalars['Int']>;
};

export type Production = {
  __typename?: 'Production';
  category?: Maybe<Category>;
  closetLocation?: Maybe<Scalars['String']>;
  closetTime?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  discordChannel?: Maybe<Scalars['String']>;
  discordServer?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['DateTime']>;
  eventLocation?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  images?: Maybe<Array<ProductionImage>>;
  isLive?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  rsvps?: Maybe<Array<ProductionRsvp>>;
  startTime?: Maybe<Scalars['DateTime']>;
  tags?: Maybe<Array<ProductionTag>>;
  teamNotes?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Image>;
  videos?: Maybe<Array<ProductionVideo>>;
};

export type ProductionImage = {
  __typename?: 'ProductionImage';
  id: Scalars['ID'];
  image?: Maybe<Image>;
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
};

export type ProductionRsvp = {
  __typename?: 'ProductionRSVP';
  id: Scalars['ID'];
  notes?: Maybe<Scalars['String']>;
  production?: Maybe<Production>;
  user?: Maybe<User>;
  willAttend?: Maybe<Scalars['Boolean']>;
};

export type ProductionTag = {
  __typename?: 'ProductionTag';
  id: Scalars['ID'];
  production?: Maybe<Production>;
  tag?: Maybe<Scalars['String']>;
};

export type ProductionVideo = {
  __typename?: 'ProductionVideo';
  id: Scalars['ID'];
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
  video?: Maybe<Video>;
};

export type Query = {
  __typename?: 'Query';
  /** Get a list of all Category objects in a paginated or non-paginated manner. */
  categories: Array<Category>;
  /** The total number of Categories in the database. Optionally provide a search context. */
  categoryCount: Scalars['Int'];
  /** Get some Category object based on that object's ID. Returns null if the Category does not exist in the database. */
  getCategory?: Maybe<Category>;
  /** Get some Credit object based on that object's ID. Returns null if the Credit does not exist in the database. */
  getCredit?: Maybe<Credit>;
  /** Get some Image object based on that object's ID. Returns null if the Image does not exist in the database. */
  getImage?: Maybe<Image>;
  /** Get some Person object based on that object's ID. Returns null if the Person does not exist in the database. */
  getPerson?: Maybe<Person>;
  /**
   * Get some Production object based on that object's ID. Returns null if the Production does not exist in
   * the database.
   */
  getProduction?: Maybe<Production>;
  /** Get some Role object based on that object's ID. Returns null if the Role does not exist in the database. */
  getRole?: Maybe<Role>;
  /** Get some User object based on that object's ID. Returns null if the User does not exist in the database. */
  getUser?: Maybe<User>;
  /** Get some Video object based on that object's ID. Returns null if the Video does not exist in the database. */
  getVideo?: Maybe<Video>;
  /** The total number of Images in the database. Optionally provide a search context. */
  imageCount: Scalars['Int'];
  /** Get a list of all Image objects in the database in a paginated or non-paginated manner. */
  images: Array<Image>;
  /** The total number of Persons in the database which have an active Role at the given moment. */
  memberCount: Scalars['Int'];
  /** Get a list of all Person objects which have an active role in a paginated or non-paginated manner. */
  members: Array<Person>;
  /** Get a list of all Person objects regardless of member status in a paginated or non-paginated manner. */
  people: Array<Person>;
  /** The total number of Persons in the database. Optionally provide a search context. */
  peopleCount: Scalars['Int'];
  /** The total number of Productions in the database. Optionally provide a search context. */
  productionCount: Scalars['Int'];
  /** Get a list of all Production objects in a paginated or non-paginated manner. */
  productions: Array<Production>;
  /** The total number of Users in the database. Optionally provide a search context. */
  userCount: Scalars['Int'];
  /** Get a list of all User objects in a paginated or non-paginated manner. */
  users: Array<User>;
  /** The total number of Videos in the database. Optionally provide a search context. */
  videoCount: Scalars['Int'];
  /** Get a list of all Video objects in the database in a paginated or non-paginated manner. */
  videos: Array<Video>;
};


export type QueryCategoriesArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  prevCategoryIndex?: InputMaybe<Scalars['Int']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryCategoryCountArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryGetCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryGetCreditArgs = {
  id: Scalars['ID'];
};


export type QueryGetImageArgs = {
  id: Scalars['ID'];
};


export type QueryGetPersonArgs = {
  id: Scalars['ID'];
};


export type QueryGetProductionArgs = {
  id: Scalars['ID'];
};


export type QueryGetRoleArgs = {
  id: Scalars['ID'];
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetVideoArgs = {
  id: Scalars['ID'];
};


export type QueryImageCountArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryImagesArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  prevImageIndex?: InputMaybe<Scalars['Int']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryMembersArgs = {
  pageSize?: InputMaybe<Scalars['Int']>;
  prevPersonIndex?: InputMaybe<Scalars['Int']>;
};


export type QueryPeopleArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  prevPersonIndex?: InputMaybe<Scalars['Int']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryPeopleCountArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryProductionCountArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryProductionsArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  prevProductionIndex?: InputMaybe<Scalars['Int']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryUserCountArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryUsersArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  prevUserIndex?: InputMaybe<Scalars['Int']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryVideoCountArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};


export type QueryVideosArgs = {
  advancedSearch?: InputMaybe<Scalars['Boolean']>;
  pageSize?: InputMaybe<Scalars['Int']>;
  prevVideoIndex?: InputMaybe<Scalars['Int']>;
  searchCtx?: InputMaybe<Scalars['String']>;
};

export type Redirect = {
  __typename?: 'Redirect';
  expires?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  key?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
};

export type Role = {
  __typename?: 'Role';
  endTime?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  person?: Maybe<Person>;
  priority?: Maybe<Scalars['Int']>;
  startTime?: Maybe<Scalars['DateTime']>;
};

export type User = {
  __typename?: 'User';
  accessLogs?: Maybe<Array<AccessLog>>;
  assignedContactSubmissions?: Maybe<Array<ContactSubmissionAssignee>>;
  auditLogs?: Maybe<Array<AuditLog>>;
  discord?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<UserGroup>>;
  id: Scalars['ID'];
  joined?: Maybe<Scalars['DateTime']>;
  mail?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<UserPermission>>;
  person?: Maybe<Person>;
  productionRsvps?: Maybe<Array<ProductionRsvp>>;
  username?: Maybe<Scalars['String']>;
  voteResponses?: Maybe<Array<VoteResponse>>;
};

export type UserGroup = {
  __typename?: 'UserGroup';
  group?: Maybe<Group>;
  id: Scalars['ID'];
  user?: Maybe<User>;
};

export type UserPermission = {
  __typename?: 'UserPermission';
  action?: Maybe<Scalars['String']>;
  conditions?: Maybe<Scalars['JSON']>;
  fields?: Maybe<Array<Scalars['String']>>;
  id: Scalars['ID'];
  inverted?: Maybe<Scalars['Boolean']>;
  reason?: Maybe<Scalars['String']>;
  subject?: Maybe<Array<Scalars['String']>>;
  user?: Maybe<User>;
};

export type Video = {
  __typename?: 'Video';
  format?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  metadata?: Maybe<Scalars['JSON']>;
  name?: Maybe<Scalars['String']>;
  videoFor?: Maybe<Array<ProductionVideo>>;
};

export enum VideoType {
  Embed = 'EMBED',
  Rtmp = 'RTMP'
}

export type Vote = {
  __typename?: 'Vote';
  description?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  options?: Maybe<Array<Scalars['String']>>;
  question?: Maybe<Scalars['String']>;
  responses?: Maybe<Array<VoteResponse>>;
};

export type VoteResponse = {
  __typename?: 'VoteResponse';
  id: Scalars['ID'];
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  vote?: Maybe<Vote>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AccessLog: ResolverTypeWrapper<AccessLogModel>;
  AlertLog: ResolverTypeWrapper<AlertLogModel>;
  AuditLog: ResolverTypeWrapper<AuditLogModel>;
  BlogPost: ResolverTypeWrapper<BlogPostModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<CategoryModel>;
  ContactSubmission: ResolverTypeWrapper<ContactSubmissionModel>;
  ContactSubmissionAssignee: ResolverTypeWrapper<ContactSubmissionAssigneeModel>;
  Credit: ResolverTypeWrapper<CreditModel>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Group: ResolverTypeWrapper<GroupModel>;
  GroupPermission: ResolverTypeWrapper<GroupPermissionModel>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Image: ResolverTypeWrapper<ImageModel>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Mutation: ResolverTypeWrapper<{}>;
  Person: ResolverTypeWrapper<PersonModel>;
  PersonImage: ResolverTypeWrapper<PersonImageModel>;
  Production: ResolverTypeWrapper<ProductionModel>;
  ProductionImage: ResolverTypeWrapper<ProductionImageModel>;
  ProductionRSVP: ResolverTypeWrapper<ProductionRSVPModel>;
  ProductionTag: ResolverTypeWrapper<ProductionTagModel>;
  ProductionVideo: ResolverTypeWrapper<Omit<ProductionVideo, 'production' | 'video'> & { production?: Maybe<ResolversTypes['Production']>, video?: Maybe<ResolversTypes['Video']> }>;
  Query: ResolverTypeWrapper<{}>;
  Redirect: ResolverTypeWrapper<RedirectModel>;
  Role: ResolverTypeWrapper<RoleModel>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<UserModel>;
  UserGroup: ResolverTypeWrapper<UserGroupModel>;
  UserPermission: ResolverTypeWrapper<UserPermissionModel>;
  Video: ResolverTypeWrapper<VideoModel>;
  VideoType: VideoType;
  Vote: ResolverTypeWrapper<VoteModel>;
  VoteResponse: ResolverTypeWrapper<VoteResponseModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccessLog: AccessLogModel;
  AlertLog: AlertLogModel;
  AuditLog: AuditLogModel;
  BlogPost: BlogPostModel;
  Boolean: Scalars['Boolean'];
  Category: CategoryModel;
  ContactSubmission: ContactSubmissionModel;
  ContactSubmissionAssignee: ContactSubmissionAssigneeModel;
  Credit: CreditModel;
  DateTime: Scalars['DateTime'];
  Group: GroupModel;
  GroupPermission: GroupPermissionModel;
  ID: Scalars['ID'];
  Image: ImageModel;
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Mutation: {};
  Person: PersonModel;
  PersonImage: PersonImageModel;
  Production: ProductionModel;
  ProductionImage: ProductionImageModel;
  ProductionRSVP: ProductionRSVPModel;
  ProductionTag: ProductionTagModel;
  ProductionVideo: Omit<ProductionVideo, 'production' | 'video'> & { production?: Maybe<ResolversParentTypes['Production']>, video?: Maybe<ResolversParentTypes['Video']> };
  Query: {};
  Redirect: RedirectModel;
  Role: RoleModel;
  String: Scalars['String'];
  Upload: Scalars['Upload'];
  User: UserModel;
  UserGroup: UserGroupModel;
  UserPermission: UserPermissionModel;
  Video: VideoModel;
  Vote: VoteModel;
  VoteResponse: VoteResponseModel;
};

export type AccessLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccessLog'] = ResolversParentTypes['AccessLog']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  service?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AlertLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlertLog'] = ResolversParentTypes['AlertLog']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  severity?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuditLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuditLog'] = ResolversParentTypes['AuditLog']> = {
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  modificationType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modifiedField?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modifiedTable?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  previousValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlogPostResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlogPost'] = ResolversParentTypes['BlogPost']> = {
  author?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  authorDisplayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  postedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  productions?: Resolver<Maybe<Array<ResolversTypes['Production']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactSubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactSubmission'] = ResolversParentTypes['ContactSubmission']> = {
  additionalData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  assignees?: Resolver<Maybe<Array<ResolversTypes['ContactSubmissionAssignee']>>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  resolved?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactSubmissionAssigneeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactSubmissionAssignee'] = ResolversParentTypes['ContactSubmissionAssignee']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  submission?: Resolver<Maybe<ResolversTypes['ContactSubmission']>, ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreditResolvers<ContextType = any, ParentType extends ResolversParentTypes['Credit'] = ResolversParentTypes['Credit']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  production?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['Group']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<Array<ResolversTypes['GroupPermission']>>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<ResolversTypes['UserGroup']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupPermissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GroupPermission'] = ResolversParentTypes['GroupPermission']> = {
  action?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conditions?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  fields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inverted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageFor?: Resolver<Maybe<Array<ResolversTypes['ProductionImage']>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  path?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  people?: Resolver<Maybe<Array<ResolversTypes['PersonImage']>>, ParentType, ContextType>;
  thumbnailFor?: Resolver<Maybe<Array<ResolversTypes['Production']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addCredit?: Resolver<Maybe<ResolversTypes['Credit']>, ParentType, ContextType, RequireFields<MutationAddCreditArgs, 'person' | 'production'>>;
  addImageToProduction?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAddImageToProductionArgs, 'image' | 'production'>>;
  addVideoToProduction?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationAddVideoToProductionArgs, 'production' | 'video'>>;
  createCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'name'>>;
  createEmbedVideo?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType, RequireFields<MutationCreateEmbedVideoArgs, 'name' | 'url'>>;
  createOffsiteImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationCreateOffsiteImageArgs, 'link' | 'name'>>;
  createPerson?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType, Partial<MutationCreatePersonArgs>>;
  createProduction?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType, RequireFields<MutationCreateProductionArgs, 'name'>>;
  createRTMPVideo?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType, RequireFields<MutationCreateRtmpVideoArgs, 'name' | 'rtmpUrl'>>;
  createRole?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<MutationCreateRoleArgs, 'name' | 'owner'>>;
  deleteCategory?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteCredit?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteCreditArgs, 'id'>>;
  deleteImage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteImageArgs, 'id'>>;
  deletePerson?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeletePersonArgs, 'id'>>;
  deleteProduction?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteProductionArgs, 'id'>>;
  deleteRole?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteRoleArgs, 'id'>>;
  deleteVideo?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteVideoArgs, 'id'>>;
  removeImageFromProduction?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRemoveImageFromProductionArgs, 'image' | 'production'>>;
  removeVideoFromProduction?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationRemoveVideoFromProductionArgs, 'production' | 'video'>>;
  updateCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'id'>>;
  updateCredit?: Resolver<Maybe<ResolversTypes['Credit']>, ParentType, ContextType, RequireFields<MutationUpdateCreditArgs, 'id'>>;
  updateEmbedVideo?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType, RequireFields<MutationUpdateEmbedVideoArgs, 'id'>>;
  updateImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationUpdateImageArgs, 'id'>>;
  updatePerson?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType, RequireFields<MutationUpdatePersonArgs, 'id'>>;
  updateProduction?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType, RequireFields<MutationUpdateProductionArgs, 'id'>>;
  updateRTMPVideo?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType, RequireFields<MutationUpdateRtmpVideoArgs, 'id'>>;
  updateRole?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<MutationUpdateRoleArgs, 'id'>>;
  uploadImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<MutationUploadImageArgs, 'file' | 'name'>>;
};

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = {
  blogPosts?: Resolver<Maybe<Array<ResolversTypes['BlogPost']>>, ParentType, ContextType>;
  credits?: Resolver<Maybe<Array<ResolversTypes['Credit']>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  graduation?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Maybe<Array<ResolversTypes['PersonImage']>>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  pronouns?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<ResolversTypes['Role']>>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonImage'] = ResolversParentTypes['PersonImage']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Production'] = ResolversParentTypes['Production']> = {
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  closetLocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  closetTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordChannel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  discordServer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  eventLocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Maybe<Array<ResolversTypes['ProductionImage']>>, ParentType, ContextType>;
  isLive?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rsvps?: Resolver<Maybe<Array<ResolversTypes['ProductionRSVP']>>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['ProductionTag']>>, ParentType, ContextType>;
  teamNotes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  videos?: Resolver<Maybe<Array<ResolversTypes['ProductionVideo']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductionImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductionImage'] = ResolversParentTypes['ProductionImage']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  production?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductionRsvpResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductionRSVP'] = ResolversParentTypes['ProductionRSVP']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  production?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  willAttend?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductionTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductionTag'] = ResolversParentTypes['ProductionTag']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  production?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductionVideoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductionVideo'] = ResolversParentTypes['ProductionVideo']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  production?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType>;
  video?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, Partial<QueryCategoriesArgs>>;
  categoryCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryCategoryCountArgs>>;
  getCategory?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryGetCategoryArgs, 'id'>>;
  getCredit?: Resolver<Maybe<ResolversTypes['Credit']>, ParentType, ContextType, RequireFields<QueryGetCreditArgs, 'id'>>;
  getImage?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<QueryGetImageArgs, 'id'>>;
  getPerson?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType, RequireFields<QueryGetPersonArgs, 'id'>>;
  getProduction?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType, RequireFields<QueryGetProductionArgs, 'id'>>;
  getRole?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryGetRoleArgs, 'id'>>;
  getUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserArgs, 'id'>>;
  getVideo?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType, RequireFields<QueryGetVideoArgs, 'id'>>;
  imageCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryImageCountArgs>>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, Partial<QueryImagesArgs>>;
  memberCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  members?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType, Partial<QueryMembersArgs>>;
  people?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType, Partial<QueryPeopleArgs>>;
  peopleCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryPeopleCountArgs>>;
  productionCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryProductionCountArgs>>;
  productions?: Resolver<Array<ResolversTypes['Production']>, ParentType, ContextType, Partial<QueryProductionsArgs>>;
  userCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryUserCountArgs>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
  videoCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<QueryVideoCountArgs>>;
  videos?: Resolver<Array<ResolversTypes['Video']>, ParentType, ContextType, Partial<QueryVideosArgs>>;
};

export type RedirectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Redirect'] = ResolversParentTypes['Redirect']> = {
  expires?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  accessLogs?: Resolver<Maybe<Array<ResolversTypes['AccessLog']>>, ParentType, ContextType>;
  assignedContactSubmissions?: Resolver<Maybe<Array<ResolversTypes['ContactSubmissionAssignee']>>, ParentType, ContextType>;
  auditLogs?: Resolver<Maybe<Array<ResolversTypes['AuditLog']>>, ParentType, ContextType>;
  discord?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  groups?: Resolver<Maybe<Array<ResolversTypes['UserGroup']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  joined?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  mail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<Array<ResolversTypes['UserPermission']>>, ParentType, ContextType>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  productionRsvps?: Resolver<Maybe<Array<ResolversTypes['ProductionRSVP']>>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voteResponses?: Resolver<Maybe<Array<ResolversTypes['VoteResponse']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserGroup'] = ResolversParentTypes['UserGroup']> = {
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPermissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPermission'] = ResolversParentTypes['UserPermission']> = {
  action?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  conditions?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  fields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inverted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subject?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Video'] = ResolversParentTypes['Video']> = {
  format?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  videoFor?: Resolver<Maybe<Array<ResolversTypes['ProductionVideo']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expires?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  options?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  question?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  responses?: Resolver<Maybe<Array<ResolversTypes['VoteResponse']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteResponse'] = ResolversParentTypes['VoteResponse']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  vote?: Resolver<Maybe<ResolversTypes['Vote']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AccessLog?: AccessLogResolvers<ContextType>;
  AlertLog?: AlertLogResolvers<ContextType>;
  AuditLog?: AuditLogResolvers<ContextType>;
  BlogPost?: BlogPostResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  ContactSubmission?: ContactSubmissionResolvers<ContextType>;
  ContactSubmissionAssignee?: ContactSubmissionAssigneeResolvers<ContextType>;
  Credit?: CreditResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Group?: GroupResolvers<ContextType>;
  GroupPermission?: GroupPermissionResolvers<ContextType>;
  Image?: ImageResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Person?: PersonResolvers<ContextType>;
  PersonImage?: PersonImageResolvers<ContextType>;
  Production?: ProductionResolvers<ContextType>;
  ProductionImage?: ProductionImageResolvers<ContextType>;
  ProductionRSVP?: ProductionRsvpResolvers<ContextType>;
  ProductionTag?: ProductionTagResolvers<ContextType>;
  ProductionVideo?: ProductionVideoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Redirect?: RedirectResolvers<ContextType>;
  Role?: RoleResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  UserGroup?: UserGroupResolvers<ContextType>;
  UserPermission?: UserPermissionResolvers<ContextType>;
  Video?: VideoResolvers<ContextType>;
  Vote?: VoteResolvers<ContextType>;
  VoteResponse?: VoteResponseResolvers<ContextType>;
};

