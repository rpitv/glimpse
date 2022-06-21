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
  service: Scalars['String'];
  timestamp: Scalars['DateTime'];
  user: User;
};

export type AlertLog = {
  __typename?: 'AlertLog';
  id: Scalars['ID'];
  message: Scalars['String'];
  severity: Scalars['String'];
  timestamp: Scalars['DateTime'];
};

export type AlertLogCreateInput = {
  message: Scalars['String'];
  severity: Scalars['String'];
};

export type Asset = {
  __typename?: 'Asset';
  children?: Maybe<Array<Asset>>;
  id: Scalars['ID'];
  isLost: Scalars['Boolean'];
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

export type AssetCreateInput = {
  /** Defaults to false. */
  isLost?: Scalars['Boolean'];
  lastKnownLocation?: InputMaybe<Scalars['String']>;
  modelNumber?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  purchaseDate?: InputMaybe<Scalars['DateTime']>;
  purchaseLocation?: InputMaybe<Scalars['String']>;
  purchasePrice?: InputMaybe<Scalars['Int']>;
  serialNumber?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['Int']>;
};

export type AssetUpdateInput = {
  isLost?: InputMaybe<Scalars['Boolean']>;
  lastKnownLocation?: InputMaybe<Scalars['String']>;
  modelNumber?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  purchaseDate?: InputMaybe<Scalars['DateTime']>;
  purchaseLocation?: InputMaybe<Scalars['String']>;
  purchasePrice?: InputMaybe<Scalars['Int']>;
  serialNumber?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['Int']>;
};

export type AuditLog = {
  __typename?: 'AuditLog';
  comment?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  metadata?: Maybe<Scalars['JSON']>;
  modificationType: Scalars['String'];
  modifiedField: Scalars['String'];
  modifiedTable?: Maybe<Scalars['String']>;
  previousValue?: Maybe<Scalars['String']>;
  timestamp: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type BlogPost = {
  __typename?: 'BlogPost';
  author: Person;
  authorDisplayName?: Maybe<Scalars['String']>;
  content: Scalars['String'];
  id: Scalars['ID'];
  postedAt: Scalars['DateTime'];
  title: Scalars['String'];
};

export type BlogPostCreateInput = {
  authorDisplayName?: InputMaybe<Scalars['String']>;
  content: Scalars['String'];
  title: Scalars['String'];
};

export type BlogPostUpdateInput = {
  authorDisplayName?: InputMaybe<Scalars['String']>;
  content?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  children?: Maybe<Array<Category>>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Category>;
  priority: Scalars['Int'];
  productions?: Maybe<Array<Production>>;
};

export type CategoryCreateInput = {
  name?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  /** Defaults to 0. */
  priority?: Scalars['Int'];
};

export type CategoryUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type ContactSubmission = {
  __typename?: 'ContactSubmission';
  additionalData?: Maybe<Scalars['JSON']>;
  assignees?: Maybe<Array<ContactSubmissionAssignee>>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  resolved: Scalars['Boolean'];
  timestamp: Scalars['DateTime'];
};

export type ContactSubmissionAssignee = {
  __typename?: 'ContactSubmissionAssignee';
  id: Scalars['ID'];
  submission: ContactSubmission;
  timestamp: Scalars['DateTime'];
  user: User;
};

export type ContactSubmissionAssigneeCreateInput = {
  submission: Scalars['ID'];
  user: Scalars['ID'];
};

export type ContactSubmissionCreateInput = {
  additionalData?: InputMaybe<Scalars['JSON']>;
  email: Scalars['String'];
  name: Scalars['String'];
};

export type ContactSubmissionUpdateInput = {
  additionalData?: InputMaybe<Scalars['JSON']>;
  resolved?: InputMaybe<Scalars['Boolean']>;
};

export type Credit = {
  __typename?: 'Credit';
  id: Scalars['ID'];
  person: Person;
  priority: Scalars['Int'];
  production: Production;
  title?: Maybe<Scalars['String']>;
};

export type CreditCreateInput = {
  person: Scalars['ID'];
  /** Defaults to 0. */
  priority?: Scalars['Int'];
  production: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export type CreditUpdateInput = {
  person?: InputMaybe<Scalars['ID']>;
  priority?: InputMaybe<Scalars['Int']>;
  production?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Group = {
  __typename?: 'Group';
  children?: Maybe<Array<Group>>;
  id: Scalars['ID'];
  name: Scalars['String'];
  parent?: Maybe<Group>;
  permissions?: Maybe<Array<GroupPermission>>;
  priority: Scalars['Int'];
  users?: Maybe<Array<UserGroup>>;
};

export type GroupCreateInput = {
  name: Scalars['String'];
  parent?: InputMaybe<Scalars['ID']>;
  /** Defaults to 0. */
  priority?: Scalars['Int'];
};

export type GroupPermission = {
  __typename?: 'GroupPermission';
  action: Scalars['String'];
  conditions?: Maybe<Scalars['JSON']>;
  fields?: Maybe<Array<Scalars['String']>>;
  group: Group;
  id: Scalars['ID'];
  inverted: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
};

export type GroupPermissionCreateInput = {
  action: Scalars['String'];
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
  user: Scalars['ID'];
};

export type GroupPermissionUpdateInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
};

export type GroupUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
  parent?: InputMaybe<Scalars['ID']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type Image = {
  __typename?: 'Image';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageFor?: Maybe<Array<ProductionImage>>;
  name: Scalars['String'];
  path: Scalars['String'];
  people?: Maybe<Array<PersonImage>>;
  thumbnailFor?: Maybe<Array<Production>>;
};

export type ImageCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  path: Scalars['String'];
};

export type ImageUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new AlertLog with the given input values. */
  createAlertLog: AlertLog;
  /** Create a new Asset with the given input values. */
  createAsset: Asset;
  /** Create a new User with the given input values. */
  createUser: User;
  /** Create a new user-group pair with the given input values. */
  createUserGroup: UserGroup;
  /** Create a new UserPermission with the given input values. The User creating the Permission must also have the Permission that's being created. */
  createUserPermission: UserPermission;
  /** Delete the Asset with the provided ID, if it exists. Returns null if the Asset does not exist, otherwise returns the deleted object. */
  deleteAsset?: Maybe<Asset>;
  /** Delete the User with the provided ID, if it exists. Returns null if the User does not exist, otherwise returns the deleted object. */
  deleteUser?: Maybe<User>;
  /** Delete the UserGroup with the provided ID, if it exists. Returns null if the UserGroup does not exist, otherwise returns the deleted object. */
  deleteUserGroup?: Maybe<UserGroup>;
  /** Delete the UserPermission with the provided ID, if it exists. Returns null if the UserPermission does not exist, otherwise returns the deleted object. */
  deleteUserPermission?: Maybe<UserPermission>;
  /** Update the Asset with the provided ID to have the passed values. Throws an error if Asset with ID does not exist. */
  updateAsset: Asset;
  /** Update the User with the provided ID to have the passed values. Throws an error if User with ID does not exist. */
  updateUser: User;
  /** Update the UserPermission with the provided ID to have the passed values. Throws an error if UserPermission with ID does not exist. The User updating the Permission must also have the Permission that's being update to and from.. */
  updateUserPermission: UserPermission;
};


export type MutationCreateAlertLogArgs = {
  input: AlertLogCreateInput;
};


export type MutationCreateAssetArgs = {
  input: AssetCreateInput;
};


export type MutationCreateUserArgs = {
  input: UserCreateInput;
};


export type MutationCreateUserGroupArgs = {
  input: UserGroupCreateInput;
};


export type MutationCreateUserPermissionArgs = {
  input: UserPermissionCreateInput;
};


export type MutationDeleteAssetArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserGroupArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserPermissionArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAssetArgs = {
  id: Scalars['ID'];
  input: AssetUpdateInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  input: UserUpdateInput;
};


export type MutationUpdateUserPermissionArgs = {
  id: Scalars['ID'];
  input: UserPermissionUpdateInput;
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
  name: Scalars['String'];
  pronouns?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<Role>>;
  start: Scalars['DateTime'];
  users?: Maybe<Array<User>>;
};

export type PersonCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  graduation?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  pronouns?: InputMaybe<Scalars['String']>;
  /** Defaults to now. */
  start?: InputMaybe<Scalars['DateTime']>;
};

