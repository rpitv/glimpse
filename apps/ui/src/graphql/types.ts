import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: any;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: any;
};

export enum AbilitySubjects {
  AccessLog = 'AccessLog',
  AlertLog = 'AlertLog',
  Asset = 'Asset',
  AuditLog = 'AuditLog',
  BlogPost = 'BlogPost',
  Category = 'Category',
  ContactSubmission = 'ContactSubmission',
  Credit = 'Credit',
  Group = 'Group',
  GroupPermission = 'GroupPermission',
  Image = 'Image',
  Person = 'Person',
  PersonImage = 'PersonImage',
  PersonRole = 'PersonRole',
  Production = 'Production',
  ProductionImage = 'ProductionImage',
  ProductionRsvp = 'ProductionRSVP',
  ProductionTag = 'ProductionTag',
  ProductionVideo = 'ProductionVideo',
  Redirect = 'Redirect',
  Role = 'Role',
  Stream = 'Stream',
  User = 'User',
  UserGroup = 'UserGroup',
  UserPermission = 'UserPermission',
  Video = 'Video',
  Vote = 'Vote',
  VoteResponse = 'VoteResponse'
}

export type AccessLog = {
  __typename?: 'AccessLog';
  id?: Maybe<Scalars['BigInt']>;
  ip?: Maybe<Scalars['String']>;
  service?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['BigInt']>;
};

export enum AccessLogOrderableFields {
  Id = 'id',
  Service = 'service',
  Timestamp = 'timestamp'
}

export type AlertLog = {
  __typename?: 'AlertLog';
  id?: Maybe<Scalars['BigInt']>;
  message?: Maybe<Scalars['String']>;
  severity?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
};

export enum AlertLogOrderableFields {
  Id = 'id',
  Message = 'message',
  Severity = 'severity',
  Timestamp = 'timestamp'
}

export type Asset = {
  __typename?: 'Asset';
  children?: Maybe<Array<Asset>>;
  id?: Maybe<Scalars['BigInt']>;
  isLost?: Maybe<Scalars['Boolean']>;
  lastKnownHandler?: Maybe<User>;
  lastKnownHandlerId?: Maybe<Scalars['BigInt']>;
  lastKnownLocation?: Maybe<Scalars['String']>;
  modelNumber?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  notes?: Maybe<Scalars['String']>;
  parent?: Maybe<Asset>;
  parentId?: Maybe<Scalars['BigInt']>;
  purchaseDate?: Maybe<Scalars['DateTime']>;
  purchaseLocation?: Maybe<Scalars['String']>;
  purchasePrice?: Maybe<Scalars['Int']>;
  serialNumber?: Maybe<Scalars['String']>;
  tag?: Maybe<Scalars['Int']>;
};


export type AssetChildrenArgs = {
  filter?: InputMaybe<FilterAssetInput>;
  order?: InputMaybe<Array<OrderAssetInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export enum AssetOrderableFields {
  Id = 'id',
  Name = 'name',
  PurchaseDate = 'purchaseDate',
  PurchasePrice = 'purchasePrice',
  Tag = 'tag'
}

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String'];
  details: Array<Scalars['String']>;
  id?: Maybe<Scalars['BigInt']>;
  identifier?: Maybe<Scalars['BigInt']>;
  message?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['BigInt']>;
};

export enum AuditLogOrderableFields {
  Id = 'id',
  Identifier = 'identifier',
  Message = 'message',
  Subject = 'subject',
  Timestamp = 'timestamp'
}

export type BlogPost = {
  __typename?: 'BlogPost';
  author?: Maybe<Person>;
  authorDisplayName?: Maybe<Scalars['String']>;
  authorId?: Maybe<Scalars['BigInt']>;
  content?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInt']>;
  postedAt?: Maybe<Scalars['DateTime']>;
  title?: Maybe<Scalars['String']>;
};

export enum BlogPostOrderableFields {
  Id = 'id',
  PostedAt = 'postedAt',
  Title = 'title'
}

export type BooleanComparisonInput = {
  equals?: InputMaybe<Scalars['Boolean']>;
};

export enum CaseSensitivity {
  Default = 'Default',
  Insensitive = 'Insensitive'
}

export type Category = {
  __typename?: 'Category';
  children?: Maybe<Array<Category>>;
  id?: Maybe<Scalars['BigInt']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Category>;
  parentId?: Maybe<Scalars['BigInt']>;
  priority?: Maybe<Scalars['Int']>;
  productions?: Maybe<Array<Production>>;
};


