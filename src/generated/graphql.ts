import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { AccessLog as AccessLogModel, AlertLog as AlertLogModel, Asset as AssetModel, AuditLog as AuditLogModel, BlogPost as BlogPostModel, Category as CategoryModel, ContactSubmissionAssignee as ContactSubmissionAssigneeModel, ContactSubmission as ContactSubmissionModel, Credit as CreditModel, GroupPermission as GroupPermissionModel, Group as GroupModel, Image as ImageModel, Person as PersonModel, PersonImage as PersonImageModel, ProductionImage as ProductionImageModel, ProductionRSVP as ProductionRSVPModel, ProductionTag as ProductionTagModel, Production as ProductionModel, Redirect as RedirectModel, Role as RoleModel, UserPermission as UserPermissionModel, UserGroup as UserGroupModel, User as UserModel, Video as VideoModel, VoteResponse as VoteResponseModel, Vote as VoteModel } from '.prisma/client';
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

export type Asset = {
  __typename?: 'Asset';
  children?: Maybe<Array<Asset>>;
  id: Scalars['ID'];
  isLost?: Maybe<Scalars['Boolean']>;
  lastKnownHandler?: Maybe<User>;
  lastKnownLocation?: Maybe<Scalars['String']>;
  modelNumber?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  parent?: Maybe<Asset>;
  purchaseDate?: Maybe<Scalars['DateTime']>;
  purchaseLocation?: Maybe<Scalars['String']>;
  purchasePrice?: Maybe<Scalars['Int']>;
  serialNumber?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['Int']>;
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
  priority?: Maybe<Scalars['Int']>;
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
  createUser: User;
  createUserGroup: UserGroup;
  deleteUser: User;
  deleteUserGroup: UserGroup;
  updateUser: User;
};


export type MutationCreateUserArgs = {
  userInput: UserWriteInput;
};


export type MutationCreateUserGroupArgs = {
  userGroupInput: UserGroupWriteInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserGroupArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  userInput: UserWriteInput;
};

/**
 * Input type used for pagination in multi-document searches. Offset-based OR cursor-based pagination can be
 * used, or both. This is fed to Prisma. https://www.prisma.io/docs/concepts/components/prisma-client/pagination
 */
export type Pagination = {
  cursor?: InputMaybe<Scalars['ID']>;
  skip?: InputMaybe<Scalars['Int']>;
  take: Scalars['Int'];
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
  /** Get a single user given their ID, or null if that user does not exist. */
  user?: Maybe<User>;
  /** Get a single user-group pair, given its ID, or null if that user-group pair does not exist. */
  userGroup?: Maybe<UserGroup>;
  /** Get a list of users which the user currently has access to read. */
  users: Array<User>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserGroupArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  pagination?: InputMaybe<Pagination>;
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
  checkedOutAssets?: Maybe<Array<Asset>>;
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

export type UserGroupWriteInput = {
  group?: InputMaybe<Scalars['ID']>;
  user?: InputMaybe<Scalars['ID']>;
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

export type UserPermissionWriteInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
  user?: InputMaybe<Scalars['ID']>;
};

export type UserWriteInput = {
  discord?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  person?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export type Video = {
  __typename?: 'Video';
  format?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  metadata?: Maybe<Scalars['JSON']>;
  name?: Maybe<Scalars['String']>;
  videoFor?: Maybe<Array<ProductionVideo>>;
};

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
  Asset: ResolverTypeWrapper<AssetModel>;
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
  Pagination: Pagination;
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
  UserGroupWriteInput: UserGroupWriteInput;
  UserPermission: ResolverTypeWrapper<UserPermissionModel>;
  UserPermissionWriteInput: UserPermissionWriteInput;
  UserWriteInput: UserWriteInput;
  Video: ResolverTypeWrapper<VideoModel>;
  Vote: ResolverTypeWrapper<VoteModel>;
  VoteResponse: ResolverTypeWrapper<VoteResponseModel>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccessLog: AccessLogModel;
  AlertLog: AlertLogModel;
  Asset: AssetModel;
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
  Pagination: Pagination;
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
  UserGroupWriteInput: UserGroupWriteInput;
  UserPermission: UserPermissionModel;
  UserPermissionWriteInput: UserPermissionWriteInput;
  UserWriteInput: UserWriteInput;
  Video: VideoModel;
  Vote: VoteModel;
  VoteResponse: VoteResponseModel;
};

export type AuthDirectiveArgs = {
  action: Scalars['String'];
  subject: Scalars['String'];
};

export type AuthDirectiveResolver<Result, Parent, ContextType = any, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

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

export type AssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['Asset']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isLost?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastKnownHandler?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  lastKnownLocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modelNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType>;
  purchaseDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  purchaseLocation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  purchasePrice?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  serialNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tag?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
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
  priority?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
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
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'userInput'>>;
  createUserGroup?: Resolver<ResolversTypes['UserGroup'], ParentType, ContextType, RequireFields<MutationCreateUserGroupArgs, 'userGroupInput'>>;
  deleteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteUserGroup?: Resolver<ResolversTypes['UserGroup'], ParentType, ContextType, RequireFields<MutationDeleteUserGroupArgs, 'id'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'userInput'>>;
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
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userGroup?: Resolver<Maybe<ResolversTypes['UserGroup']>, ParentType, ContextType, RequireFields<QueryUserGroupArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
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
  checkedOutAssets?: Resolver<Maybe<Array<ResolversTypes['Asset']>>, ParentType, ContextType>;
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
  Asset?: AssetResolvers<ContextType>;
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

export type DirectiveResolvers<ContextType = any> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
};