export type PersonImage = {
  __typename?: 'PersonImage';
  id: Scalars['ID'];
  image: Image;
  person: Person;
  priority: Scalars['Int'];
};

export type PersonImageCreateInput = {
  image: Scalars['ID'];
  person: Scalars['ID'];
  /** Defaults to 0. */
  priority?: Scalars['Int'];
};

export type PersonImageUpdateInput = {
  priority?: InputMaybe<Scalars['Int']>;
};

export type PersonUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  end?: InputMaybe<Scalars['DateTime']>;
  graduation?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  pronouns?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['DateTime']>;
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
  isLive: Scalars['Boolean'];
  name: Scalars['String'];
  rsvps?: Maybe<Array<ProductionRsvp>>;
  startTime?: Maybe<Scalars['DateTime']>;
  tags?: Maybe<Array<ProductionTag>>;
  teamNotes?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Image>;
  videos?: Maybe<Array<ProductionVideo>>;
};

export type ProductionCreateInput = {
  category?: InputMaybe<Scalars['ID']>;
  closetLocation?: InputMaybe<Scalars['String']>;
  closetTime?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  discordChannel?: InputMaybe<Scalars['String']>;
  discordServer?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['DateTime']>;
  eventLocation?: InputMaybe<Scalars['String']>;
  /** Defaults to false. */
  isLive?: Scalars['Boolean'];
  name: Scalars['String'];
  startTime?: InputMaybe<Scalars['DateTime']>;
  teamNotes?: InputMaybe<Scalars['String']>;
  thumbnail?: InputMaybe<Scalars['ID']>;
};

export type ProductionImage = {
  __typename?: 'ProductionImage';
  id: Scalars['ID'];
  image: Image;
  priority: Scalars['Int'];
  production: Production;
};

export type ProductionImageCreateInput = {
  image: Scalars['ID'];
  /** Defaults to 0. */
  priority?: Scalars['Int'];
  production: Scalars['ID'];
};

export type ProductionImageUpdateInput = {
  priority?: InputMaybe<Scalars['Int']>;
};

export type ProductionRsvp = {
  __typename?: 'ProductionRSVP';
  id: Scalars['ID'];
  notes?: Maybe<Scalars['String']>;
  production: Production;
  user: User;
  willAttend?: Maybe<Scalars['String']>;
};

export type ProductionRsvpCreateInput = {
  notes?: InputMaybe<Scalars['String']>;
  production: Scalars['ID'];
  user: Scalars['ID'];
  willAttend?: InputMaybe<Scalars['String']>;
};

export type ProductionRsvpUpdateInput = {
  notes?: InputMaybe<Scalars['String']>;
  willAttend?: InputMaybe<Scalars['String']>;
};

export type ProductionTag = {
  __typename?: 'ProductionTag';
  id: Scalars['ID'];
  production: Production;
  tag: Scalars['String'];
};

export type ProductionTagCreateInput = {
  production: Scalars['ID'];
  tag: Scalars['String'];
};

export type ProductionUpdateInput = {
  category?: InputMaybe<Scalars['ID']>;
  closetLocation?: InputMaybe<Scalars['String']>;
  closetTime?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  discordChannel?: InputMaybe<Scalars['String']>;
  discordServer?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['DateTime']>;
  eventLocation?: InputMaybe<Scalars['String']>;
  isLive?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  teamNotes?: InputMaybe<Scalars['String']>;
  thumbnail?: InputMaybe<Scalars['ID']>;
};