export type CategoryChildrenArgs = {
  filter?: InputMaybe<FilterCategoryInput>;
  order?: InputMaybe<Array<OrderCategoryInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type CategoryProductionsArgs = {
  filter?: InputMaybe<FilterProductionInput>;
  order?: InputMaybe<Array<OrderProductionInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export enum CategoryOrderableFields {
  Id = 'id',
  Name = 'name',
  Priority = 'priority'
}

export type ContactSubmission = {
  __typename?: 'ContactSubmission';
  additionalData?: Maybe<Scalars['JSON']>;
  body: Scalars['String'];
  email: Scalars['String'];
  id?: Maybe<Scalars['BigInt']>;
  name: Scalars['String'];
  resolved?: Maybe<Scalars['Boolean']>;
  subject: Scalars['String'];
  timestamp?: Maybe<Scalars['DateTime']>;
  type: ContactSubmissionType;
};

export enum ContactSubmissionOrderableFields {
  Id = 'id',
  Timestamp = 'timestamp'
}

export enum ContactSubmissionType {
  General = 'GENERAL',
  ProductionRequest = 'PRODUCTION_REQUEST'
}

export type ContactSubmissionTypeComparisonInput = {
  equals?: InputMaybe<ContactSubmissionType>;
  in?: InputMaybe<Array<ContactSubmissionType>>;
  not?: InputMaybe<ContactSubmissionTypeComparisonInput>;
  notIn?: InputMaybe<Array<ContactSubmissionType>>;
};

export type CreateAlertLogInput = {
  message?: InputMaybe<Scalars['String']>;
  severity?: InputMaybe<Scalars['String']>;
};

export type CreateAssetInput = {
  isLost?: InputMaybe<Scalars['Boolean']>;
  lastKnownHandlerId?: InputMaybe<Scalars['BigInt']>;
  lastKnownLocation?: InputMaybe<Scalars['String']>;
  modelNumber?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['BigInt']>;
  purchaseDate?: InputMaybe<Scalars['DateTime']>;
  purchaseLocation?: InputMaybe<Scalars['String']>;
  purchasePrice?: InputMaybe<Scalars['Int']>;
  serialNumber?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['Int']>;
};

export type CreateBlogPostInput = {
  authorDisplayName?: InputMaybe<Scalars['String']>;
  authorId?: InputMaybe<Scalars['BigInt']>;
  content?: InputMaybe<Scalars['String']>;
  postedAt?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CreateCategoryInput = {
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['BigInt']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type CreateContactSubmissionGeneralInput = {
  body: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  resolved?: InputMaybe<Scalars['Boolean']>;
  subject: Scalars['String'];
};

export type CreateContactSubmissionProductionRequestInput = {
  audioSource?: InputMaybe<Scalars['String']>;
  body: Scalars['String'];
  email: Scalars['String'];
  endTime: Scalars['DateTime'];
  isStudentOrganization: Scalars['Boolean'];
  livestreamed: Scalars['Boolean'];
  location: Scalars['String'];
  name: Scalars['String'];
  organizationName: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  resolved?: InputMaybe<Scalars['Boolean']>;
  startTime: Scalars['DateTime'];
  subject: Scalars['String'];
};

export type CreateCreditInput = {
  personId?: InputMaybe<Scalars['BigInt']>;
  priority?: InputMaybe<Scalars['Int']>;
  productionId?: InputMaybe<Scalars['BigInt']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CreateGroupInput = {
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['BigInt']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type CreateGroupPermissionInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  groupId?: InputMaybe<Scalars['BigInt']>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
};

export type CreateImageInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
};

export type CreatePersonImageInput = {
  imageId?: InputMaybe<Scalars['BigInt']>;
  personId?: InputMaybe<Scalars['BigInt']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type CreatePersonInput = {
  description?: InputMaybe<Scalars['String']>;
  graduation?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  profilePictureId?: InputMaybe<Scalars['BigInt']>;
  pronouns?: InputMaybe<Scalars['String']>;
};

export type CreatePersonRoleInput = {
  endTime?: InputMaybe<Scalars['DateTime']>;
  personId?: InputMaybe<Scalars['BigInt']>;
  roleId?: InputMaybe<Scalars['BigInt']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
};

export type CreateProductionImageInput = {
  imageId?: InputMaybe<Scalars['BigInt']>;
  priority?: InputMaybe<Scalars['Int']>;
  productionId?: InputMaybe<Scalars['BigInt']>;
};

export type CreateProductionInput = {
  categoryId?: InputMaybe<Scalars['BigInt']>;
  closetLocation?: InputMaybe<Scalars['String']>;
  closetTime?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  discordChannel?: InputMaybe<Scalars['String']>;
  discordServer?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['DateTime']>;
  eventLocation?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  teamNotes?: InputMaybe<Scalars['String']>;
  thumbnailId?: InputMaybe<Scalars['BigInt']>;
};

export type CreateProductionRsvpInput = {
  notes?: InputMaybe<Scalars['String']>;
  productionId?: InputMaybe<Scalars['BigInt']>;
  userId?: InputMaybe<Scalars['BigInt']>;
  willAttend?: InputMaybe<Scalars['String']>;
};

export type CreateProductionTagInput = {
  productionId?: InputMaybe<Scalars['BigInt']>;
  tag?: InputMaybe<Scalars['String']>;
};

export type CreateProductionVideoInput = {
  priority?: InputMaybe<Scalars['Int']>;
  productionId?: InputMaybe<Scalars['BigInt']>;
  videoId?: InputMaybe<Scalars['BigInt']>;
};

export type CreateRedirectInput = {
  expires?: InputMaybe<Scalars['DateTime']>;
  key?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']>;
  displayInLeadership?: InputMaybe<Scalars['Boolean']>;
  displayInMembership?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type CreateStreamInput = {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
};

export type CreateUserGroupInput = {
  groupId?: InputMaybe<Scalars['BigInt']>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type CreateUserInput = {
  discord?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  personId?: InputMaybe<Scalars['BigInt']>;
  username?: InputMaybe<Scalars['String']>;
};

export type CreateUserPermissionInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type CreateVideoInput = {
  format?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['JSON']>;
  name?: InputMaybe<Scalars['String']>;
};

export type CreateVoteInput = {
  description?: InputMaybe<Scalars['String']>;
  expires?: InputMaybe<Scalars['DateTime']>;
  options?: InputMaybe<Array<Scalars['String']>>;
  question?: InputMaybe<Scalars['String']>;
};

export type CreateVoteResponseInput = {
  selection?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['DateTime']>;
  userId?: InputMaybe<Scalars['BigInt']>;
  voteId?: InputMaybe<Scalars['BigInt']>;
};

export type Credit = {
  __typename?: 'Credit';
  id?: Maybe<Scalars['BigInt']>;
  person?: Maybe<Person>;
  personId?: Maybe<Scalars['BigInt']>;
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
  productionId?: Maybe<Scalars['BigInt']>;
  title?: Maybe<Scalars['String']>;
};

export enum CreditOrderableFields {
  Id = 'id',
  Priority = 'priority',
  Title = 'title'
}

export type DateComparisonInput = {
  equals?: InputMaybe<Scalars['DateTime']>;
  gt?: InputMaybe<Scalars['DateTime']>;
  gte?: InputMaybe<Scalars['DateTime']>;
  lt?: InputMaybe<Scalars['DateTime']>;
  lte?: InputMaybe<Scalars['DateTime']>;
  not?: InputMaybe<Scalars['DateTime']>;
};

export type FilterAccessLogInput = {
  AND?: InputMaybe<Array<FilterAccessLogInput>>;
  NOT?: InputMaybe<FilterAccessLogInput>;
  OR?: InputMaybe<Array<FilterAccessLogInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  ip?: InputMaybe<StringComparisonInput>;
  service?: InputMaybe<StringComparisonInput>;
  timestamp?: InputMaybe<DateComparisonInput>;
  userId?: InputMaybe<NumberComparisonInput>;
};

export type FilterAlertLogInput = {
  AND?: InputMaybe<Array<FilterAlertLogInput>>;
  NOT?: InputMaybe<FilterAlertLogInput>;
  OR?: InputMaybe<Array<FilterAlertLogInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  message?: InputMaybe<StringComparisonInput>;
  severity?: InputMaybe<StringComparisonInput>;
  timestamp?: InputMaybe<DateComparisonInput>;
};

export type FilterAssetInput = {
  AND?: InputMaybe<Array<FilterAssetInput>>;
  NOT?: InputMaybe<Array<FilterAssetInput>>;
  OR?: InputMaybe<Array<FilterAssetInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  isLost?: InputMaybe<BooleanComparisonInput>;
  lastKnownHandlerId?: InputMaybe<NumberComparisonInput>;
  lastKnownLocation?: InputMaybe<StringComparisonInput>;
  modelNumber?: InputMaybe<StringComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
  notes?: InputMaybe<StringComparisonInput>;
  parentId?: InputMaybe<NumberComparisonInput>;
  purchaseDate?: InputMaybe<DateComparisonInput>;
  purchaseLocation?: InputMaybe<StringComparisonInput>;
  purchasePrice?: InputMaybe<NumberComparisonInput>;
  serialNumber?: InputMaybe<StringComparisonInput>;
  tag?: InputMaybe<NumberComparisonInput>;
};

export type FilterAuditLogInput = {
  AND?: InputMaybe<Array<FilterAuditLogInput>>;
  NOT?: InputMaybe<FilterAuditLogInput>;
  OR?: InputMaybe<Array<FilterAuditLogInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  identifier?: InputMaybe<NumberComparisonInput>;
  subject?: InputMaybe<StringComparisonInput>;
  timestamp?: InputMaybe<DateComparisonInput>;
  userId?: InputMaybe<NumberComparisonInput>;
};

export type FilterBlogPostInput = {
  AND?: InputMaybe<Array<FilterBlogPostInput>>;
  NOT?: InputMaybe<FilterBlogPostInput>;
  OR?: InputMaybe<Array<FilterBlogPostInput>>;
  authorDisplayName?: InputMaybe<StringComparisonInput>;
  authorId?: InputMaybe<NumberComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  postedAt?: InputMaybe<DateComparisonInput>;
  title?: InputMaybe<StringComparisonInput>;
};

export type FilterCategoryInput = {
  AND?: InputMaybe<Array<FilterCategoryInput>>;
  NOT?: InputMaybe<FilterCategoryInput>;
  OR?: InputMaybe<Array<FilterCategoryInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
  parentId?: InputMaybe<NumberComparisonInput>;
  priority?: InputMaybe<NumberComparisonInput>;
};

export type FilterContactSubmissionInput = {
  AND?: InputMaybe<Array<FilterContactSubmissionInput>>;
  NOT?: InputMaybe<FilterContactSubmissionInput>;
  OR?: InputMaybe<Array<FilterContactSubmissionInput>>;
  email?: InputMaybe<StringComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
  resolved?: InputMaybe<BooleanComparisonInput>;
  timestamp?: InputMaybe<DateComparisonInput>;
  type?: InputMaybe<ContactSubmissionTypeComparisonInput>;
};

export type FilterCreditInput = {
  AND?: InputMaybe<Array<FilterCreditInput>>;
  NOT?: InputMaybe<FilterCreditInput>;
  OR?: InputMaybe<Array<FilterCreditInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  personId?: InputMaybe<NumberComparisonInput>;
  productionId?: InputMaybe<NumberComparisonInput>;
  title?: InputMaybe<StringComparisonInput>;
};

export type FilterGroupInput = {
  AND?: InputMaybe<Array<FilterGroupInput>>;
  NOT?: InputMaybe<FilterGroupInput>;
  OR?: InputMaybe<Array<FilterGroupInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
  parentId?: InputMaybe<NumberComparisonInput>;
};

export type FilterGroupPermissionInput = {
  AND?: InputMaybe<Array<FilterGroupPermissionInput>>;
  NOT?: InputMaybe<FilterGroupPermissionInput>;
  OR?: InputMaybe<Array<FilterGroupPermissionInput>>;
  action?: InputMaybe<StringComparisonInput>;
  groupId?: InputMaybe<NumberComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  inverted?: InputMaybe<BooleanComparisonInput>;
  reason?: InputMaybe<StringComparisonInput>;
};

export type FilterImageInput = {
  AND?: InputMaybe<Array<FilterImageInput>>;
  NOT?: InputMaybe<FilterImageInput>;
  OR?: InputMaybe<Array<FilterImageInput>>;
  description?: InputMaybe<StringComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
  path?: InputMaybe<StringComparisonInput>;
};

export type FilterPersonImageInput = {
  AND?: InputMaybe<Array<FilterPersonImageInput>>;
  NOT?: InputMaybe<FilterPersonImageInput>;
  OR?: InputMaybe<Array<FilterPersonImageInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  imageId?: InputMaybe<NumberComparisonInput>;
  personId?: InputMaybe<NumberComparisonInput>;
};

export type FilterPersonInput = {
  AND?: InputMaybe<Array<FilterPersonInput>>;
  NOT?: InputMaybe<FilterPersonInput>;
  OR?: InputMaybe<Array<FilterPersonInput>>;
  graduation?: InputMaybe<DateComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
};

export type FilterPersonRoleInput = {
  AND?: InputMaybe<Array<FilterPersonRoleInput>>;
  NOT?: InputMaybe<FilterPersonRoleInput>;
  OR?: InputMaybe<Array<FilterPersonRoleInput>>;
  endTime?: InputMaybe<DateComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  personId?: InputMaybe<NumberComparisonInput>;
  roleId?: InputMaybe<NumberComparisonInput>;
  startTime?: InputMaybe<DateComparisonInput>;
};

export type FilterProductionImageInput = {
  AND?: InputMaybe<Array<FilterProductionImageInput>>;
  NOT?: InputMaybe<FilterProductionImageInput>;
  OR?: InputMaybe<Array<FilterProductionImageInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  imageId?: InputMaybe<NumberComparisonInput>;
  productionId?: InputMaybe<NumberComparisonInput>;
};

export type FilterProductionInput = {
  AND?: InputMaybe<Array<FilterProductionInput>>;
  NOT?: InputMaybe<FilterProductionInput>;
  OR?: InputMaybe<Array<FilterProductionInput>>;
  categoryId?: InputMaybe<NumberComparisonInput>;
  closetLocation?: InputMaybe<StringComparisonInput>;
  closetTime?: InputMaybe<DateComparisonInput>;
  description?: InputMaybe<StringComparisonInput>;
  endTime?: InputMaybe<DateComparisonInput>;
  eventLocation?: InputMaybe<StringComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
  startTime?: InputMaybe<DateComparisonInput>;
  teamNotes?: InputMaybe<StringComparisonInput>;
  thumbnailId?: InputMaybe<NumberComparisonInput>;
};

export type FilterProductionRsvpInput = {
  AND?: InputMaybe<Array<FilterProductionRsvpInput>>;
  NOT?: InputMaybe<FilterProductionRsvpInput>;
  OR?: InputMaybe<Array<FilterProductionRsvpInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  notes?: InputMaybe<StringComparisonInput>;
  productionId?: InputMaybe<NumberComparisonInput>;
  userId?: InputMaybe<NumberComparisonInput>;
  willAttend?: InputMaybe<StringComparisonInput>;
};

export type FilterProductionTagInput = {
  AND?: InputMaybe<Array<FilterProductionTagInput>>;
  NOT?: InputMaybe<FilterProductionTagInput>;
  OR?: InputMaybe<Array<FilterProductionTagInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  productionId?: InputMaybe<NumberComparisonInput>;
  tag?: InputMaybe<StringComparisonInput>;
};

export type FilterProductionVideoInput = {
  AND?: InputMaybe<Array<FilterProductionVideoInput>>;
  NOT?: InputMaybe<FilterProductionVideoInput>;
  OR?: InputMaybe<Array<FilterProductionVideoInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  productionId?: InputMaybe<NumberComparisonInput>;
  videoId?: InputMaybe<NumberComparisonInput>;
};

export type FilterRedirectInput = {
  AND?: InputMaybe<Array<FilterRedirectInput>>;
  NOT?: InputMaybe<FilterRedirectInput>;
  OR?: InputMaybe<Array<FilterRedirectInput>>;
  expires?: InputMaybe<DateComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  key?: InputMaybe<StringComparisonInput>;
  location?: InputMaybe<StringComparisonInput>;
};

export type FilterRoleInput = {
  AND?: InputMaybe<Array<FilterRoleInput>>;
  NOT?: InputMaybe<FilterRoleInput>;
  OR?: InputMaybe<Array<FilterRoleInput>>;
  description?: InputMaybe<StringComparisonInput>;
  displayInLeadership?: InputMaybe<BooleanComparisonInput>;
  displayInMembership?: InputMaybe<BooleanComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
};

export type FilterUserGroupInput = {
  AND?: InputMaybe<Array<FilterUserGroupInput>>;
  NOT?: InputMaybe<FilterUserGroupInput>;
  OR?: InputMaybe<Array<FilterUserGroupInput>>;
  groupId?: InputMaybe<NumberComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  userId?: InputMaybe<NumberComparisonInput>;
};

export type FilterUserInput = {
  AND?: InputMaybe<Array<FilterUserInput>>;
  NOT?: InputMaybe<FilterUserInput>;
  OR?: InputMaybe<Array<FilterUserInput>>;
  discord?: InputMaybe<StringComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  joined?: InputMaybe<DateComparisonInput>;
  mail?: InputMaybe<StringComparisonInput>;
  personId?: InputMaybe<NumberComparisonInput>;
  username?: InputMaybe<StringComparisonInput>;
};

export type FilterUserPermissionInput = {
  AND?: InputMaybe<Array<FilterUserPermissionInput>>;
  NOT?: InputMaybe<FilterUserPermissionInput>;
  OR?: InputMaybe<Array<FilterUserPermissionInput>>;
  action?: InputMaybe<StringComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  inverted?: InputMaybe<BooleanComparisonInput>;
  reason?: InputMaybe<StringComparisonInput>;
  userId?: InputMaybe<NumberComparisonInput>;
};

export type FilterVideoInput = {
  AND?: InputMaybe<Array<FilterVideoInput>>;
  NOT?: InputMaybe<FilterVideoInput>;
  OR?: InputMaybe<Array<FilterVideoInput>>;
  format?: InputMaybe<StringComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  name?: InputMaybe<StringComparisonInput>;
};

export type FilterVoteInput = {
  AND?: InputMaybe<Array<FilterVoteInput>>;
  NOT?: InputMaybe<FilterVoteInput>;
  OR?: InputMaybe<Array<FilterVoteInput>>;
  description?: InputMaybe<StringComparisonInput>;
  expires?: InputMaybe<DateComparisonInput>;
  id?: InputMaybe<NumberComparisonInput>;
  question?: InputMaybe<StringComparisonInput>;
};

export type FilterVoteResponseInput = {
  AND?: InputMaybe<Array<FilterVoteResponseInput>>;
  NOT?: InputMaybe<FilterVoteResponseInput>;
  OR?: InputMaybe<Array<FilterVoteResponseInput>>;
  id?: InputMaybe<NumberComparisonInput>;
  selection?: InputMaybe<StringComparisonInput>;
  timestamp?: InputMaybe<DateComparisonInput>;
  userId?: InputMaybe<NumberComparisonInput>;
  voteId?: InputMaybe<NumberComparisonInput>;
};

export type Group = {
  __typename?: 'Group';
  children?: Maybe<Array<Group>>;
  id?: Maybe<Scalars['BigInt']>;
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Group>;
  parentId?: Maybe<Scalars['BigInt']>;
  permissions?: Maybe<Array<GroupPermission>>;
  priority?: Maybe<Scalars['Int']>;
  users?: Maybe<Array<UserGroup>>;
};


export type GroupChildrenArgs = {
  filter?: InputMaybe<FilterGroupInput>;
  order?: InputMaybe<Array<OrderGroupInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type GroupPermissionsArgs = {
  filter?: InputMaybe<FilterGroupPermissionInput>;
  order?: InputMaybe<Array<OrderGroupPermissionInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type GroupUsersArgs = {
  filter?: InputMaybe<FilterUserGroupInput>;
  pagination?: InputMaybe<PaginationInput>;
};

export enum GroupOrderableFields {
  Id = 'id',
  Name = 'name',
  Priority = 'priority'
}

export type GroupPermission = {
  __typename?: 'GroupPermission';
  action?: Maybe<Scalars['String']>;
  conditions?: Maybe<Scalars['JSON']>;
  fields?: Maybe<Array<Scalars['String']>>;
  group?: Maybe<Group>;
  groupId?: Maybe<Scalars['BigInt']>;
  id?: Maybe<Scalars['BigInt']>;
  inverted?: Maybe<Scalars['Boolean']>;
  reason?: Maybe<Scalars['String']>;
  subject?: Maybe<Array<Scalars['String']>>;
};

export enum GroupPermissionOrderableFields {
  Action = 'action',
  Id = 'id'
}

export type Image = {
  __typename?: 'Image';
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInt']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  people?: Maybe<Array<PersonImage>>;
  productions?: Maybe<Array<ProductionImage>>;
  profilePictureFor?: Maybe<Array<Person>>;
  thumbnailFor?: Maybe<Array<Production>>;
};


export type ImagePeopleArgs = {
  filter?: InputMaybe<FilterPersonImageInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type ImageProductionsArgs = {
  filter?: InputMaybe<FilterProductionImageInput>;
  order?: InputMaybe<Array<OrderProductionImageInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type ImageProfilePictureForArgs = {
  filter?: InputMaybe<FilterPersonInput>;
  order?: InputMaybe<Array<OrderPersonInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type ImageThumbnailForArgs = {
  filter?: InputMaybe<FilterProductionInput>;
  order?: InputMaybe<Array<OrderProductionInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export enum ImageOrderableFields {
  Id = 'id',
  Name = 'name'
}

export type Mutation = {
  __typename?: 'Mutation';
  createAlertLog: AlertLog;
  createAsset: Asset;
  createBlogPost: BlogPost;
  createCategory: Category;
  createContactSubmissionGeneral: Scalars['Boolean'];
  createContactSubmissionProductionRequest: Scalars['Boolean'];
  createCredit: Credit;
  createGroup: Group;
  createGroupPermission: GroupPermission;
  createImage: Image;
  createPerson: Person;
  createPersonImage: PersonImage;
  createPersonRole: PersonRole;
  createProduction: Production;
  createProductionImage: ProductionImage;
  createProductionRSVP: ProductionRsvp;
  createProductionTag: ProductionTag;
  createProductionVideo: ProductionVideo;
  createRedirect: Redirect;
  createRole: Role;
  createStream: Stream;
  createUser: User;
  createUserGroup: UserGroup;
  createUserPermission: UserPermission;
  createVideo: Video;
  createVote: Vote;
  createVoteResponse: VoteResponse;
  deleteAlertLog: AlertLog;
  deleteAsset: Asset;
  deleteBlogPost: BlogPost;
  deleteCategory: Category;
  deleteContactSubmission: ContactSubmission;
  deleteCredit: Credit;
  deleteGroup: Group;
  deleteGroupPermission: GroupPermission;
  deleteImage: Image;
  deletePerson: Person;
  deletePersonImage: PersonImage;
  deletePersonRole: PersonRole;
  deleteProduction: Production;
  deleteProductionImage: ProductionImage;
  deleteProductionRSVP: ProductionRsvp;
  deleteProductionTag: ProductionTag;
  deleteProductionVideo: ProductionVideo;
  deleteRedirect: Redirect;
  deleteRole: Role;
  deleteStream: Stream;
  deleteUser: User;
  deleteUserGroup: UserGroup;
  deleteUserPermission: UserPermission;
  deleteVideo: Video;
  deleteVote: Vote;
  deleteVoteResponse: VoteResponse;
  loginLocal: User;
  logout: Scalars['Boolean'];
  updateAlertLog: AlertLog;
  updateAsset: Asset;
  updateBlogPost: BlogPost;
  updateCategory: Category;
  updateContactSubmissionGeneral: ContactSubmission;
  updateContactSubmissionProductionRequest: ContactSubmission;
  updateCredit: Credit;
  updateGroup: Group;
  updateGroupPermission: GroupPermission;
  updateImage: Image;
  updatePerson: Person;
  updatePersonImage: PersonImage;
  updatePersonRole: PersonRole;
  updateProduction: Production;
  updateProductionImage: ProductionImage;
  updateProductionRSVP: ProductionRsvp;
  updateProductionVideo: ProductionVideo;
  updateRedirect: Redirect;
  updateRole: Role;
  updateUser: User;
  updateUserPermission: UserPermission;
  updateVideo: Video;
  updateVote: Vote;
  updateVoteResponse: VoteResponse;
};


export type MutationCreateAlertLogArgs = {
  input: CreateAlertLogInput;
};


export type MutationCreateAssetArgs = {
  input: CreateAssetInput;
};


export type MutationCreateBlogPostArgs = {
  input: CreateBlogPostInput;
};


export type MutationCreateCategoryArgs = {
  input: CreateCategoryInput;
};


export type MutationCreateContactSubmissionGeneralArgs = {
  input: CreateContactSubmissionGeneralInput;
};


export type MutationCreateContactSubmissionProductionRequestArgs = {
  input: CreateContactSubmissionProductionRequestInput;
};


export type MutationCreateCreditArgs = {
  input: CreateCreditInput;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreateGroupPermissionArgs = {
  input: CreateGroupPermissionInput;
};


export type MutationCreateImageArgs = {
  input: CreateImageInput;
};


export type MutationCreatePersonArgs = {
  input: CreatePersonInput;
};


export type MutationCreatePersonImageArgs = {
  input: CreatePersonImageInput;
};


export type MutationCreatePersonRoleArgs = {
  input: CreatePersonRoleInput;
};


export type MutationCreateProductionArgs = {
  input: CreateProductionInput;
};


export type MutationCreateProductionImageArgs = {
  input: CreateProductionImageInput;
};


export type MutationCreateProductionRsvpArgs = {
  input: CreateProductionRsvpInput;
};


export type MutationCreateProductionTagArgs = {
  input: CreateProductionTagInput;
};


export type MutationCreateProductionVideoArgs = {
  input: CreateProductionVideoInput;
};


export type MutationCreateRedirectArgs = {
  input: CreateRedirectInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationCreateStreamArgs = {
  input: CreateStreamInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserGroupArgs = {
  input: CreateUserGroupInput;
};


export type MutationCreateUserPermissionArgs = {
  input: CreateUserPermissionInput;
};


export type MutationCreateVideoArgs = {
  input: CreateVideoInput;
};


export type MutationCreateVoteArgs = {
  input: CreateVoteInput;
};


export type MutationCreateVoteResponseArgs = {
  input: CreateVoteResponseInput;
};


export type MutationDeleteAlertLogArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteAssetArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteBlogPostArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteContactSubmissionArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteCreditArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteGroupArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteGroupPermissionArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteImageArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeletePersonArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeletePersonImageArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeletePersonRoleArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteProductionArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteProductionImageArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteProductionRsvpArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteProductionTagArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteProductionVideoArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteRedirectArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteStreamArgs = {
  id: Scalars['UUID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteUserGroupArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteUserPermissionArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteVideoArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteVoteArgs = {
  id: Scalars['BigInt'];
};


export type MutationDeleteVoteResponseArgs = {
  id: Scalars['BigInt'];
};


export type MutationLoginLocalArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUpdateAlertLogArgs = {
  id: Scalars['BigInt'];
  input: UpdateAlertLogInput;
};


export type MutationUpdateAssetArgs = {
  id: Scalars['BigInt'];
  input: UpdateAssetInput;
};


export type MutationUpdateBlogPostArgs = {
  id: Scalars['BigInt'];
  input: UpdateBlogPostInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['BigInt'];
  input: UpdateCategoryInput;
};


export type MutationUpdateContactSubmissionGeneralArgs = {
  id: Scalars['BigInt'];
  input: UpdateContactSubmissionGeneralInput;
};


export type MutationUpdateContactSubmissionProductionRequestArgs = {
  id: Scalars['BigInt'];
  input: UpdateContactSubmissionProductionRequestInput;
};


export type MutationUpdateCreditArgs = {
  id: Scalars['BigInt'];
  input: UpdateCreditInput;
};


export type MutationUpdateGroupArgs = {
  id: Scalars['BigInt'];
  input: UpdateGroupInput;
};


export type MutationUpdateGroupPermissionArgs = {
  id: Scalars['BigInt'];
  input: UpdateGroupPermissionInput;
};


export type MutationUpdateImageArgs = {
  id: Scalars['BigInt'];
  input: UpdateImageInput;
};


export type MutationUpdatePersonArgs = {
  id: Scalars['BigInt'];
  input: UpdatePersonInput;
};


export type MutationUpdatePersonImageArgs = {
  id: Scalars['BigInt'];
  input: UpdatePersonImageInput;
};


export type MutationUpdatePersonRoleArgs = {
  id: Scalars['BigInt'];
  input: UpdatePersonRoleInput;
};


export type MutationUpdateProductionArgs = {
  id: Scalars['BigInt'];
  input: UpdateProductionInput;
};


export type MutationUpdateProductionImageArgs = {
  id: Scalars['BigInt'];
  input: UpdateProductionImageInput;
};


export type MutationUpdateProductionRsvpArgs = {
  id: Scalars['BigInt'];
  input: UpdateProductionRsvpInput;
};


export type MutationUpdateProductionVideoArgs = {
  id: Scalars['BigInt'];
  input: UpdateProductionVideoInput;
};


export type MutationUpdateRedirectArgs = {
  id: Scalars['BigInt'];
  input: UpdateRedirectInput;
};


export type MutationUpdateRoleArgs = {
  id: Scalars['BigInt'];
  input: UpdateRoleInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['BigInt'];
  input: UpdateUserInput;
};


export type MutationUpdateUserPermissionArgs = {
  id: Scalars['BigInt'];
  input: UpdateUserPermissionInput;
};


export type MutationUpdateVideoArgs = {
  id: Scalars['BigInt'];
  input: UpdateVideoInput;
};


export type MutationUpdateVoteArgs = {
  id: Scalars['BigInt'];
  input: UpdateVoteInput;
};


export type MutationUpdateVoteResponseArgs = {
  id: Scalars['BigInt'];
  input: UpdateVoteResponseInput;
};

export type NumberComparisonInput = {
  equals?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<Scalars['Float']>>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  not?: InputMaybe<Scalars['Float']>;
};

export type OrderAccessLogInput = {
  direction: OrderDirection;
  field: AccessLogOrderableFields;
};

export type OrderAlertLogInput = {
  direction: OrderDirection;
  field: AlertLogOrderableFields;
};

export type OrderAssetInput = {
  direction: OrderDirection;
  field: AssetOrderableFields;
};

export type OrderAuditLogInput = {
  direction: OrderDirection;
  field: AuditLogOrderableFields;
};

export type OrderBlogPostInput = {
  direction: OrderDirection;
  field: BlogPostOrderableFields;
};

export type OrderCategoryInput = {
  direction: OrderDirection;
  field: CategoryOrderableFields;
};

export type OrderContactSubmissionInput = {
  direction: OrderDirection;
  field: ContactSubmissionOrderableFields;
};

export type OrderCreditInput = {
  direction: OrderDirection;
  field: CreditOrderableFields;
};

export enum OrderDirection {
  Asc = 'Asc',
  Desc = 'Desc'
}

export type OrderGroupInput = {
  direction: OrderDirection;
  field: GroupOrderableFields;
};

export type OrderGroupPermissionInput = {
  direction: OrderDirection;
  field: GroupPermissionOrderableFields;
};

export type OrderImageInput = {
  direction: OrderDirection;
  field: ImageOrderableFields;
};

export type OrderPersonInput = {
  direction: OrderDirection;
  field: PersonOrderableFields;
};

export type OrderPersonRoleInput = {
  direction: OrderDirection;
  field: PersonRoleOrderableFields;
};

export type OrderProductionImageInput = {
  direction: OrderDirection;
  field: ProductionImageOrderableFields;
};

export type OrderProductionInput = {
  direction: OrderDirection;
  field: ProductionOrderableFields;
};

export type OrderProductionRsvpInput = {
  direction: OrderDirection;
  field: ProductionRsvpOrderableFields;
};

export type OrderProductionTagInput = {
  direction: OrderDirection;
  field: ProductionTagOrderableFields;
};

export type OrderProductionVideoInput = {
  direction: OrderDirection;
  field: ProductionVideoOrderableFields;
};

export type OrderRedirectInput = {
  direction: OrderDirection;
  field: RedirectOrderableFields;
};

export type OrderRoleInput = {
  direction: OrderDirection;
  field: RoleOrderableFields;
};

export type OrderUserInput = {
  direction: OrderDirection;
  field: UserOrderableFields;
};

export type OrderUserPermissionInput = {
  direction: OrderDirection;
  field: UserPermissionOrderableFields;
};

export type OrderVideoInput = {
  direction: OrderDirection;
  field: VideoOrderableFields;
};

export type OrderVoteInput = {
  direction: OrderDirection;
  field: VoteOrderableFields;
};

export type OrderVoteResponseInput = {
  direction: OrderDirection;
  field: VoteResponseOrderableFields;
};

export type PaginationInput = {
  cursor?: InputMaybe<Scalars['ID']>;
  skip?: InputMaybe<Scalars['Int']>;
  take: Scalars['Int'];
};

export type Permission = GroupPermission | UserPermission;

export type Person = {
  __typename?: 'Person';
  blogPosts?: Maybe<Array<BlogPost>>;
  credits?: Maybe<Array<Credit>>;
  description?: Maybe<Scalars['String']>;
  graduation?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['BigInt']>;
  images?: Maybe<Array<PersonImage>>;
  name?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Image>;
  profilePictureId?: Maybe<Scalars['BigInt']>;
  pronouns?: Maybe<Scalars['String']>;
  roles?: Maybe<Array<PersonRole>>;
  users?: Maybe<Array<User>>;
};


export type PersonBlogPostsArgs = {
  filter?: InputMaybe<FilterBlogPostInput>;
  order?: InputMaybe<Array<OrderBlogPostInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type PersonCreditsArgs = {
  filter?: InputMaybe<FilterCreditInput>;
  order?: InputMaybe<Array<OrderCreditInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type PersonImagesArgs = {
  filter?: InputMaybe<FilterPersonImageInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type PersonRolesArgs = {
  filter?: InputMaybe<FilterPersonRoleInput>;
  order?: InputMaybe<Array<OrderPersonRoleInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type PersonUsersArgs = {
  filter?: InputMaybe<FilterUserInput>;
  order?: InputMaybe<Array<OrderUserInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export type PersonImage = {
  __typename?: 'PersonImage';
  id?: Maybe<Scalars['BigInt']>;
  image?: Maybe<Image>;
  imageId?: Maybe<Scalars['BigInt']>;
  person?: Maybe<Person>;
  personId?: Maybe<Scalars['BigInt']>;
  priority?: Maybe<Scalars['Int']>;
};

export enum PersonOrderableFields {
  Graduation = 'graduation',
  Id = 'id',
  Name = 'name'
}

export type PersonRole = {
  __typename?: 'PersonRole';
  endTime?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['BigInt']>;
  person?: Maybe<Person>;
  personId?: Maybe<Scalars['BigInt']>;
  role?: Maybe<Role>;
  roleId?: Maybe<Scalars['BigInt']>;
  startTime?: Maybe<Scalars['DateTime']>;
};

export enum PersonRoleOrderableFields {
  Id = 'id',
  StartTime = 'startTime'
}

export type Production = {
  __typename?: 'Production';
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['BigInt']>;
  closetLocation?: Maybe<Scalars['String']>;
  closetTime?: Maybe<Scalars['DateTime']>;
  credits?: Maybe<Array<Credit>>;
  description?: Maybe<Scalars['String']>;
  discordChannel?: Maybe<Scalars['String']>;
  discordServer?: Maybe<Scalars['String']>;
  endTime?: Maybe<Scalars['DateTime']>;
  eventLocation?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInt']>;
  images?: Maybe<Array<ProductionImage>>;
  name?: Maybe<Scalars['String']>;
  rsvps?: Maybe<Array<ProductionRsvp>>;
  startTime?: Maybe<Scalars['DateTime']>;
  tags?: Maybe<Array<ProductionTag>>;
  teamNotes?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Image>;
  thumbnailId?: Maybe<Scalars['BigInt']>;
  videos?: Maybe<Array<ProductionVideo>>;
};


export type ProductionCreditsArgs = {
  filter?: InputMaybe<FilterCreditInput>;
  order?: InputMaybe<Array<OrderCreditInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type ProductionImagesArgs = {
  filter?: InputMaybe<FilterProductionImageInput>;
  order?: InputMaybe<Array<OrderProductionImageInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type ProductionRsvpsArgs = {
  filter?: InputMaybe<FilterProductionRsvpInput>;
  order?: InputMaybe<Array<OrderProductionRsvpInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type ProductionTagsArgs = {
  filter?: InputMaybe<FilterProductionTagInput>;
  order?: InputMaybe<Array<OrderProductionTagInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type ProductionVideosArgs = {
  filter?: InputMaybe<FilterProductionVideoInput>;
  order?: InputMaybe<Array<OrderProductionVideoInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export type ProductionImage = {
  __typename?: 'ProductionImage';
  id?: Maybe<Scalars['BigInt']>;
  image?: Maybe<Image>;
  imageId?: Maybe<Scalars['BigInt']>;
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
  productionId?: Maybe<Scalars['BigInt']>;
};

export enum ProductionImageOrderableFields {
  Priority = 'priority'
}

export enum ProductionOrderableFields {
  CategoryId = 'categoryId',
  Id = 'id',
  Name = 'name',
  StartTime = 'startTime'
}

export type ProductionRsvp = {
  __typename?: 'ProductionRSVP';
  id?: Maybe<Scalars['BigInt']>;
  notes?: Maybe<Scalars['String']>;
  production?: Maybe<Production>;
  productionId?: Maybe<Scalars['BigInt']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['BigInt']>;
  willAttend?: Maybe<Scalars['String']>;
};

export enum ProductionRsvpOrderableFields {
  Id = 'id',
  WillAttend = 'willAttend'
}

export type ProductionTag = {
  __typename?: 'ProductionTag';
  id?: Maybe<Scalars['BigInt']>;
  production?: Maybe<Production>;
  productionId?: Maybe<Scalars['BigInt']>;
  tag?: Maybe<Scalars['String']>;
};

export enum ProductionTagOrderableFields {
  Id = 'id',
  Tag = 'tag'
}

export type ProductionVideo = {
  __typename?: 'ProductionVideo';
  id?: Maybe<Scalars['BigInt']>;
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
  productionId?: Maybe<Scalars['BigInt']>;
  video?: Maybe<Video>;
  videoId?: Maybe<Scalars['BigInt']>;
};

export enum ProductionVideoOrderableFields {
  Priority = 'priority'
}

export type Query = {
  __typename?: 'Query';
  accessLogCount: Scalars['Int'];
  alertLogCount: Scalars['Int'];
  assetCount: Scalars['Int'];
  auditLogCount: Scalars['Int'];
  blogPostCount: Scalars['Int'];
  categoryCount: Scalars['Int'];
  contactSubmissionCount: Scalars['Int'];
  creditCount: Scalars['Int'];
  findManyAccessLog: Array<AccessLog>;
  findManyAlertLog: Array<AlertLog>;
  findManyAsset: Array<Asset>;
  findManyAuditLog: Array<AuditLog>;
  findManyBlogPost: Array<BlogPost>;
  findManyCategory: Array<Category>;
  findManyContactSubmission: Array<ContactSubmission>;
  findManyCredit: Array<Credit>;
  findManyGroup: Array<Group>;
  findManyGroupPermission: Array<GroupPermission>;
  findManyImage: Array<Image>;
  findManyPerson: Array<Person>;
  findManyPersonRole: Array<PersonRole>;
  findManyProduction: Array<Production>;
  findManyProductionRSVP: Array<ProductionRsvp>;
  findManyProductionTag: Array<ProductionTag>;
  findManyRedirect: Array<Redirect>;
  findManyRole: Array<Role>;
  findManyStream: Array<Stream>;
  findManyUser: Array<User>;
  findManyUserPermission: Array<UserPermission>;
  findManyVideo: Array<Video>;
  findManyVote: Array<Vote>;
  findManyVoteResponse: Array<VoteResponse>;
  findOneAccessLog?: Maybe<AccessLog>;
  findOneAlertLog?: Maybe<AlertLog>;
  findOneAsset?: Maybe<Asset>;
  findOneAuditLog?: Maybe<AuditLog>;
  findOneBlogPost?: Maybe<BlogPost>;
  findOneCategory?: Maybe<Category>;
  findOneContactSubmission?: Maybe<ContactSubmission>;
  findOneCredit?: Maybe<Credit>;
  findOneGroup?: Maybe<Group>;
  findOneGroupPermission?: Maybe<GroupPermission>;
  findOneImage?: Maybe<Image>;
  findOnePerson?: Maybe<Person>;
  findOnePersonImage?: Maybe<PersonImage>;
  findOnePersonRole?: Maybe<PersonRole>;
  findOneProduction?: Maybe<Production>;
  findOneProductionImage?: Maybe<ProductionImage>;
  findOneProductionRSVP?: Maybe<ProductionRsvp>;
  findOneProductionTag?: Maybe<ProductionTag>;
  findOneProductionVideo?: Maybe<ProductionVideo>;
  findOneRedirect?: Maybe<Redirect>;
  findOneRole?: Maybe<Role>;
  findOneStream?: Maybe<Stream>;
  findOneUser?: Maybe<User>;
  findOneUserGroup?: Maybe<UserGroup>;
  findOneUserPermission?: Maybe<UserPermission>;
  findOneVideo?: Maybe<Video>;
  findOneVote?: Maybe<Vote>;
  findOneVoteResponse?: Maybe<VoteResponse>;
  groupCount: Scalars['Int'];
  groupPermissionCount: Scalars['Int'];
  imageCount: Scalars['Int'];
  permissionsFor?: Maybe<Array<Permission>>;
  personCount: Scalars['Int'];
  personImageCount: Scalars['Int'];
  personRoleCount: Scalars['Int'];
  productionCount: Scalars['Int'];
  productionImageCount: Scalars['Int'];
  productionRSVPCount: Scalars['Int'];
  productionTagCount: Scalars['Int'];
  productionVideoCount: Scalars['Int'];
  redirectCount: Scalars['Int'];
  roleCount: Scalars['Int'];
  self?: Maybe<User>;
  streamCount: Scalars['Int'];
  userCount: Scalars['Int'];
  userGroupCount: Scalars['Int'];
  userPermissionCount: Scalars['Int'];
  videoCount: Scalars['Int'];
  voteCount: Scalars['Int'];
  voteResponseCount: Scalars['Int'];
};


export type QueryAccessLogCountArgs = {
  filter?: InputMaybe<FilterAccessLogInput>;
};


export type QueryAlertLogCountArgs = {
  filter?: InputMaybe<FilterAlertLogInput>;
};


export type QueryAssetCountArgs = {
  filter?: InputMaybe<FilterAssetInput>;
};


export type QueryAuditLogCountArgs = {
  filter?: InputMaybe<FilterAuditLogInput>;
};


export type QueryBlogPostCountArgs = {
  filter?: InputMaybe<FilterBlogPostInput>;
};


export type QueryCategoryCountArgs = {
  filter?: InputMaybe<FilterCategoryInput>;
};


export type QueryContactSubmissionCountArgs = {
  filter?: InputMaybe<FilterContactSubmissionInput>;
};


export type QueryCreditCountArgs = {
  filter?: InputMaybe<FilterCreditInput>;
};


export type QueryFindManyAccessLogArgs = {
  filter?: InputMaybe<FilterAccessLogInput>;
  order?: InputMaybe<Array<OrderAccessLogInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyAlertLogArgs = {
  filter?: InputMaybe<FilterAlertLogInput>;
  order?: InputMaybe<Array<OrderAlertLogInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyAssetArgs = {
  filter?: InputMaybe<FilterAssetInput>;
  order?: InputMaybe<Array<OrderAssetInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyAuditLogArgs = {
  filter?: InputMaybe<FilterAuditLogInput>;
  order?: InputMaybe<Array<OrderAuditLogInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyBlogPostArgs = {
  filter?: InputMaybe<FilterBlogPostInput>;
  order?: InputMaybe<Array<OrderBlogPostInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyCategoryArgs = {
  filter?: InputMaybe<FilterCategoryInput>;
  order?: InputMaybe<Array<OrderCategoryInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyContactSubmissionArgs = {
  filter?: InputMaybe<FilterContactSubmissionInput>;
  order?: InputMaybe<Array<OrderContactSubmissionInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyCreditArgs = {
  filter?: InputMaybe<FilterCreditInput>;
  order?: InputMaybe<Array<OrderCreditInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyGroupArgs = {
  filter?: InputMaybe<FilterGroupInput>;
  order?: InputMaybe<Array<OrderGroupInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyGroupPermissionArgs = {
  filter?: InputMaybe<FilterGroupPermissionInput>;
  order?: InputMaybe<Array<OrderGroupPermissionInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyImageArgs = {
  filter?: InputMaybe<FilterImageInput>;
  order?: InputMaybe<Array<OrderImageInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyPersonArgs = {
  filter?: InputMaybe<FilterPersonInput>;
  order?: InputMaybe<Array<OrderPersonInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyPersonRoleArgs = {
  filter?: InputMaybe<FilterPersonRoleInput>;
  order?: InputMaybe<Array<OrderPersonRoleInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyProductionArgs = {
  filter?: InputMaybe<FilterProductionInput>;
  order?: InputMaybe<Array<OrderProductionInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyProductionRsvpArgs = {
  filter?: InputMaybe<FilterProductionRsvpInput>;
  order?: InputMaybe<Array<OrderProductionRsvpInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyProductionTagArgs = {
  filter?: InputMaybe<FilterProductionTagInput>;
  order?: InputMaybe<Array<OrderProductionTagInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyRedirectArgs = {
  filter?: InputMaybe<FilterRedirectInput>;
  order?: InputMaybe<Array<OrderRedirectInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyRoleArgs = {
  filter?: InputMaybe<FilterRoleInput>;
  order?: InputMaybe<Array<OrderRoleInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyStreamArgs = {
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyUserArgs = {
  filter?: InputMaybe<FilterUserInput>;
  order?: InputMaybe<Array<OrderUserInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyUserPermissionArgs = {
  filter?: InputMaybe<FilterUserPermissionInput>;
  order?: InputMaybe<Array<OrderUserPermissionInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyVideoArgs = {
  filter?: InputMaybe<FilterVideoInput>;
  order?: InputMaybe<Array<OrderVideoInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyVoteArgs = {
  filter?: InputMaybe<FilterVoteInput>;
  order?: InputMaybe<Array<OrderVoteInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindManyVoteResponseArgs = {
  filter?: InputMaybe<FilterVoteResponseInput>;
  order?: InputMaybe<Array<OrderVoteResponseInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type QueryFindOneAccessLogArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneAlertLogArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneAssetArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneAuditLogArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneBlogPostArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneCategoryArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneContactSubmissionArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneCreditArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneGroupArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneGroupPermissionArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneImageArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOnePersonArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOnePersonImageArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOnePersonRoleArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneProductionArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneProductionImageArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneProductionRsvpArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneProductionTagArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneProductionVideoArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneRedirectArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneRoleArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneStreamArgs = {
  id: Scalars['UUID'];
};


export type QueryFindOneUserArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneUserGroupArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneUserPermissionArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneVideoArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneVoteArgs = {
  id: Scalars['BigInt'];
};


export type QueryFindOneVoteResponseArgs = {
  id: Scalars['BigInt'];
};


export type QueryGroupCountArgs = {
  filter?: InputMaybe<FilterGroupInput>;
};


export type QueryGroupPermissionCountArgs = {
  filter?: InputMaybe<FilterGroupPermissionInput>;
};


export type QueryImageCountArgs = {
  filter?: InputMaybe<FilterImageInput>;
};


export type QueryPermissionsForArgs = {
  userId?: InputMaybe<Scalars['BigInt']>;
};


export type QueryPersonCountArgs = {
  filter?: InputMaybe<FilterPersonInput>;
};


export type QueryPersonImageCountArgs = {
  filter?: InputMaybe<FilterPersonImageInput>;
};


export type QueryPersonRoleCountArgs = {
  filter?: InputMaybe<FilterPersonRoleInput>;
};


export type QueryProductionCountArgs = {
  filter?: InputMaybe<FilterProductionInput>;
};


export type QueryProductionImageCountArgs = {
  filter?: InputMaybe<FilterProductionImageInput>;
};


export type QueryProductionRsvpCountArgs = {
  filter?: InputMaybe<FilterProductionRsvpInput>;
};


export type QueryProductionTagCountArgs = {
  filter?: InputMaybe<FilterProductionTagInput>;
};


export type QueryProductionVideoCountArgs = {
  filter?: InputMaybe<FilterProductionVideoInput>;
};


export type QueryRedirectCountArgs = {
  filter?: InputMaybe<FilterRedirectInput>;
};


export type QueryRoleCountArgs = {
  filter?: InputMaybe<FilterRoleInput>;
};


export type QueryUserCountArgs = {
  filter?: InputMaybe<FilterUserInput>;
};


export type QueryUserGroupCountArgs = {
  filter?: InputMaybe<FilterUserGroupInput>;
};


export type QueryUserPermissionCountArgs = {
  filter?: InputMaybe<FilterUserPermissionInput>;
};


export type QueryVideoCountArgs = {
  filter?: InputMaybe<FilterVideoInput>;
};


export type QueryVoteCountArgs = {
  filter?: InputMaybe<FilterVoteInput>;
};


export type QueryVoteResponseCountArgs = {
  filter?: InputMaybe<FilterVoteResponseInput>;
};

export type Redirect = {
  __typename?: 'Redirect';
  expires?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['BigInt']>;
  key?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
};

export enum RedirectOrderableFields {
  Expires = 'expires',
  Id = 'id',
  Key = 'key'
}

export type Role = {
  __typename?: 'Role';
  description?: Maybe<Scalars['String']>;
  displayInLeadership?: Maybe<Scalars['Boolean']>;
  displayInMembership?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['BigInt']>;
  name?: Maybe<Scalars['String']>;
  people?: Maybe<Array<PersonRole>>;
  priority?: Maybe<Scalars['Int']>;
};


export type RolePeopleArgs = {
  filter?: InputMaybe<FilterPersonRoleInput>;
  order?: InputMaybe<Array<OrderPersonRoleInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export enum RoleOrderableFields {
  Id = 'id',
  Name = 'name',
  Priority = 'priority'
}

export type RuleOptions = {
  defer?: InputMaybe<Scalars['Boolean']>;
  excludeFields?: InputMaybe<Array<Scalars['String']>>;
  filterInputName?: InputMaybe<Scalars['String']>;
  inputName?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  orderInputName?: InputMaybe<Scalars['String']>;
  paginationInputName?: InputMaybe<Scalars['String']>;
  strict?: InputMaybe<Scalars['Boolean']>;
};

export type Stream = {
  __typename?: 'Stream';
  from?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['UUID']>;
  message?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
};

export type StringComparisonInput = {
  contains?: InputMaybe<Scalars['String']>;
  endsWith?: InputMaybe<Scalars['String']>;
  equals?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  mode?: InputMaybe<CaseSensitivity>;
  not?: InputMaybe<Scalars['String']>;
  startsWith?: InputMaybe<Scalars['String']>;
};

export type UpdateAlertLogInput = {
  message?: InputMaybe<Scalars['String']>;
  severity?: InputMaybe<Scalars['String']>;
};

export type UpdateAssetInput = {
  isLost?: InputMaybe<Scalars['Boolean']>;
  lastKnownHandlerId?: InputMaybe<Scalars['BigInt']>;
  lastKnownLocation?: InputMaybe<Scalars['String']>;
  modelNumber?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['BigInt']>;
  purchaseDate?: InputMaybe<Scalars['DateTime']>;
  purchaseLocation?: InputMaybe<Scalars['String']>;
  purchasePrice?: InputMaybe<Scalars['Int']>;
  serialNumber?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['Int']>;
};

export type UpdateBlogPostInput = {
  authorDisplayName?: InputMaybe<Scalars['String']>;
  authorId?: InputMaybe<Scalars['BigInt']>;
  content?: InputMaybe<Scalars['String']>;
  postedAt?: InputMaybe<Scalars['DateTime']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateCategoryInput = {
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['BigInt']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type UpdateContactSubmissionGeneralInput = {
  body?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  resolved?: InputMaybe<Scalars['Boolean']>;
  subject?: InputMaybe<Scalars['String']>;
};

export type UpdateContactSubmissionProductionRequestInput = {
  audioSource?: InputMaybe<Scalars['String']>;
  body?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['DateTime']>;
  isStudentOrganization?: InputMaybe<Scalars['Boolean']>;
  livestreamed?: InputMaybe<Scalars['Boolean']>;
  location?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  organizationName?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  resolved?: InputMaybe<Scalars['Boolean']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  subject?: InputMaybe<Scalars['String']>;
};

export type UpdateCreditInput = {
  personId?: InputMaybe<Scalars['BigInt']>;
  priority?: InputMaybe<Scalars['Int']>;
  productionId?: InputMaybe<Scalars['BigInt']>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateGroupInput = {
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['BigInt']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type UpdateGroupPermissionInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  groupId?: InputMaybe<Scalars['BigInt']>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateImageInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  path?: InputMaybe<Scalars['String']>;
};

export type UpdatePersonImageInput = {
  priority?: InputMaybe<Scalars['Int']>;
};

export type UpdatePersonInput = {
  description?: InputMaybe<Scalars['String']>;
  graduation?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  profilePictureId?: InputMaybe<Scalars['BigInt']>;
  pronouns?: InputMaybe<Scalars['String']>;
};

export type UpdatePersonRoleInput = {
  endTime?: InputMaybe<Scalars['DateTime']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
};

export type UpdateProductionImageInput = {
  priority?: InputMaybe<Scalars['Int']>;
};

export type UpdateProductionInput = {
  categoryId?: InputMaybe<Scalars['BigInt']>;
  closetLocation?: InputMaybe<Scalars['String']>;
  closetTime?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  discordChannel?: InputMaybe<Scalars['String']>;
  discordServer?: InputMaybe<Scalars['String']>;
  endTime?: InputMaybe<Scalars['DateTime']>;
  eventLocation?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  startTime?: InputMaybe<Scalars['DateTime']>;
  teamNotes?: InputMaybe<Scalars['String']>;
  thumbnailId?: InputMaybe<Scalars['BigInt']>;
};

export type UpdateProductionRsvpInput = {
  notes?: InputMaybe<Scalars['String']>;
  willAttend?: InputMaybe<Scalars['String']>;
};

export type UpdateProductionVideoInput = {
  priority?: InputMaybe<Scalars['Int']>;
};

export type UpdateRedirectInput = {
  expires?: InputMaybe<Scalars['DateTime']>;
  key?: InputMaybe<Scalars['String']>;
  location?: InputMaybe<Scalars['String']>;
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']>;
  displayInLeadership?: InputMaybe<Scalars['Boolean']>;
  displayInMembership?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type UpdateUserInput = {
  discord?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  personId?: InputMaybe<Scalars['BigInt']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateUserPermissionInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSON']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
  userId?: InputMaybe<Scalars['BigInt']>;
};

export type UpdateVideoInput = {
  format?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['JSON']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateVoteInput = {
  description?: InputMaybe<Scalars['String']>;
  expires?: InputMaybe<Scalars['DateTime']>;
  options?: InputMaybe<Array<Scalars['String']>>;
  question?: InputMaybe<Scalars['String']>;
};

export type UpdateVoteResponseInput = {
  selection?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['DateTime']>;
};

export type User = {
  __typename?: 'User';
  accessLogs?: Maybe<Array<AccessLog>>;
  auditLogs?: Maybe<Array<AuditLog>>;
  checkedOutAssets?: Maybe<Array<Asset>>;
  discord?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<UserGroup>>;
  id?: Maybe<Scalars['BigInt']>;
  joined?: Maybe<Scalars['DateTime']>;
  mail?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<UserPermission>>;
  person?: Maybe<Person>;
  personId?: Maybe<Scalars['BigInt']>;
  productionRsvps?: Maybe<Array<ProductionRsvp>>;
  username?: Maybe<Scalars['String']>;
  voteResponses?: Maybe<Array<VoteResponse>>;
};


export type UserAccessLogsArgs = {
  filter?: InputMaybe<FilterAccessLogInput>;
  order?: InputMaybe<Array<OrderAccessLogInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type UserAuditLogsArgs = {
  filter?: InputMaybe<FilterAuditLogInput>;
  order?: InputMaybe<Array<OrderAuditLogInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type UserCheckedOutAssetsArgs = {
  filter?: InputMaybe<FilterAssetInput>;
  order?: InputMaybe<Array<OrderAssetInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type UserGroupsArgs = {
  filter?: InputMaybe<FilterUserGroupInput>;
  pagination?: InputMaybe<PaginationInput>;
};


export type UserPermissionsArgs = {
  filter?: InputMaybe<FilterUserPermissionInput>;
  order?: InputMaybe<Array<OrderUserPermissionInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type UserProductionRsvpsArgs = {
  filter?: InputMaybe<FilterProductionRsvpInput>;
  order?: InputMaybe<Array<OrderProductionRsvpInput>>;
  pagination?: InputMaybe<PaginationInput>;
};


export type UserVoteResponsesArgs = {
  filter?: InputMaybe<FilterVoteResponseInput>;
  order?: InputMaybe<Array<OrderVoteResponseInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export type UserGroup = {
  __typename?: 'UserGroup';
  group?: Maybe<Group>;
  groupId?: Maybe<Scalars['BigInt']>;
  id?: Maybe<Scalars['BigInt']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['BigInt']>;
};

export enum UserOrderableFields {
  Id = 'id',
  Joined = 'joined',
  Mail = 'mail',
  Username = 'username'
}

export type UserPermission = {
  __typename?: 'UserPermission';
  action?: Maybe<Scalars['String']>;
  conditions?: Maybe<Scalars['JSON']>;
  fields?: Maybe<Array<Scalars['String']>>;
  id?: Maybe<Scalars['BigInt']>;
  inverted?: Maybe<Scalars['Boolean']>;
  reason?: Maybe<Scalars['String']>;
  subject?: Maybe<Array<Scalars['String']>>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['BigInt']>;
};

export enum UserPermissionOrderableFields {
  Action = 'action',
  Id = 'id'
}

export type Video = {
  __typename?: 'Video';
  format?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['BigInt']>;
  metadata?: Maybe<Scalars['JSON']>;
  name?: Maybe<Scalars['String']>;
  productions?: Maybe<Array<ProductionVideo>>;
};


export type VideoProductionsArgs = {
  filter?: InputMaybe<FilterProductionVideoInput>;
  order?: InputMaybe<Array<OrderProductionVideoInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export enum VideoOrderableFields {
  Id = 'id',
  Name = 'name'
}

export type Vote = {
  __typename?: 'Vote';
  description?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['BigInt']>;
  options?: Maybe<Array<Scalars['String']>>;
  question?: Maybe<Scalars['String']>;
  responses?: Maybe<Array<VoteResponse>>;
};


export type VoteResponsesArgs = {
  filter?: InputMaybe<FilterVoteResponseInput>;
  order?: InputMaybe<Array<OrderVoteResponseInput>>;
  pagination?: InputMaybe<PaginationInput>;
};

export enum VoteOrderableFields {
  Expires = 'expires',
  Id = 'id',
  Question = 'question'
}

export type VoteResponse = {
  __typename?: 'VoteResponse';
  id?: Maybe<Scalars['BigInt']>;
  selection?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  userId?: Maybe<Scalars['BigInt']>;
  vote?: Maybe<Vote>;
  voteId?: Maybe<Scalars['BigInt']>;
};

export enum VoteResponseOrderableFields {
  Id = 'id',
  Timestamp = 'timestamp'
}

export type CategoryDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type CategoryDetailsQuery = { __typename?: 'Query', category?: { __typename?: 'Category', id?: any | null, name?: string | null, priority?: number | null, parent?: { __typename?: 'Category', id?: any | null, name?: string | null } | null } | null };

export type ContactSubmissionDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type ContactSubmissionDetailsQuery = { __typename?: 'Query', submissionDetails?: { __typename?: 'ContactSubmission', id?: any | null, name: string, email: string, additionalData?: any | null, timestamp?: any | null, subject: string, resolved?: boolean | null, body: string, type: ContactSubmissionType } | null };

export type CreateCategoryMutationVariables = Exact<{
  data: CreateCategoryInput;
}>;


export type CreateCategoryMutation = { __typename?: 'Mutation', category: { __typename?: 'Category', id?: any | null } };

export type CreateContactSubmissionGeneralMutationVariables = Exact<{
  data: CreateContactSubmissionGeneralInput;
}>;


export type CreateContactSubmissionGeneralMutation = { __typename?: 'Mutation', createContactSubmissionGeneral: boolean };

export type CreateContactSubmissionProductionRequestMutationVariables = Exact<{
  data: CreateContactSubmissionProductionRequestInput;
}>;


export type CreateContactSubmissionProductionRequestMutation = { __typename?: 'Mutation', createContactSubmissionProductionRequest: boolean };

export type CreateGroupMutationVariables = Exact<{
  data: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', group: { __typename?: 'Group', id?: any | null } };

export type CreateGroupPermissionMutationVariables = Exact<{
  input: CreateGroupPermissionInput;
}>;


export type CreateGroupPermissionMutation = { __typename?: 'Mutation', permission: { __typename?: 'GroupPermission', id?: any | null } };

export type CreateImageMutationVariables = Exact<{
  data: CreateImageInput;
}>;


export type CreateImageMutation = { __typename?: 'Mutation', image: { __typename?: 'Image', id?: any | null } };

export type CreatePersonMutationVariables = Exact<{
  data: CreatePersonInput;
}>;


export type CreatePersonMutation = { __typename?: 'Mutation', person: { __typename?: 'Person', id?: any | null } };

export type CreatePersonImageMutationVariables = Exact<{
  personId: Scalars['BigInt'];
  imageId: Scalars['BigInt'];
}>;


export type CreatePersonImageMutation = { __typename?: 'Mutation', personImage: { __typename?: 'PersonImage', id?: any | null } };

export type CreateProductionMutationVariables = Exact<{
  data: CreateProductionInput;
}>;


export type CreateProductionMutation = { __typename?: 'Mutation', production: { __typename?: 'Production', id?: any | null } };

export type CreateProductionImageMutationVariables = Exact<{
  data: CreateProductionImageInput;
}>;


export type CreateProductionImageMutation = { __typename?: 'Mutation', image: { __typename?: 'ProductionImage', id?: any | null } };

export type CreateProductionTagMutationVariables = Exact<{
  data: CreateProductionTagInput;
}>;


export type CreateProductionTagMutation = { __typename?: 'Mutation', tag: { __typename?: 'ProductionTag', id?: any | null } };

export type CreateProductionVideoMutationVariables = Exact<{
  data: CreateProductionVideoInput;
}>;


export type CreateProductionVideoMutation = { __typename?: 'Mutation', video: { __typename?: 'ProductionVideo', id?: any | null } };

export type CreateRoleMutationVariables = Exact<{
  data: CreateRoleInput;
}>;


export type CreateRoleMutation = { __typename?: 'Mutation', role: { __typename?: 'Role', id?: any | null } };

export type CreateUserMutationVariables = Exact<{
  data: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', user: { __typename?: 'User', id?: any | null } };

export type CreateUserGroupMutationVariables = Exact<{
  userId: Scalars['BigInt'];
  groupId: Scalars['BigInt'];
}>;


export type CreateUserGroupMutation = { __typename?: 'Mutation', userGroup: { __typename?: 'UserGroup', id?: any | null } };

export type CreateUserPermissionMutationVariables = Exact<{
  input: CreateUserPermissionInput;
}>;


export type CreateUserPermissionMutation = { __typename?: 'Mutation', permission: { __typename?: 'UserPermission', id?: any | null } };

export type CreateVideoMutationVariables = Exact<{
  data: CreateVideoInput;
}>;


export type CreateVideoMutation = { __typename?: 'Mutation', video: { __typename?: 'Video', id?: any | null } };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', category: { __typename?: 'Category', id?: any | null, name?: string | null } };

export type DeleteContactSubmissionMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteContactSubmissionMutation = { __typename?: 'Mutation', deleteContactSubmission: { __typename?: 'ContactSubmission', id?: any | null } };

export type DeleteGroupMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', group: { __typename?: 'Group', id?: any | null, name?: string | null } };

export type DeleteGroupPermissionMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteGroupPermissionMutation = { __typename?: 'Mutation', permission: { __typename?: 'GroupPermission', id?: any | null } };

export type DeleteImageMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteImageMutation = { __typename?: 'Mutation', image: { __typename?: 'Image', id?: any | null, name?: string | null } };

export type DeletePersonMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeletePersonMutation = { __typename?: 'Mutation', person: { __typename?: 'Person', id?: any | null, name?: string | null } };

export type DeletePersonImageMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeletePersonImageMutation = { __typename?: 'Mutation', personImage: { __typename?: 'PersonImage', id?: any | null } };

export type DeleteProductionMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteProductionMutation = { __typename?: 'Mutation', production: { __typename?: 'Production', id?: any | null } };

export type DeleteProductionImageMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteProductionImageMutation = { __typename?: 'Mutation', productionImage: { __typename?: 'ProductionImage', id?: any | null } };

export type DeleteProductionTagMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteProductionTagMutation = { __typename?: 'Mutation', productionTag: { __typename?: 'ProductionTag', id?: any | null } };

export type DeleteProductionVideoMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteProductionVideoMutation = { __typename?: 'Mutation', productionVideo: { __typename?: 'ProductionVideo', id?: any | null } };

export type DeleteRoleMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteRoleMutation = { __typename?: 'Mutation', role: { __typename?: 'Role', id?: any | null, name?: string | null } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', user: { __typename?: 'User', id?: any | null, username?: string | null, mail?: string | null } };

export type DeleteUserGroupMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteUserGroupMutation = { __typename?: 'Mutation', userGroup: { __typename?: 'UserGroup', id?: any | null } };

export type DeleteUserPermissionMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteUserPermissionMutation = { __typename?: 'Mutation', permission: { __typename?: 'UserPermission', id?: any | null } };

export type DeleteVideoMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteVideoMutation = { __typename?: 'Mutation', video: { __typename?: 'Video', id?: any | null, name?: string | null } };

export type FindAccessLogsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterAccessLogInput>;
}>;


export type FindAccessLogsQuery = { __typename?: 'Query', accessLogCount: number, accessLogs: Array<{ __typename?: 'AccessLog', id?: any | null, ip?: string | null, service?: string | null, timestamp?: any | null, user?: { __typename?: 'User', id?: any | null, username?: string | null } | null }> };

export type FindAlertLogsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterAlertLogInput>;
}>;


export type FindAlertLogsQuery = { __typename?: 'Query', alertLogCount: number, alertLogs: Array<{ __typename?: 'AlertLog', id?: any | null, message?: string | null, severity?: string | null, timestamp?: any | null }> };

export type FindAllProductionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterProductionInput>;
  order?: InputMaybe<Array<OrderProductionInput> | OrderProductionInput>;
}>;


export type FindAllProductionsQuery = { __typename?: 'Query', totalProductions: number, productions: Array<{ __typename?: 'Production', id?: any | null, name?: string | null, description?: string | null, endTime?: any | null, startTime?: any | null, category?: { __typename?: 'Category', name?: string | null } | null, images?: Array<{ __typename?: 'ProductionImage', id?: any | null, imageId?: any | null }> | null, tags?: Array<{ __typename?: 'ProductionTag', id?: any | null, tag?: string | null }> | null, thumbnail?: { __typename?: 'Image', path?: string | null } | null, videos?: Array<{ __typename?: 'ProductionVideo', id?: any | null, video?: { __typename?: 'Video', id?: any | null, name?: string | null } | null }> | null }> };

export type FindAuditLogsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterAuditLogInput>;
}>;


export type FindAuditLogsQuery = { __typename?: 'Query', auditLogCount: number, auditLogs: Array<{ __typename?: 'AuditLog', id?: any | null, action: string, details: Array<string>, identifier?: any | null, message?: string | null, subject?: string | null, timestamp?: any | null, user?: { __typename?: 'User', id?: any | null, username?: string | null } | null }> };

export type FindCategoriesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterCategoryInput>;
  order?: InputMaybe<Array<OrderCategoryInput> | OrderCategoryInput>;
}>;


export type FindCategoriesQuery = { __typename?: 'Query', categoryCount: number, categories: Array<{ __typename?: 'Category', id?: any | null, name?: string | null, priority?: number | null }> };

export type FindContactSubmissionsQueryVariables = Exact<{
  filter?: InputMaybe<FilterContactSubmissionInput>;
  pagination?: InputMaybe<PaginationInput>;
  order?: InputMaybe<Array<OrderContactSubmissionInput> | OrderContactSubmissionInput>;
}>;


export type FindContactSubmissionsQuery = { __typename?: 'Query', totalSubmissions: number, contactSubmissions: Array<{ __typename?: 'ContactSubmission', id?: any | null, name: string, email: string, resolved?: boolean | null, subject: string, timestamp?: any | null, type: ContactSubmissionType }> };

export type FindGroupPermissionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterGroupPermissionInput>;
}>;


export type FindGroupPermissionsQuery = { __typename?: 'Query', groupPermissionCount: number, permissions: Array<{ __typename?: 'GroupPermission', id?: any | null, action?: string | null, subject?: Array<string> | null, fields?: Array<string> | null, conditions?: any | null, inverted?: boolean | null, reason?: string | null }> };

export type FindGroupsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterGroupInput>;
  order?: InputMaybe<Array<OrderGroupInput> | OrderGroupInput>;
}>;


export type FindGroupsQuery = { __typename?: 'Query', groupCount: number, groups: Array<{ __typename?: 'Group', id?: any | null, name?: string | null, priority?: number | null, parent?: { __typename?: 'Group', id?: any | null, name?: string | null } | null }> };

export type FindImagesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterImageInput>;
  order?: InputMaybe<Array<OrderImageInput> | OrderImageInput>;
}>;


export type FindImagesQuery = { __typename?: 'Query', imageCount: number, images: Array<{ __typename?: 'Image', id?: any | null, name?: string | null, description?: string | null, path?: string | null }> };

export type FindLiveProductionsQueryVariables = Exact<{
  now: Scalars['DateTime'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type FindLiveProductionsQuery = { __typename?: 'Query', productions: Array<{ __typename?: 'Production', id?: any | null, name?: string | null, description?: string | null, endTime?: any | null, startTime?: any | null, videos?: Array<{ __typename?: 'ProductionVideo', priority?: number | null, video?: { __typename?: 'Video', format?: string | null, metadata?: any | null } | null }> | null }> };

export type FindPeopleQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterPersonInput>;
  order?: InputMaybe<Array<OrderPersonInput> | OrderPersonInput>;
}>;


export type FindPeopleQuery = { __typename?: 'Query', personCount: number, people: Array<{ __typename?: 'Person', id?: any | null, name?: string | null, graduation?: any | null, pronouns?: string | null, profilePicture?: { __typename?: 'Image', id?: any | null, name?: string | null, description?: string | null, path?: string | null } | null, users?: Array<{ __typename?: 'User', id?: any | null, username?: string | null }> | null }> };

export type FindProductionTagsQueryVariables = Exact<{
  filter?: InputMaybe<FilterProductionTagInput>;
}>;


export type FindProductionTagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'ProductionTag', id?: any | null, productionId?: any | null }> };

export type FindRecentProductionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  date?: InputMaybe<Scalars['DateTime']>;
}>;


export type FindRecentProductionsQuery = { __typename?: 'Query', productions: Array<{ __typename?: 'Production', id?: any | null, startTime?: any | null, name?: string | null, description?: string | null, thumbnail?: { __typename?: 'Image', id?: any | null, path?: string | null } | null }> };

export type FindRolesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterRoleInput>;
  order?: InputMaybe<Array<OrderRoleInput> | OrderRoleInput>;
}>;


export type FindRolesQuery = { __typename?: 'Query', roleCount: number, roles: Array<{ __typename?: 'Role', id?: any | null, name?: string | null, priority?: number | null }> };

export type FindUpcomingProductionsQueryVariables = Exact<{
  now: Scalars['DateTime'];
  pagination?: InputMaybe<PaginationInput>;
}>;


export type FindUpcomingProductionsQuery = { __typename?: 'Query', productions: Array<{ __typename?: 'Production', id?: any | null, name?: string | null, description?: string | null, startTime?: any | null, videos?: Array<{ __typename?: 'ProductionVideo', priority?: number | null, video?: { __typename?: 'Video', format?: string | null, metadata?: any | null } | null }> | null }> };

export type FindUserPermissionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterUserPermissionInput>;
}>;


export type FindUserPermissionsQuery = { __typename?: 'Query', userPermissionCount: number, permissions: Array<{ __typename?: 'UserPermission', id?: any | null, action?: string | null, subject?: Array<string> | null, fields?: Array<string> | null, conditions?: any | null, inverted?: boolean | null, reason?: string | null }> };

export type FindUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterUserInput>;
  order?: InputMaybe<Array<OrderUserInput> | OrderUserInput>;
}>;


export type FindUsersQuery = { __typename?: 'Query', userCount: number, users: Array<{ __typename?: 'User', id?: any | null, username?: string | null, joined?: any | null, discord?: string | null, mail?: string | null }> };

export type FindVideosQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterVideoInput>;
  order?: InputMaybe<Array<OrderVideoInput> | OrderVideoInput>;
}>;


export type FindVideosQuery = { __typename?: 'Query', videoCount: number, videos: Array<{ __typename?: 'Video', id?: any | null, name?: string | null, metadata?: any | null, format?: string | null }> };

export type GroupDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type GroupDetailsQuery = { __typename?: 'Query', group?: { __typename?: 'Group', id?: any | null, name?: string | null, priority?: number | null, parent?: { __typename?: 'Group', id?: any | null, name?: string | null } | null } | null };

export type ImageCountQueryVariables = Exact<{
  filter?: InputMaybe<FilterImageInput>;
}>;


export type ImageCountQuery = { __typename?: 'Query', imageCount: number };

export type ImageDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type ImageDetailsQuery = { __typename?: 'Query', image?: { __typename?: 'Image', id?: any | null, name?: string | null, description?: string | null, path?: string | null } | null };

export type ListStreamsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListStreamsQuery = { __typename?: 'Query', findManyStream: Array<{ __typename?: 'Stream', id?: any | null, to?: string | null, from?: string | null, message?: string | null }> };

export type LoginLocalMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginLocalMutation = { __typename?: 'Mutation', loginLocal: { __typename?: 'User', id?: any | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logoutSuccess: boolean };

export type PermissionsForQueryVariables = Exact<{
  user?: InputMaybe<Scalars['BigInt']>;
}>;


export type PermissionsForQuery = { __typename?: 'Query', permissions?: Array<{ __typename?: 'GroupPermission', action?: string | null, subject?: Array<string> | null, fields?: Array<string> | null, conditions?: any | null, inverted?: boolean | null, reason?: string | null } | { __typename?: 'UserPermission', action?: string | null, subject?: Array<string> | null, fields?: Array<string> | null, conditions?: any | null, inverted?: boolean | null, reason?: string | null }> | null };

export type PersonDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type PersonDetailsQuery = { __typename?: 'Query', person?: { __typename?: 'Person', id?: any | null, name?: string | null, description?: string | null, graduation?: any | null, pronouns?: string | null, roles?: Array<{ __typename?: 'PersonRole', role?: { __typename?: 'Role', id?: any | null, name?: string | null } | null }> | null, users?: Array<{ __typename?: 'User', id?: any | null, username?: string | null }> | null, profilePicture?: { __typename?: 'Image', id?: any | null, name?: string | null, description?: string | null, path?: string | null } | null, images?: Array<{ __typename?: 'PersonImage', image?: { __typename?: 'Image', id?: any | null, name?: string | null, path?: string | null, description?: string | null } | null }> | null } | null };

export type ProductionCountQueryVariables = Exact<{
  filter?: InputMaybe<FilterProductionInput>;
}>;


export type ProductionCountQuery = { __typename?: 'Query', productionCount: number };

export type ProductionDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type ProductionDetailsQuery = { __typename?: 'Query', production?: { __typename?: 'Production', id?: any | null, categoryId?: any | null, closetLocation?: string | null, closetTime?: any | null, description?: string | null, discordChannel?: string | null, discordServer?: string | null, endTime?: any | null, eventLocation?: string | null, name?: string | null, startTime?: any | null, teamNotes?: string | null, thumbnailId?: any | null, category?: { __typename?: 'Category', id?: any | null, name?: string | null, parentId?: any | null, priority?: number | null } | null, credits?: Array<{ __typename?: 'Credit', id?: any | null, person?: { __typename?: 'Person', id?: any | null, name?: string | null } | null }> | null, images?: Array<{ __typename?: 'ProductionImage', id?: any | null, priority?: number | null, imageId?: any | null, image?: { __typename?: 'Image', id?: any | null, description?: string | null, name?: string | null, path?: string | null } | null }> | null, rsvps?: Array<{ __typename?: 'ProductionRSVP', id?: any | null, notes?: string | null, userId?: any | null }> | null, tags?: Array<{ __typename?: 'ProductionTag', id?: any | null, tag?: string | null }> | null, thumbnail?: { __typename?: 'Image', id?: any | null, name?: string | null, description?: string | null, path?: string | null } | null, videos?: Array<{ __typename?: 'ProductionVideo', id?: any | null, priority?: number | null, video?: { __typename?: 'Video', id?: any | null, name?: string | null, metadata?: any | null } | null }> | null } | null };

export type ReadProductionQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type ReadProductionQuery = { __typename?: 'Query', ReadProduction?: { __typename?: 'Production', name?: string | null, description?: string | null, startTime?: any | null, category?: { __typename?: 'Category', name?: string | null } | null, credits?: Array<{ __typename?: 'Credit', priority?: number | null, title?: string | null, person?: { __typename?: 'Person', name?: string | null } | null }> | null, images?: Array<{ __typename?: 'ProductionImage', priority?: number | null, image?: { __typename?: 'Image', id?: any | null, description?: string | null, path?: string | null } | null }> | null, videos?: Array<{ __typename?: 'ProductionVideo', priority?: number | null, video?: { __typename?: 'Video', name?: string | null, format?: string | null, metadata?: any | null } | null }> | null, tags?: Array<{ __typename?: 'ProductionTag', tag?: string | null }> | null } | null };

export type ResolveGeneralContactSubmissionMutationVariables = Exact<{
  id: Scalars['BigInt'];
  resolve: Scalars['Boolean'];
}>;


export type ResolveGeneralContactSubmissionMutation = { __typename?: 'Mutation', submission: { __typename?: 'ContactSubmission', id?: any | null } };

export type ResolveProductionContactSubmissionMutationVariables = Exact<{
  id: Scalars['BigInt'];
  resolve: Scalars['Boolean'];
}>;


export type ResolveProductionContactSubmissionMutation = { __typename?: 'Mutation', submission: { __typename?: 'ContactSubmission', id?: any | null } };

export type RoleDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type RoleDetailsQuery = { __typename?: 'Query', role?: { __typename?: 'Role', id?: any | null, name?: string | null, priority?: number | null, description?: string | null, displayInMembership?: boolean | null, displayInLeadership?: boolean | null } | null };

export type SearchCategoriesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterCategoryInput>;
  order?: InputMaybe<Array<OrderCategoryInput> | OrderCategoryInput>;
}>;


export type SearchCategoriesQuery = { __typename?: 'Query', categoryCount: number, categories: Array<{ __typename?: 'Category', id?: any | null, name?: string | null }> };

export type SearchGroupsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterGroupInput>;
}>;


export type SearchGroupsQuery = { __typename?: 'Query', groupCount: number, groups: Array<{ __typename?: 'Group', id?: any | null, name?: string | null }> };

export type SearchImagesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterImageInput>;
  order?: InputMaybe<Array<OrderImageInput> | OrderImageInput>;
}>;


export type SearchImagesQuery = { __typename?: 'Query', imageCount: number, images: Array<{ __typename?: 'Image', id?: any | null, name?: string | null, description?: string | null, path?: string | null }> };

export type SearchPeopleQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterPersonInput>;
}>;


export type SearchPeopleQuery = { __typename?: 'Query', personCount: number, people: Array<{ __typename?: 'Person', id?: any | null, name?: string | null }> };

export type SearchProductionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterProductionInput>;
  order?: InputMaybe<Array<OrderProductionInput> | OrderProductionInput>;
}>;


export type SearchProductionsQuery = { __typename?: 'Query', totalProductions: number, productions: Array<{ __typename?: 'Production', description?: string | null, id?: any | null, name?: string | null, startTime?: any | null, teamNotes?: string | null, images?: Array<{ __typename?: 'ProductionImage', id?: any | null, imageId?: any | null }> | null, tags?: Array<{ __typename?: 'ProductionTag', id?: any | null, tag?: string | null }> | null, thumbnail?: { __typename?: 'Image', path?: string | null } | null, videos?: Array<{ __typename?: 'ProductionVideo', id?: any | null, videoId?: any | null }> | null }> };

export type SearchRolesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterRoleInput>;
}>;


export type SearchRolesQuery = { __typename?: 'Query', roleCount: number, roles: Array<{ __typename?: 'Role', id?: any | null, name?: string | null }> };

export type SearchUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterUserInput>;
}>;


export type SearchUsersQuery = { __typename?: 'Query', userCount: number, users: Array<{ __typename?: 'User', id?: any | null, username?: string | null }> };

export type SearchVideosQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterVideoInput>;
  order?: InputMaybe<Array<OrderVideoInput> | OrderVideoInput>;
}>;


export type SearchVideosQuery = { __typename?: 'Query', videoCount: number, videos: Array<{ __typename?: 'Video', id?: any | null, name?: string | null, metadata?: any | null }> };

export type SelfIdQueryVariables = Exact<{ [key: string]: never; }>;


export type SelfIdQuery = { __typename?: 'Query', self?: { __typename?: 'User', id?: any | null } | null };

export type StartStreamMutationVariables = Exact<{
  to: Scalars['String'];
  from: Scalars['String'];
}>;


export type StartStreamMutation = { __typename?: 'Mutation', createStream: { __typename?: 'Stream', from?: string | null, to?: string | null } };

export type StopStreamMutationVariables = Exact<{
  id: Scalars['UUID'];
}>;


export type StopStreamMutation = { __typename?: 'Mutation', deleteStream: { __typename?: 'Stream', id?: any | null } };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateCategoryInput;
}>;


export type UpdateCategoryMutation = { __typename?: 'Mutation', category: { __typename?: 'Category', id?: any | null } };

export type UpdateGroupMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateGroupInput;
}>;


export type UpdateGroupMutation = { __typename?: 'Mutation', group: { __typename?: 'Group', id?: any | null } };

export type UpdateGroupPermissionMutationVariables = Exact<{
  id: Scalars['BigInt'];
  input: UpdateGroupPermissionInput;
}>;


export type UpdateGroupPermissionMutation = { __typename?: 'Mutation', permission: { __typename?: 'GroupPermission', id?: any | null } };

export type UpdatePersonMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdatePersonInput;
}>;


export type UpdatePersonMutation = { __typename?: 'Mutation', person: { __typename?: 'Person', id?: any | null } };

export type UpdateProductionMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateProductionInput;
}>;


export type UpdateProductionMutation = { __typename?: 'Mutation', person: { __typename?: 'Production', id?: any | null } };

export type UpdateProductionImageMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateProductionImageInput;
}>;


export type UpdateProductionImageMutation = { __typename?: 'Mutation', productionImage: { __typename?: 'ProductionImage', id?: any | null } };

export type UpdateProductionVideoMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateProductionVideoInput;
}>;


export type UpdateProductionVideoMutation = { __typename?: 'Mutation', productionVideo: { __typename?: 'ProductionVideo', id?: any | null } };

export type UpdateRoleMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { __typename?: 'Mutation', role: { __typename?: 'Role', id?: any | null } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', user: { __typename?: 'User', id?: any | null } };

export type UpdateUserPermissionMutationVariables = Exact<{
  id: Scalars['BigInt'];
  input: UpdateUserPermissionInput;
}>;


export type UpdateUserPermissionMutation = { __typename?: 'Mutation', permission: { __typename?: 'UserPermission', id?: any | null } };

export type UpdateVideoMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateVideoInput;
}>;


export type UpdateVideoMutation = { __typename?: 'Mutation', video: { __typename?: 'Video', id?: any | null } };

export type UpdateImageMutationVariables = Exact<{
  id: Scalars['BigInt'];
  data: UpdateImageInput;
}>;


export type UpdateImageMutation = { __typename?: 'Mutation', image: { __typename?: 'Image', id?: any | null } };

export type UserDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type UserDetailsQuery = { __typename?: 'Query', user?: { __typename?: 'User', id?: any | null, username?: string | null, joined?: any | null, discord?: string | null, mail?: string | null, person?: { __typename?: 'Person', id?: any | null, name?: string | null } | null, groups?: Array<{ __typename?: 'UserGroup', id?: any | null, group?: { __typename?: 'Group', id?: any | null, name?: string | null, priority?: number | null } | null }> | null, accessLogs?: Array<{ __typename?: 'AccessLog', timestamp?: any | null }> | null } | null };

export type VideoCountQueryVariables = Exact<{
  filter?: InputMaybe<FilterVideoInput>;
}>;


export type VideoCountQuery = { __typename?: 'Query', videoCount: number };

export type VideoDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type VideoDetailsQuery = { __typename?: 'Query', video?: { __typename?: 'Video', id?: any | null, name?: string | null, metadata?: any | null, format?: string | null } | null };


export const CategoryDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CategoryDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"category"},"name":{"kind":"Name","value":"findOneCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<CategoryDetailsQuery, CategoryDetailsQueryVariables>;
export const ContactSubmissionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ContactSubmissionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"submissionDetails"},"name":{"kind":"Name","value":"findOneContactSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"additionalData"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<ContactSubmissionDetailsQuery, ContactSubmissionDetailsQueryVariables>;
export const CreateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"category"},"name":{"kind":"Name","value":"createCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateCategoryMutation, CreateCategoryMutationVariables>;
export const CreateContactSubmissionGeneralDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateContactSubmissionGeneral"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateContactSubmissionGeneralInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createContactSubmissionGeneral"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}]}}]} as unknown as DocumentNode<CreateContactSubmissionGeneralMutation, CreateContactSubmissionGeneralMutationVariables>;
export const CreateContactSubmissionProductionRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateContactSubmissionProductionRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateContactSubmissionProductionRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createContactSubmissionProductionRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}]}]}}]} as unknown as DocumentNode<CreateContactSubmissionProductionRequestMutation, CreateContactSubmissionProductionRequestMutationVariables>;
export const CreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"group"},"name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
export const CreateGroupPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGroupPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"createGroupPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateGroupPermissionMutation, CreateGroupPermissionMutationVariables>;
export const CreateImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"image"},"name":{"kind":"Name","value":"createImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateImageMutation, CreateImageMutationVariables>;
export const CreatePersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"person"},"name":{"kind":"Name","value":"createPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePersonMutation, CreatePersonMutationVariables>;
export const CreatePersonImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePersonImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"personId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"imageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"personImage"},"name":{"kind":"Name","value":"createPersonImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"personId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"personId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"imageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"imageId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreatePersonImageMutation, CreatePersonImageMutationVariables>;
export const CreateProductionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProduction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"production"},"name":{"kind":"Name","value":"createProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateProductionMutation, CreateProductionMutationVariables>;
export const CreateProductionImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProductionImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductionImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"image"},"name":{"kind":"Name","value":"createProductionImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateProductionImageMutation, CreateProductionImageMutationVariables>;
export const CreateProductionTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProductionTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductionTagInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"tag"},"name":{"kind":"Name","value":"createProductionTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateProductionTagMutation, CreateProductionTagMutationVariables>;
export const CreateProductionVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateProductionVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateProductionVideoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"createProductionVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateProductionVideoMutation, CreateProductionVideoMutationVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const CreateUserGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"userGroup"},"name":{"kind":"Name","value":"createUserGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserGroupMutation, CreateUserGroupMutationVariables>;
export const CreateUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"createUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserPermissionMutation, CreateUserPermissionMutationVariables>;
export const CreateVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVideoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"createVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateVideoMutation, CreateVideoMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"category"},"name":{"kind":"Name","value":"deleteCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const DeleteContactSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteContactSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteContactSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteContactSubmissionMutation, DeleteContactSubmissionMutationVariables>;
export const DeleteGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"group"},"name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const DeleteGroupPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroupPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"deleteGroupPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteGroupPermissionMutation, DeleteGroupPermissionMutationVariables>;
export const DeleteImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"image"},"name":{"kind":"Name","value":"deleteImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteImageMutation, DeleteImageMutationVariables>;
export const DeletePersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"person"},"name":{"kind":"Name","value":"deletePerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeletePersonMutation, DeletePersonMutationVariables>;
export const DeletePersonImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePersonImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"personImage"},"name":{"kind":"Name","value":"deletePersonImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeletePersonImageMutation, DeletePersonImageMutationVariables>;
export const DeleteProductionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProduction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"production"},"name":{"kind":"Name","value":"deleteProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteProductionMutation, DeleteProductionMutationVariables>;
export const DeleteProductionImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProductionImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productionImage"},"name":{"kind":"Name","value":"deleteProductionImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteProductionImageMutation, DeleteProductionImageMutationVariables>;
export const DeleteProductionTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProductionTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productionTag"},"name":{"kind":"Name","value":"deleteProductionTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteProductionTagMutation, DeleteProductionTagMutationVariables>;
export const DeleteProductionVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProductionVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productionVideo"},"name":{"kind":"Name","value":"deleteProductionVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteProductionVideoMutation, DeleteProductionVideoMutationVariables>;
export const DeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"deleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const DeleteUserGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUserGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"userGroup"},"name":{"kind":"Name","value":"deleteUserGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteUserGroupMutation, DeleteUserGroupMutationVariables>;
export const DeleteUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"deleteUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteUserPermissionMutation, DeleteUserPermissionMutationVariables>;
export const DeleteVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"deleteVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteVideoMutation, DeleteVideoMutationVariables>;
export const FindAccessLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAccessLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterAccessLogInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessLogCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"accessLogs"},"name":{"kind":"Name","value":"findManyAccessLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<FindAccessLogsQuery, FindAccessLogsQueryVariables>;
export const FindAlertLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAlertLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterAlertLogInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"alertLogCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"alertLogs"},"name":{"kind":"Name","value":"findManyAlertLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<FindAlertLogsQuery, FindAlertLogsQueryVariables>;
export const FindAllProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterProductionInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderProductionInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalProductions"},"name":{"kind":"Name","value":"productionCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"productions"},"name":{"kind":"Name","value":"findManyProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FindAllProductionsQuery, FindAllProductionsQueryVariables>;
export const FindAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterAuditLogInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"auditLogs"},"name":{"kind":"Name","value":"findManyAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<FindAuditLogsQuery, FindAuditLogsQueryVariables>;
export const FindCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterCategoryInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderCategoryInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"categories"},"name":{"kind":"Name","value":"findManyCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}}]} as unknown as DocumentNode<FindCategoriesQuery, FindCategoriesQueryVariables>;
export const FindContactSubmissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindContactSubmissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterContactSubmissionInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderContactSubmissionInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalSubmissions"},"name":{"kind":"Name","value":"contactSubmissionCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"contactSubmissions"},"name":{"kind":"Name","value":"findManyContactSubmission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"resolved"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<FindContactSubmissionsQuery, FindContactSubmissionsQueryVariables>;
export const FindGroupPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindGroupPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterGroupPermissionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupPermissionCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"permissions"},"name":{"kind":"Name","value":"findManyGroupPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"inverted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<FindGroupPermissionsQuery, FindGroupPermissionsQueryVariables>;
export const FindGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterGroupInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderGroupInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"groups"},"name":{"kind":"Name","value":"findManyGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FindGroupsQuery, FindGroupsQueryVariables>;
export const FindImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindImages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderImageInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"images"},"name":{"kind":"Name","value":"findManyImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<FindImagesQuery, FindImagesQueryVariables>;
export const FindLiveProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindLiveProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productions"},"name":{"kind":"Name","value":"findManyProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"endTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"startTime"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Asc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"priority"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}}]}}]}}]} as unknown as DocumentNode<FindLiveProductionsQuery, FindLiveProductionsQueryVariables>;
export const FindPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindPeople"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterPersonInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderPersonInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"people"},"name":{"kind":"Name","value":"findManyPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"graduation"}},{"kind":"Field","name":{"kind":"Name","value":"pronouns"}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<FindPeopleQuery, FindPeopleQueryVariables>;
export const FindProductionTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindProductionTags"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterProductionTagInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"tags"},"name":{"kind":"Name","value":"findManyProductionTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"productionId"}}]}}]}}]} as unknown as DocumentNode<FindProductionTagsQuery, FindProductionTagsQueryVariables>;
export const FindRecentProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindRecentProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productions"},"name":{"kind":"Name","value":"findManyProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"startTime"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"endTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<FindRecentProductionsQuery, FindRecentProductionsQueryVariables>;
export const FindRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterRoleInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderRoleInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"roles"},"name":{"kind":"Name","value":"findManyRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}}]} as unknown as DocumentNode<FindRolesQuery, FindRolesQueryVariables>;
export const FindUpcomingProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUpcomingProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productions"},"name":{"kind":"Name","value":"findManyProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"startTime"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"gt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"startTime"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Asc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"priority"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}}]}}]}}]} as unknown as DocumentNode<FindUpcomingProductionsQuery, FindUpcomingProductionsQueryVariables>;
export const FindUserPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUserPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterUserPermissionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPermissionCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"permissions"},"name":{"kind":"Name","value":"findManyUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"inverted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<FindUserPermissionsQuery, FindUserPermissionsQueryVariables>;
export const FindUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterUserInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderUserInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"users"},"name":{"kind":"Name","value":"findManyUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}},{"kind":"Field","name":{"kind":"Name","value":"discord"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}}]} as unknown as DocumentNode<FindUsersQuery, FindUsersQueryVariables>;
export const FindVideosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindVideos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterVideoInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderVideoInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"videos"},"name":{"kind":"Name","value":"findManyVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]} as unknown as DocumentNode<FindVideosQuery, FindVideosQueryVariables>;
export const GroupDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"group"},"name":{"kind":"Name","value":"findOneGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GroupDetailsQuery, GroupDetailsQueryVariables>;
export const ImageCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ImageCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterImageInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]}]}}]} as unknown as DocumentNode<ImageCountQuery, ImageCountQueryVariables>;
export const ImageDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ImageDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"image"},"name":{"kind":"Name","value":"findOneImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<ImageDetailsQuery, ImageDetailsQueryVariables>;
export const ListStreamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListStreams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findManyStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ListStreamsQuery, ListStreamsQueryVariables>;
export const LoginLocalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginLocal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginLocal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LoginLocalMutation, LoginLocalMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"logoutSuccess"},"name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const PermissionsForDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PermissionsFor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permissions"},"name":{"kind":"Name","value":"permissionsFor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GroupPermission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"inverted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPermission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"inverted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]}}]} as unknown as DocumentNode<PermissionsForQuery, PermissionsForQueryVariables>;
export const PersonDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PersonDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"person"},"name":{"kind":"Name","value":"findOnePerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"graduation"}},{"kind":"Field","name":{"kind":"Name","value":"pronouns"}},{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profilePicture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}}]} as unknown as DocumentNode<PersonDetailsQuery, PersonDetailsQueryVariables>;
export const ProductionCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"productionCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterProductionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"productionCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]}]}}]} as unknown as DocumentNode<ProductionCountQuery, ProductionCountQueryVariables>;
export const ProductionDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ProductionDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"production"},"name":{"kind":"Name","value":"findOneProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"closetLocation"}},{"kind":"Field","name":{"kind":"Name","value":"closetTime"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"discordChannel"}},{"kind":"Field","name":{"kind":"Name","value":"discordServer"}},{"kind":"Field","name":{"kind":"Name","value":"endTime"}},{"kind":"Field","name":{"kind":"Name","value":"eventLocation"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"imageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"rsvps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teamNotes"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailId"}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ProductionDetailsQuery, ProductionDetailsQueryVariables>;
export const ReadProductionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ReadProduction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"ReadProduction"},"name":{"kind":"Name","value":"findOneProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"video"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}}]}}]}}]} as unknown as DocumentNode<ReadProductionQuery, ReadProductionQueryVariables>;
export const ResolveGeneralContactSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResolveGeneralContactSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resolve"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"submission"},"name":{"kind":"Name","value":"updateContactSubmissionGeneral"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resolved"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resolve"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ResolveGeneralContactSubmissionMutation, ResolveGeneralContactSubmissionMutationVariables>;
export const ResolveProductionContactSubmissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResolveProductionContactSubmission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resolve"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"submission"},"name":{"kind":"Name","value":"updateContactSubmissionProductionRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"resolved"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resolve"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ResolveProductionContactSubmissionMutation, ResolveProductionContactSubmissionMutationVariables>;
export const RoleDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoleDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"findOneRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"displayInMembership"}},{"kind":"Field","name":{"kind":"Name","value":"displayInLeadership"}}]}}]}}]} as unknown as DocumentNode<RoleDetailsQuery, RoleDetailsQueryVariables>;
export const SearchCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterCategoryInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderCategoryInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"categoryCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"categories"},"name":{"kind":"Name","value":"findManyCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchCategoriesQuery, SearchCategoriesQueryVariables>;
export const SearchGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterGroupInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"groups"},"name":{"kind":"Name","value":"findManyGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchGroupsQuery, SearchGroupsQueryVariables>;
export const SearchImagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchImages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterImageInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderImageInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"images"},"name":{"kind":"Name","value":"findManyImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<SearchImagesQuery, SearchImagesQueryVariables>;
export const SearchPeopleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchPeople"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterPersonInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"personCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"people"},"name":{"kind":"Name","value":"findManyPerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchPeopleQuery, SearchPeopleQueryVariables>;
export const SearchProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterProductionInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderProductionInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"totalProductions"},"name":{"kind":"Name","value":"productionCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"productions"},"name":{"kind":"Name","value":"findManyProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"images"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"teamNotes"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}},{"kind":"Field","name":{"kind":"Name","value":"videos"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"videoId"}}]}}]}}]}}]} as unknown as DocumentNode<SearchProductionsQuery, SearchProductionsQueryVariables>;
export const SearchRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterRoleInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"roles"},"name":{"kind":"Name","value":"findManyRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchRolesQuery, SearchRolesQueryVariables>;
export const SearchUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"users"},"name":{"kind":"Name","value":"findManyUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<SearchUsersQuery, SearchUsersQueryVariables>;
export const SearchVideosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchVideos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterVideoInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"order"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OrderVideoInput"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"videos"},"name":{"kind":"Name","value":"findManyVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"Variable","name":{"kind":"Name","value":"order"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}}]}}]}}]} as unknown as DocumentNode<SearchVideosQuery, SearchVideosQueryVariables>;
export const SelfIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SelfId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"self"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SelfIdQuery, SelfIdQueryVariables>;
export const StartStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStream"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}}]}}]} as unknown as DocumentNode<StartStreamMutation, StartStreamMutationVariables>;
export const StopStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStream"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<StopStreamMutation, StopStreamMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"category"},"name":{"kind":"Name","value":"updateCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const UpdateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"group"},"name":{"kind":"Name","value":"updateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateGroupMutation, UpdateGroupMutationVariables>;
export const UpdateGroupPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGroupPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"updateGroupPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateGroupPermissionMutation, UpdateGroupPermissionMutationVariables>;
export const UpdatePersonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePerson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePersonInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"person"},"name":{"kind":"Name","value":"updatePerson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdatePersonMutation, UpdatePersonMutationVariables>;
export const UpdateProductionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProduction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"person"},"name":{"kind":"Name","value":"updateProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateProductionMutation, UpdateProductionMutationVariables>;
export const UpdateProductionImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductionImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductionImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productionImage"},"name":{"kind":"Name","value":"updateProductionImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateProductionImageMutation, UpdateProductionImageMutationVariables>;
export const UpdateProductionVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductionVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProductionVideoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productionVideo"},"name":{"kind":"Name","value":"updateProductionVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateProductionVideoMutation, UpdateProductionVideoMutationVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"updateUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserPermissionMutation, UpdateUserPermissionMutationVariables>;
export const UpdateVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVideoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"updateVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateVideoMutation, UpdateVideoMutationVariables>;
export const UpdateImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"image"},"name":{"kind":"Name","value":"updateImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateImageMutation, UpdateImageMutationVariables>;
export const UserDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"findOneUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}},{"kind":"Field","name":{"kind":"Name","value":"discord"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<UserDetailsQuery, UserDetailsQueryVariables>;
export const VideoCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VideoCount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterVideoInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]}]}}]} as unknown as DocumentNode<VideoCountQuery, VideoCountQueryVariables>;
export const VideoDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VideoDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"findOneVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]} as unknown as DocumentNode<VideoDetailsQuery, VideoDetailsQueryVariables>;