export type ProductionVideo = {
  __typename?: 'ProductionVideo';
  id: Scalars['ID'];
  priority: Scalars['Int'];
  production: Production;
  video: Video;
};

export type ProductionVideoCreateInput = {
  priority?: Scalars['Int'];
  production: Scalars['ID'];
  video: Scalars['ID'];
};

export type ProductionVideoUpdateInput = {
  priority?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  /** Get a single access log, given its ID, or null if that access log does not exist. */
  accessLog?: Maybe<AccessLog>;
  /** Get a list of access logs which the user currently has access to read. */
  accessLogs: Array<AccessLog>;
  /** Get a single alert log, given its ID, or null if that alert log does not exist. */
  alertLog?: Maybe<AlertLog>;
  /** Get a list of alert logs which the user currently has access to read. */
  alertLogs: Array<AlertLog>;
  /** Get a single asset, given its ID, or null if that asset does not exist. */
  asset?: Maybe<Asset>;
  /** Get a list of assets which the user currently has access to read. */
  assets: Array<Asset>;
  /** Get a single audit log, given its ID, or null if that audit log does not exist. */
  auditLog?: Maybe<AuditLog>;
  /** Get a list of audit logs which the user currently has access to read. */
  auditLogs: Array<AuditLog>;
  /** Get a single blog post, given its ID, or null if that blog post does not exist. */
  blogPost?: Maybe<BlogPost>;
  /** Get a list of blog posts which the user currently has access to read. */
  blogPosts: Array<BlogPost>;
  /** Get a list of categories which the user currently has access to read. */
  categories: Array<Category>;
  /** Get a single category, given its ID, or null if that category does not exist. */
  category?: Maybe<Category>;
  /** Get a single contact submission, given its ID, or null if that contact submission does not exist. */
  contactSubmission?: Maybe<ContactSubmission>;
  /** Get a single contact submission assignee, given its ID, or null if that contact submission assignee does not exist. */
  contactSubmissionAssignee?: Maybe<ContactSubmissionAssignee>;
  /** Get a list of contact submission assignees which the user currently has access to read. */
  contactSubmissionAssignees: Array<ContactSubmissionAssignee>;
  /** Get a list of contact submissions which the user currently has access to read. */
  contactSubmissions: Array<ContactSubmission>;
  /** Get a single credit, given its ID, or null if that credit does not exist. */
  credit?: Maybe<Credit>;
  /** Get a list of credits which the user currently has access to read. */
  credits: Array<Credit>;
  /** Get a single group, given its ID, or null if that group does not exist. */
  group?: Maybe<Group>;
  /** Get a single group permission, given its ID, or null if that group permission does not exist. */
  groupPermission?: Maybe<GroupPermission>;
  /** Get a list of groups which the user currently has access to read. */
  groups: Array<Group>;
  /** Get a single image, given its ID, or null if that image does not exist. */
  image?: Maybe<Image>;
  /** Get a list of images which the user currently has access to read. */
  images: Array<Image>;
  /** Get a list of people which the user currently has access to read. */
  people: Array<Person>;
  /** Get a single person, given its ID, or null if that person does not exist. */
  person?: Maybe<Person>;
  /** Get a single person-image pair, given its ID, or null if that person-image pair does not exist. */
  personImage?: Maybe<PersonImage>;
  /** Get a list of person-image pairs which the user currently has access to read. */
  personImages: Array<PersonImage>;
  /** Get a single production, given its ID, or null if that production does not exist. */
  production?: Maybe<Production>;
  /** Get a single production-image pair, given its ID, or null if that production-image pair does not exist. */
  productionImage?: Maybe<ProductionImage>;
  /** Get a list of production-image pairs which the user currently has access to read. */
  productionImages: Array<ProductionImage>;
  /** Get a single production RSVP, given its ID, or null if that production RSVP does not exist. */
  productionRSVP?: Maybe<ProductionRsvp>;
  /** Get a list of production RSVPs which the user currently has access to read. */
  productionRSVPs: Array<ProductionRsvp>;
  /** Get a single production tag, given its ID, or null if that production tag does not exist. */
  productionTag?: Maybe<ProductionTag>;
  /** Get a single production-video pair, given its ID, or null if that production-video pair does not exist. */
  productionVideo?: Maybe<ProductionVideo>;
  /** Get a list of production-video pairs which the user currently has access to read. */
  productionVideos: Array<ProductionVideo>;
  /** Get a list of productions which the user currently has access to read. */
  productions: Array<Production>;
  /** Get a single production, given its ID, or null if that redirect does not exist. */
  redirect?: Maybe<Redirect>;
  /** Get a list of redirects which the user currently has access to read. */
  redirects: Array<Redirect>;
  /** Get a single role, given its ID, or null if that role does not exist. */
  role?: Maybe<Role>;
  /** Get a list of roles which the user currently has access to read. */
  roles: Array<Role>;
  /** Get a single user given their ID, or null if that user does not exist. */
  user?: Maybe<User>;
  /** Get a single user-group pair, given its ID, or null if that user-group pair does not exist. */
  userGroup?: Maybe<UserGroup>;
  /** Get a single user permission, given its ID, or null if that user permission does not exist. */
  userPermission?: Maybe<UserPermission>;
  /** Get a list of users which the user currently has access to read. */
  users: Array<User>;
  /** Get a single video, given its ID, or null if that video does not exist. */
  video?: Maybe<Video>;
  /** Get a list of videos which the user currently has access to read. */
  videos: Array<Video>;
  /** Get a single vote, given its ID, or null if that vote does not exist. */
  vote?: Maybe<Vote>;
  /** Get a single vote response, given its ID, or null if that vote response does not exist. */
  voteResponse?: Maybe<VoteResponse>;
  /** Get a list of votes which the user currently has access to read. */
  votes: Array<Vote>;
};


export type QueryAccessLogArgs = {
  id: Scalars['ID'];
};


export type QueryAccessLogsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryAlertLogArgs = {
  id: Scalars['ID'];
};


export type QueryAlertLogsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryAssetArgs = {
  id: Scalars['ID'];
};


export type QueryAssetsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryAuditLogArgs = {
  id: Scalars['ID'];
};


export type QueryAuditLogsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryBlogPostArgs = {
  id: Scalars['ID'];
};


export type QueryBlogPostsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryCategoriesArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryContactSubmissionArgs = {
  id: Scalars['ID'];
};


export type QueryContactSubmissionAssigneeArgs = {
  id: Scalars['ID'];
};


export type QueryContactSubmissionAssigneesArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryContactSubmissionsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryCreditArgs = {
  id: Scalars['ID'];
};


export type QueryCreditsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryGroupArgs = {
  id: Scalars['ID'];
};


export type QueryGroupPermissionArgs = {
  id: Scalars['ID'];
};


export type QueryGroupsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryImageArgs = {
  id: Scalars['ID'];
};


export type QueryImagesArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryPeopleArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryPersonArgs = {
  id: Scalars['ID'];
};


export type QueryPersonImageArgs = {
  id: Scalars['ID'];
};


export type QueryPersonImagesArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryProductionArgs = {
  id: Scalars['ID'];
};


export type QueryProductionImageArgs = {
  id: Scalars['ID'];
};


export type QueryProductionImagesArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryProductionRsvpArgs = {
  id: Scalars['ID'];
};


export type QueryProductionRsvPsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryProductionTagArgs = {
  id: Scalars['ID'];
};


export type QueryProductionVideoArgs = {
  id: Scalars['ID'];
};


export type QueryProductionVideosArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryProductionsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryRedirectArgs = {
  id: Scalars['ID'];
};


export type QueryRedirectsArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryRoleArgs = {
  id: Scalars['ID'];
};


export type QueryRolesArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUserGroupArgs = {
  id: Scalars['ID'];
};


export type QueryUserPermissionArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryVideoArgs = {
  id: Scalars['ID'];
};


export type QueryVideosArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryVoteArgs = {
  id: Scalars['ID'];
};


export type QueryVoteResponseArgs = {
  id: Scalars['ID'];
};


export type QueryVotesArgs = {
  pagination?: InputMaybe<Pagination>;
};

export type Redirect = {
  __typename?: 'Redirect';
  expires?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  key: Scalars['String'];
  location: Scalars['String'];
};

export type RedirectCreateInput = {
  expires?: InputMaybe<Scalars['DateTime']>;
  key: Scalars['String'];
  location: Scalars['String'];
};

export type RedirectUpdateInput = {
  expires?: InputMaybe<Scalars['DateTime']>;
  key?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
};

export type Role = {
  __typename?: 'Role';
  endTime?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  person: Person;
  priority: Scalars['Int'];
  startTime: Scalars['DateTime'];
};

export type RoleCreateInput = {
  endTime?: InputMaybe<Scalars['DateTime']>;
  name: Scalars['String'];
  person: Scalars['ID'];
  /** Defaults to 0. */
  priority?: Scalars['Int'];
  startTime?: InputMaybe<Scalars['DateTime']>;
};

export type RoleUpdateInput = {
  endTime?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  person?: InputMaybe<Scalars['ID']>;
  priority?: InputMaybe<Scalars['Int']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
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
  joined: Scalars['DateTime'];
  mail: Scalars['String'];
  permissions?: Maybe<Array<UserPermission>>;
  person?: Maybe<Person>;
  productionRsvps?: Maybe<Array<ProductionRsvp>>;
  username: Scalars['String'];
  voteResponses?: Maybe<Array<VoteResponse>>;
};

export type UserCreateInput = {
  discord?: InputMaybe<Scalars['String']>;
  mail: Scalars['String'];
  password?: InputMaybe<Scalars['String']>;
  person?: InputMaybe<Scalars['ID']>;
  username: Scalars['String'];
};

export type UserGroup = {
  __typename?: 'UserGroup';
  group: Group;
  id: Scalars['ID'];
  user: User;
};

export type UserGroupCreateInput = {
  group: Scalars['ID'];
  user: Scalars['ID'];
};

export type UserPermission = {
  __typename?: 'UserPermission';
  action: Scalars['String'];
  conditions?: Maybe<Scalars['JSON']>;
  fields?: Maybe<Array<Scalars['String']>>;
  id: Scalars['ID'];
  inverted: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
  user: User;
};

export type UserPermissionCreateInput = {
  action: Scalars['String'];
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
  user: Scalars['ID'];
};

export type UserPermissionUpdateInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
};

export type UserUpdateInput = {
  discord?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  person?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export type Video = {
  __typename?: 'Video';
  format: Scalars['String'];
  id: Scalars['ID'];
  metadata?: Maybe<Scalars['JSON']>;
  name: Scalars['String'];
  videoFor?: Maybe<Array<ProductionVideo>>;
};

export type VideoCreateInput = {
  format: Scalars['String'];
  metadata?: InputMaybe<Scalars['JSON']>;
  name: Scalars['String'];
};

export type VideoUpdateInput = {
  format?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['JSON']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Vote = {
  __typename?: 'Vote';
  description?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  options: Array<Scalars['String']>;
  question: Scalars['String'];
  responses?: Maybe<Array<VoteResponse>>;
};

export type VoteCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  expires?: InputMaybe<Scalars['DateTime']>;
  options: Array<Scalars['String']>;
  question: Scalars['String'];
};

export type VoteResponse = {
  __typename?: 'VoteResponse';
  id: Scalars['ID'];
  selection: Scalars['String'];
  timestamp: Scalars['DateTime'];
  user: User;
  vote: Vote;
};

export type VoteResponseCreateInput = {
  selection: Scalars['String'];
  user: Scalars['ID'];
  vote: Scalars['ID'];
};

export type VoteResponseUpdateInput = {
  selection?: InputMaybe<Scalars['String']>;
};

export type VoteUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  expires?: InputMaybe<Scalars['DateTime']>;
  options?: InputMaybe<Array<Scalars['String']>>;
  question?: InputMaybe<Scalars['String']>;
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
  AlertLogCreateInput: AlertLogCreateInput;
  Asset: ResolverTypeWrapper<AssetModel>;
  AssetCreateInput: AssetCreateInput;
  AssetUpdateInput: AssetUpdateInput;
  AuditLog: ResolverTypeWrapper<AuditLogModel>;
  BlogPost: ResolverTypeWrapper<BlogPostModel>;
  BlogPostCreateInput: BlogPostCreateInput;
  BlogPostUpdateInput: BlogPostUpdateInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Category: ResolverTypeWrapper<CategoryModel>;
  CategoryCreateInput: CategoryCreateInput;
  CategoryUpdateInput: CategoryUpdateInput;
  ContactSubmission: ResolverTypeWrapper<ContactSubmissionModel>;
  ContactSubmissionAssignee: ResolverTypeWrapper<ContactSubmissionAssigneeModel>;
  ContactSubmissionAssigneeCreateInput: ContactSubmissionAssigneeCreateInput;
  ContactSubmissionCreateInput: ContactSubmissionCreateInput;
  ContactSubmissionUpdateInput: ContactSubmissionUpdateInput;
  Credit: ResolverTypeWrapper<CreditModel>;
  CreditCreateInput: CreditCreateInput;
  CreditUpdateInput: CreditUpdateInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Group: ResolverTypeWrapper<GroupModel>;
  GroupCreateInput: GroupCreateInput;
  GroupPermission: ResolverTypeWrapper<GroupPermissionModel>;
  GroupPermissionCreateInput: GroupPermissionCreateInput;
  GroupPermissionUpdateInput: GroupPermissionUpdateInput;
  GroupUpdateInput: GroupUpdateInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Image: ResolverTypeWrapper<ImageModel>;
  ImageCreateInput: ImageCreateInput;
  ImageUpdateInput: ImageUpdateInput;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Mutation: ResolverTypeWrapper<{}>;
  Pagination: Pagination;
  Person: ResolverTypeWrapper<PersonModel>;
  PersonCreateInput: PersonCreateInput;
  PersonImage: ResolverTypeWrapper<PersonImageModel>;
  PersonImageCreateInput: PersonImageCreateInput;
  PersonImageUpdateInput: PersonImageUpdateInput;
  PersonUpdateInput: PersonUpdateInput;
  Production: ResolverTypeWrapper<ProductionModel>;
  ProductionCreateInput: ProductionCreateInput;
  ProductionImage: ResolverTypeWrapper<ProductionImageModel>;
  ProductionImageCreateInput: ProductionImageCreateInput;
  ProductionImageUpdateInput: ProductionImageUpdateInput;
  ProductionRSVP: ResolverTypeWrapper<ProductionRSVPModel>;
  ProductionRSVPCreateInput: ProductionRsvpCreateInput;
  ProductionRSVPUpdateInput: ProductionRsvpUpdateInput;
  ProductionTag: ResolverTypeWrapper<ProductionTagModel>;
  ProductionTagCreateInput: ProductionTagCreateInput;
  ProductionUpdateInput: ProductionUpdateInput;
  ProductionVideo: ResolverTypeWrapper<Omit<ProductionVideo, 'production' | 'video'> & { production: ResolversTypes['Production'], video: ResolversTypes['Video'] }>;
  ProductionVideoCreateInput: ProductionVideoCreateInput;
  ProductionVideoUpdateInput: ProductionVideoUpdateInput;
  Query: ResolverTypeWrapper<{}>;
  Redirect: ResolverTypeWrapper<RedirectModel>;
  RedirectCreateInput: RedirectCreateInput;
  RedirectUpdateInput: RedirectUpdateInput;
  Role: ResolverTypeWrapper<RoleModel>;
  RoleCreateInput: RoleCreateInput;
  RoleUpdateInput: RoleUpdateInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  User: ResolverTypeWrapper<UserModel>;
  UserCreateInput: UserCreateInput;
  UserGroup: ResolverTypeWrapper<UserGroupModel>;
  UserGroupCreateInput: UserGroupCreateInput;
  UserPermission: ResolverTypeWrapper<UserPermissionModel>;
  UserPermissionCreateInput: UserPermissionCreateInput;
  UserPermissionUpdateInput: UserPermissionUpdateInput;
  UserUpdateInput: UserUpdateInput;
  Video: ResolverTypeWrapper<VideoModel>;
  VideoCreateInput: VideoCreateInput;
  VideoUpdateInput: VideoUpdateInput;
  Vote: ResolverTypeWrapper<VoteModel>;
  VoteCreateInput: VoteCreateInput;
  VoteResponse: ResolverTypeWrapper<VoteResponseModel>;
  VoteResponseCreateInput: VoteResponseCreateInput;
  VoteResponseUpdateInput: VoteResponseUpdateInput;
  VoteUpdateInput: VoteUpdateInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AccessLog: AccessLogModel;
  AlertLog: AlertLogModel;
  AlertLogCreateInput: AlertLogCreateInput;
  Asset: AssetModel;
  AssetCreateInput: AssetCreateInput;
  AssetUpdateInput: AssetUpdateInput;
  AuditLog: AuditLogModel;
  BlogPost: BlogPostModel;
  BlogPostCreateInput: BlogPostCreateInput;
  BlogPostUpdateInput: BlogPostUpdateInput;
  Boolean: Scalars['Boolean'];
  Category: CategoryModel;
  CategoryCreateInput: CategoryCreateInput;
  CategoryUpdateInput: CategoryUpdateInput;
  ContactSubmission: ContactSubmissionModel;
  ContactSubmissionAssignee: ContactSubmissionAssigneeModel;
  ContactSubmissionAssigneeCreateInput: ContactSubmissionAssigneeCreateInput;
  ContactSubmissionCreateInput: ContactSubmissionCreateInput;
  ContactSubmissionUpdateInput: ContactSubmissionUpdateInput;
  Credit: CreditModel;
  CreditCreateInput: CreditCreateInput;
  CreditUpdateInput: CreditUpdateInput;
  DateTime: Scalars['DateTime'];
  Group: GroupModel;
  GroupCreateInput: GroupCreateInput;
  GroupPermission: GroupPermissionModel;
  GroupPermissionCreateInput: GroupPermissionCreateInput;
  GroupPermissionUpdateInput: GroupPermissionUpdateInput;
  GroupUpdateInput: GroupUpdateInput;
  ID: Scalars['ID'];
  Image: ImageModel;
  ImageCreateInput: ImageCreateInput;
  ImageUpdateInput: ImageUpdateInput;
  Int: Scalars['Int'];
  JSON: Scalars['JSON'];
  Mutation: {};
  Pagination: Pagination;
  Person: PersonModel;
  PersonCreateInput: PersonCreateInput;
  PersonImage: PersonImageModel;
  PersonImageCreateInput: PersonImageCreateInput;
  PersonImageUpdateInput: PersonImageUpdateInput;
  PersonUpdateInput: PersonUpdateInput;
  Production: ProductionModel;
  ProductionCreateInput: ProductionCreateInput;
  ProductionImage: ProductionImageModel;
  ProductionImageCreateInput: ProductionImageCreateInput;
  ProductionImageUpdateInput: ProductionImageUpdateInput;
  ProductionRSVP: ProductionRSVPModel;
  ProductionRSVPCreateInput: ProductionRsvpCreateInput;
  ProductionRSVPUpdateInput: ProductionRsvpUpdateInput;
  ProductionTag: ProductionTagModel;
  ProductionTagCreateInput: ProductionTagCreateInput;
  ProductionUpdateInput: ProductionUpdateInput;
  ProductionVideo: Omit<ProductionVideo, 'production' | 'video'> & { production: ResolversParentTypes['Production'], video: ResolversParentTypes['Video'] };
  ProductionVideoCreateInput: ProductionVideoCreateInput;
  ProductionVideoUpdateInput: ProductionVideoUpdateInput;
  Query: {};
  Redirect: RedirectModel;
  RedirectCreateInput: RedirectCreateInput;
  RedirectUpdateInput: RedirectUpdateInput;
  Role: RoleModel;
  RoleCreateInput: RoleCreateInput;
  RoleUpdateInput: RoleUpdateInput;
  String: Scalars['String'];
  Upload: Scalars['Upload'];
  User: UserModel;
  UserCreateInput: UserCreateInput;
  UserGroup: UserGroupModel;
  UserGroupCreateInput: UserGroupCreateInput;
  UserPermission: UserPermissionModel;
  UserPermissionCreateInput: UserPermissionCreateInput;
  UserPermissionUpdateInput: UserPermissionUpdateInput;
  UserUpdateInput: UserUpdateInput;
  Video: VideoModel;
  VideoCreateInput: VideoCreateInput;
  VideoUpdateInput: VideoUpdateInput;
  Vote: VoteModel;
  VoteCreateInput: VoteCreateInput;
  VoteResponse: VoteResponseModel;
  VoteResponseCreateInput: VoteResponseCreateInput;
  VoteResponseUpdateInput: VoteResponseUpdateInput;
  VoteUpdateInput: VoteUpdateInput;
};

export type AuthDirectiveArgs = {
  action: Scalars['String'];
  subject: Scalars['String'];
};

export type AuthDirectiveResolver<Result, Parent, ContextType = any, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type NonNullDirectiveArgs = { };

export type NonNullDirectiveResolver<Result, Parent, ContextType = any, Args = NonNullDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccessLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['AccessLog'] = ResolversParentTypes['AccessLog']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ip?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  service?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AlertLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['AlertLog'] = ResolversParentTypes['AlertLog']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  severity?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AssetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Asset'] = ResolversParentTypes['Asset']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['Asset']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isLost?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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
  modificationType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  modifiedField?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  modifiedTable?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  previousValue?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlogPostResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlogPost'] = ResolversParentTypes['BlogPost']> = {
  author?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  authorDisplayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  postedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  productions?: Resolver<Maybe<Array<ResolversTypes['Production']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactSubmissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactSubmission'] = ResolversParentTypes['ContactSubmission']> = {
  additionalData?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  assignees?: Resolver<Maybe<Array<ResolversTypes['ContactSubmissionAssignee']>>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  resolved?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContactSubmissionAssigneeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContactSubmissionAssignee'] = ResolversParentTypes['ContactSubmissionAssignee']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  submission?: Resolver<ResolversTypes['ContactSubmission'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreditResolvers<ContextType = any, ParentType extends ResolversParentTypes['Credit'] = ResolversParentTypes['Credit']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  production?: Resolver<ResolversTypes['Production'], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type GroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['Group']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
  permissions?: Resolver<Maybe<Array<ResolversTypes['GroupPermission']>>, ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  users?: Resolver<Maybe<Array<ResolversTypes['UserGroup']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GroupPermissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['GroupPermission'] = ResolversParentTypes['GroupPermission']> = {
  action?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conditions?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  fields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inverted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subject?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Image'] = ResolversParentTypes['Image']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageFor?: Resolver<Maybe<Array<ResolversTypes['ProductionImage']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  people?: Resolver<Maybe<Array<ResolversTypes['PersonImage']>>, ParentType, ContextType>;
  thumbnailFor?: Resolver<Maybe<Array<ResolversTypes['Production']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface JsonScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAlertLog?: Resolver<ResolversTypes['AlertLog'], ParentType, ContextType, RequireFields<MutationCreateAlertLogArgs, 'input'>>;
  createAsset?: Resolver<ResolversTypes['Asset'], ParentType, ContextType, RequireFields<MutationCreateAssetArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  createUserGroup?: Resolver<ResolversTypes['UserGroup'], ParentType, ContextType, RequireFields<MutationCreateUserGroupArgs, 'input'>>;
  createUserPermission?: Resolver<ResolversTypes['UserPermission'], ParentType, ContextType, RequireFields<MutationCreateUserPermissionArgs, 'input'>>;
  deleteAsset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<MutationDeleteAssetArgs, 'id'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  deleteUserGroup?: Resolver<Maybe<ResolversTypes['UserGroup']>, ParentType, ContextType, RequireFields<MutationDeleteUserGroupArgs, 'id'>>;
  deleteUserPermission?: Resolver<Maybe<ResolversTypes['UserPermission']>, ParentType, ContextType, RequireFields<MutationDeleteUserPermissionArgs, 'id'>>;
  updateAsset?: Resolver<ResolversTypes['Asset'], ParentType, ContextType, RequireFields<MutationUpdateAssetArgs, 'id' | 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id' | 'input'>>;
  updateUserPermission?: Resolver<ResolversTypes['UserPermission'], ParentType, ContextType, RequireFields<MutationUpdateUserPermissionArgs, 'id' | 'input'>>;
};

export type PersonResolvers<ContextType = any, ParentType extends ResolversParentTypes['Person'] = ResolversParentTypes['Person']> = {
  blogPosts?: Resolver<Maybe<Array<ResolversTypes['BlogPost']>>, ParentType, ContextType>;
  credits?: Resolver<Maybe<Array<ResolversTypes['Credit']>>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  graduation?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  images?: Resolver<Maybe<Array<ResolversTypes['PersonImage']>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pronouns?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  roles?: Resolver<Maybe<Array<ResolversTypes['Role']>>, ParentType, ContextType>;
  start?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  users?: Resolver<Maybe<Array<ResolversTypes['User']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PersonImageResolvers<ContextType = any, ParentType extends ResolversParentTypes['PersonImage'] = ResolversParentTypes['PersonImage']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<ResolversTypes['Image'], ParentType, ContextType>;
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
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
  isLive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  image?: Resolver<ResolversTypes['Image'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  production?: Resolver<ResolversTypes['Production'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductionRsvpResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductionRSVP'] = ResolversParentTypes['ProductionRSVP']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  production?: Resolver<ResolversTypes['Production'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  willAttend?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductionTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductionTag'] = ResolversParentTypes['ProductionTag']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  production?: Resolver<ResolversTypes['Production'], ParentType, ContextType>;
  tag?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductionVideoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductionVideo'] = ResolversParentTypes['ProductionVideo']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  production?: Resolver<ResolversTypes['Production'], ParentType, ContextType>;
  video?: Resolver<ResolversTypes['Video'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  accessLog?: Resolver<Maybe<ResolversTypes['AccessLog']>, ParentType, ContextType, RequireFields<QueryAccessLogArgs, 'id'>>;
  accessLogs?: Resolver<Array<ResolversTypes['AccessLog']>, ParentType, ContextType, Partial<QueryAccessLogsArgs>>;
  alertLog?: Resolver<Maybe<ResolversTypes['AlertLog']>, ParentType, ContextType, RequireFields<QueryAlertLogArgs, 'id'>>;
  alertLogs?: Resolver<Array<ResolversTypes['AlertLog']>, ParentType, ContextType, Partial<QueryAlertLogsArgs>>;
  asset?: Resolver<Maybe<ResolversTypes['Asset']>, ParentType, ContextType, RequireFields<QueryAssetArgs, 'id'>>;
  assets?: Resolver<Array<ResolversTypes['Asset']>, ParentType, ContextType, Partial<QueryAssetsArgs>>;
  auditLog?: Resolver<Maybe<ResolversTypes['AuditLog']>, ParentType, ContextType, RequireFields<QueryAuditLogArgs, 'id'>>;
  auditLogs?: Resolver<Array<ResolversTypes['AuditLog']>, ParentType, ContextType, Partial<QueryAuditLogsArgs>>;
  blogPost?: Resolver<Maybe<ResolversTypes['BlogPost']>, ParentType, ContextType, RequireFields<QueryBlogPostArgs, 'id'>>;
  blogPosts?: Resolver<Array<ResolversTypes['BlogPost']>, ParentType, ContextType, Partial<QueryBlogPostsArgs>>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, Partial<QueryCategoriesArgs>>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  contactSubmission?: Resolver<Maybe<ResolversTypes['ContactSubmission']>, ParentType, ContextType, RequireFields<QueryContactSubmissionArgs, 'id'>>;
  contactSubmissionAssignee?: Resolver<Maybe<ResolversTypes['ContactSubmissionAssignee']>, ParentType, ContextType, RequireFields<QueryContactSubmissionAssigneeArgs, 'id'>>;
  contactSubmissionAssignees?: Resolver<Array<ResolversTypes['ContactSubmissionAssignee']>, ParentType, ContextType, Partial<QueryContactSubmissionAssigneesArgs>>;
  contactSubmissions?: Resolver<Array<ResolversTypes['ContactSubmission']>, ParentType, ContextType, Partial<QueryContactSubmissionsArgs>>;
  credit?: Resolver<Maybe<ResolversTypes['Credit']>, ParentType, ContextType, RequireFields<QueryCreditArgs, 'id'>>;
  credits?: Resolver<Array<ResolversTypes['Credit']>, ParentType, ContextType, Partial<QueryCreditsArgs>>;
  group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<QueryGroupArgs, 'id'>>;
  groupPermission?: Resolver<Maybe<ResolversTypes['GroupPermission']>, ParentType, ContextType, RequireFields<QueryGroupPermissionArgs, 'id'>>;
  groups?: Resolver<Array<ResolversTypes['Group']>, ParentType, ContextType, Partial<QueryGroupsArgs>>;
  image?: Resolver<Maybe<ResolversTypes['Image']>, ParentType, ContextType, RequireFields<QueryImageArgs, 'id'>>;
  images?: Resolver<Array<ResolversTypes['Image']>, ParentType, ContextType, Partial<QueryImagesArgs>>;
  people?: Resolver<Array<ResolversTypes['Person']>, ParentType, ContextType, Partial<QueryPeopleArgs>>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType, RequireFields<QueryPersonArgs, 'id'>>;
  personImage?: Resolver<Maybe<ResolversTypes['PersonImage']>, ParentType, ContextType, RequireFields<QueryPersonImageArgs, 'id'>>;
  personImages?: Resolver<Array<ResolversTypes['PersonImage']>, ParentType, ContextType, Partial<QueryPersonImagesArgs>>;
  production?: Resolver<Maybe<ResolversTypes['Production']>, ParentType, ContextType, RequireFields<QueryProductionArgs, 'id'>>;
  productionImage?: Resolver<Maybe<ResolversTypes['ProductionImage']>, ParentType, ContextType, RequireFields<QueryProductionImageArgs, 'id'>>;
  productionImages?: Resolver<Array<ResolversTypes['ProductionImage']>, ParentType, ContextType, Partial<QueryProductionImagesArgs>>;
  productionRSVP?: Resolver<Maybe<ResolversTypes['ProductionRSVP']>, ParentType, ContextType, RequireFields<QueryProductionRsvpArgs, 'id'>>;
  productionRSVPs?: Resolver<Array<ResolversTypes['ProductionRSVP']>, ParentType, ContextType, Partial<QueryProductionRsvPsArgs>>;
  productionTag?: Resolver<Maybe<ResolversTypes['ProductionTag']>, ParentType, ContextType, RequireFields<QueryProductionTagArgs, 'id'>>;
  productionVideo?: Resolver<Maybe<ResolversTypes['ProductionVideo']>, ParentType, ContextType, RequireFields<QueryProductionVideoArgs, 'id'>>;
  productionVideos?: Resolver<Array<ResolversTypes['ProductionVideo']>, ParentType, ContextType, Partial<QueryProductionVideosArgs>>;
  productions?: Resolver<Array<ResolversTypes['Production']>, ParentType, ContextType, Partial<QueryProductionsArgs>>;
  redirect?: Resolver<Maybe<ResolversTypes['Redirect']>, ParentType, ContextType, RequireFields<QueryRedirectArgs, 'id'>>;
  redirects?: Resolver<Array<ResolversTypes['Redirect']>, ParentType, ContextType, Partial<QueryRedirectsArgs>>;
  role?: Resolver<Maybe<ResolversTypes['Role']>, ParentType, ContextType, RequireFields<QueryRoleArgs, 'id'>>;
  roles?: Resolver<Array<ResolversTypes['Role']>, ParentType, ContextType, Partial<QueryRolesArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  userGroup?: Resolver<Maybe<ResolversTypes['UserGroup']>, ParentType, ContextType, RequireFields<QueryUserGroupArgs, 'id'>>;
  userPermission?: Resolver<Maybe<ResolversTypes['UserPermission']>, ParentType, ContextType, RequireFields<QueryUserPermissionArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUsersArgs>>;
  video?: Resolver<Maybe<ResolversTypes['Video']>, ParentType, ContextType, RequireFields<QueryVideoArgs, 'id'>>;
  videos?: Resolver<Array<ResolversTypes['Video']>, ParentType, ContextType, Partial<QueryVideosArgs>>;
  vote?: Resolver<Maybe<ResolversTypes['Vote']>, ParentType, ContextType, RequireFields<QueryVoteArgs, 'id'>>;
  voteResponse?: Resolver<Maybe<ResolversTypes['VoteResponse']>, ParentType, ContextType, RequireFields<QueryVoteResponseArgs, 'id'>>;
  votes?: Resolver<Array<ResolversTypes['Vote']>, ParentType, ContextType, Partial<QueryVotesArgs>>;
};

export type RedirectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Redirect'] = ResolversParentTypes['Redirect']> = {
  expires?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RoleResolvers<ContextType = any, ParentType extends ResolversParentTypes['Role'] = ResolversParentTypes['Role']> = {
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  person?: Resolver<ResolversTypes['Person'], ParentType, ContextType>;
  priority?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  startTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
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
  joined?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  mail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<Maybe<Array<ResolversTypes['UserPermission']>>, ParentType, ContextType>;
  person?: Resolver<Maybe<ResolversTypes['Person']>, ParentType, ContextType>;
  productionRsvps?: Resolver<Maybe<Array<ResolversTypes['ProductionRSVP']>>, ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  voteResponses?: Resolver<Maybe<Array<ResolversTypes['VoteResponse']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserGroupResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserGroup'] = ResolversParentTypes['UserGroup']> = {
  group?: Resolver<ResolversTypes['Group'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPermissionResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPermission'] = ResolversParentTypes['UserPermission']> = {
  action?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conditions?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  fields?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  inverted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subject?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoResolvers<ContextType = any, ParentType extends ResolversParentTypes['Video'] = ResolversParentTypes['Video']> = {
  format?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  videoFor?: Resolver<Maybe<Array<ResolversTypes['ProductionVideo']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['Vote'] = ResolversParentTypes['Vote']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  expires?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  responses?: Resolver<Maybe<Array<ResolversTypes['VoteResponse']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VoteResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['VoteResponse'] = ResolversParentTypes['VoteResponse']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  selection?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  vote?: Resolver<ResolversTypes['Vote'], ParentType, ContextType>;
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
  Auth?: AuthDirectiveResolver<any, any, ContextType>;
  NonNull?: NonNullDirectiveResolver<any, any, ContextType>;
};
