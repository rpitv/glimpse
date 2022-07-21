import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
  File: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export enum AbilityActions {
  Create = 'create',
  Delete = 'delete',
  Manage = 'manage',
  Read = 'read',
  Update = 'update'
}

export enum AbilitySubjects {
  AccessLog = 'AccessLog',
  AlertLog = 'AlertLog',
  Asset = 'Asset',
  AuditLog = 'AuditLog',
  BlogPost = 'BlogPost',
  Category = 'Category',
  ContactSubmission = 'ContactSubmission',
  ContactSubmissionAssignee = 'ContactSubmissionAssignee',
  Credit = 'Credit',
  Group = 'Group',
  GroupPermission = 'GroupPermission',
  Image = 'Image',
  Person = 'Person',
  PersonImage = 'PersonImage',
  Production = 'Production',
  ProductionImage = 'ProductionImage',
  ProductionRsvp = 'ProductionRSVP',
  ProductionTag = 'ProductionTag',
  ProductionVideo = 'ProductionVideo',
  Redirect = 'Redirect',
  Role = 'Role',
  User = 'User',
  UserGroup = 'UserGroup',
  UserPermission = 'UserPermission',
  Video = 'Video',
  Vote = 'Vote',
  VoteResponse = 'VoteResponse'
}

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
  severity: AlertLogSeverity;
  timestamp: Scalars['DateTime'];
};

export type AlertLogCreateInput = {
  message: Scalars['String'];
  severity: AlertLogSeverity;
};

export enum AlertLogSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Info = 'INFO',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

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
  lastKnownHandlerId?: InputMaybe<Scalars['ID']>;
  lastKnownLocation?: InputMaybe<Scalars['String']>;
  modelNumber?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['ID']>;
  purchaseDate?: InputMaybe<Scalars['DateTime']>;
  purchaseLocation?: InputMaybe<Scalars['String']>;
  purchasePrice?: InputMaybe<Scalars['Int']>;
  serialNumber?: InputMaybe<Scalars['String']>;
  tag?: InputMaybe<Scalars['Int']>;
};

export type AssetUpdateInput = {
  isLost?: InputMaybe<Scalars['Boolean']>;
  lastKnownHandlerId?: InputMaybe<Scalars['ID']>;
  lastKnownLocation?: InputMaybe<Scalars['String']>;
  modelNumber?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['ID']>;
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
  metadata?: Maybe<Scalars['JSONObject']>;
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
  authorId: Scalars['ID'];
  content: Scalars['String'];
  title: Scalars['String'];
};

export type BlogPostUpdateInput = {
  authorDisplayName?: InputMaybe<Scalars['String']>;
  authorId?: InputMaybe<Scalars['ID']>;
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
  parentId?: InputMaybe<Scalars['ID']>;
  /** Defaults to 0. */
  priority?: Scalars['Int'];
};

export type CategoryUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['ID']>;
  priority?: InputMaybe<Scalars['Int']>;
};

export type ContactSubmission = {
  __typename?: 'ContactSubmission';
  additionalData?: Maybe<Scalars['JSONObject']>;
  assignees?: Maybe<Array<ContactSubmissionAssignee>>;
  email: Scalars['EmailAddress'];
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
  submissionId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type ContactSubmissionCreateInput = {
  additionalData?: InputMaybe<Scalars['JSONObject']>;
  email: Scalars['EmailAddress'];
  name: Scalars['String'];
};

export type ContactSubmissionUpdateInput = {
  additionalData?: InputMaybe<Scalars['JSONObject']>;
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
  personId: Scalars['ID'];
  /** Defaults to 0. */
  priority?: Scalars['Int'];
  productionId: Scalars['ID'];
  title?: InputMaybe<Scalars['String']>;
};

export type CreditUpdateInput = {
  personId?: InputMaybe<Scalars['ID']>;
  priority?: InputMaybe<Scalars['Int']>;
  productionId?: InputMaybe<Scalars['ID']>;
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
  parentId?: InputMaybe<Scalars['ID']>;
  /** Defaults to 0. */
  priority?: Scalars['Int'];
};

export type GroupPermission = {
  __typename?: 'GroupPermission';
  action: Scalars['String'];
  conditions?: Maybe<Scalars['JSONObject']>;
  fields?: Maybe<Array<Scalars['String']>>;
  group: Group;
  id: Scalars['ID'];
  inverted: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
};

export type GroupPermissionCreateInput = {
  action: Scalars['String'];
  conditions?: InputMaybe<Scalars['JSONObject']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  groupId: Scalars['ID'];
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
};

export type GroupPermissionUpdateInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSONObject']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
};

export type GroupUpdateInput = {
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['ID']>;
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
  /** Create a new BlogPost with the given input values. */
  createBlogPost: BlogPost;
  /** Create a new Category with the given input values. */
  createCategory: Category;
  /** Create a new ContactSubmission with the given input values. */
  createContactSubmission: ContactSubmission;
  /** Create a new ContactSubmissionAssignee with the given input values. */
  createContactSubmissionAssignee: ContactSubmissionAssignee;
  /** Create a new Credit with the given input values. */
  createCredit: Credit;
  /** Create a new Group with the given input values. */
  createGroup: Group;
  /** Create a new GroupPermission with the given input values. */
  createGroupPermission: GroupPermission;
  /** Create a new Image with the given input values. */
  createImage: Image;
  /** Create a new Person with the given input values. */
  createPerson: Person;
  /** Create a new PersonImage with the given input values. */
  createPersonImage: PersonImage;
  /** Create a new Production with the given input values. */
  createProduction: Production;
  /** Create a new ProductionImage with the given input values. */
  createProductionImage: ProductionImage;
  /** Create a new ProductionRSVP with the given input values. */
  createProductionRSVP: ProductionRsvp;
  /** Create a new ProductionTag with the given input values. */
  createProductionTag: ProductionTag;
  /** Create a new ProductionVideo with the given input values. */
  createProductionVideo: ProductionVideo;
  /** Create a new Redirect with the given input values. */
  createRedirect: Redirect;
  /** Create a new Role with the given input values. */
  createRole: Role;
  /** Create a new User with the given input values. */
  createUser: User;
  /** Create a new user-group pair with the given input values. */
  createUserGroup: UserGroup;
  /** Create a new UserPermission with the given input values. The User creating the Permission must also have the Permission that's being created. */
  createUserPermission: UserPermission;
  /** Create a new Video with the given input values. */
  createVideo: Video;
  /** Create a new Vote with the given input values. */
  createVote: Vote;
  /** Create a new VoteResponse with the given input values. */
  createVoteResponse: VoteResponse;
  /** Delete the Asset with the provided ID, if it exists. Returns null if the Asset does not exist, otherwise returns the deleted object. */
  deleteAsset?: Maybe<Asset>;
  /** Delete the BlogPost with the provided ID, if it exists. Returns null if the BlogPost does not exist, otherwise returns the deleted object. */
  deleteBlogPost?: Maybe<BlogPost>;
  /** Delete the Category with the provided ID, if it exists. Returns null if the Category does not exist, otherwise returns the deleted object. */
  deleteCategory?: Maybe<Category>;
  /** Delete the ContactSubmission with the provided ID, if it exists. Returns null if the ContactSubmission does not exist, otherwise returns the deleted object. */
  deleteContactSubmission?: Maybe<ContactSubmission>;
  /** Delete the ContactSubmissionAssignee with the provided ID, if it exists. Returns null if the ContactSubmissionAssignee does not exist, otherwise returns the deleted object. */
  deleteContactSubmissionAssignee?: Maybe<ContactSubmissionAssignee>;
  /** Delete the Credit with the provided ID, if it exists. Returns null if the Credit does not exist, otherwise returns the deleted object. */
  deleteCredit?: Maybe<Credit>;
  /** Delete the Group with the provided ID, if it exists. Returns null if the Group does not exist, otherwise returns the deleted object. */
  deleteGroup?: Maybe<Group>;
  /** Delete the GroupPermission with the provided ID, if it exists. Returns null if the GroupPermission does not exist, otherwise returns the deleted object. */
  deleteGroupPermission?: Maybe<GroupPermission>;
  /** Delete the Image with the provided ID, if it exists. Returns null if the Image does not exist, otherwise returns the deleted object. */
  deleteImage?: Maybe<Image>;
  /** Delete the Person with the provided ID, if it exists. Returns null if the Person does not exist, otherwise returns the deleted object. */
  deletePerson?: Maybe<Person>;
  /** Delete the PersonImage with the provided ID, if it exists. Returns null if the PersonImage does not exist, otherwise returns the deleted object. */
  deletePersonImage?: Maybe<PersonImage>;
  /** Delete the Production with the provided ID, if it exists. Returns null if the Production does not exist, otherwise returns the deleted object. */
  deleteProduction?: Maybe<Production>;
  /** Delete the ProductionImage with the provided ID, if it exists. Returns null if the ProductionImage does not exist, otherwise returns the deleted object. */
  deleteProductionImage?: Maybe<ProductionImage>;
  /** Delete the ProductionRSVP with the provided ID, if it exists. Returns null if the ProductionRSVP does not exist, otherwise returns the deleted object. */
  deleteProductionRSVP?: Maybe<ProductionRsvp>;
  /** Delete the ProductionTag with the provided ID, if it exists. Returns null if the ProductionTag does not exist, otherwise returns the deleted object. */
  deleteProductionTag?: Maybe<ProductionTag>;
  /** Delete the ProductionVideo with the provided ID, if it exists. Returns null if the ProductionVideo does not exist, otherwise returns the deleted object. */
  deleteProductionVideo?: Maybe<ProductionVideo>;
  /** Delete the Redirect with the provided ID, if it exists. Returns null if the Redirect does not exist, otherwise returns the deleted object. */
  deleteRedirect?: Maybe<Redirect>;
  /** Delete the Role with the provided ID, if it exists. Returns null if the Role does not exist, otherwise returns the deleted object. */
  deleteRole?: Maybe<Role>;
  /** Delete the User with the provided ID, if it exists. Returns null if the User does not exist, otherwise returns the deleted object. */
  deleteUser?: Maybe<User>;
  /** Delete the UserGroup with the provided ID, if it exists. Returns null if the UserGroup does not exist, otherwise returns the deleted object. */
  deleteUserGroup?: Maybe<UserGroup>;
  /** Delete the UserPermission with the provided ID, if it exists. Returns null if the UserPermission does not exist, otherwise returns the deleted object. */
  deleteUserPermission?: Maybe<UserPermission>;
  /** Delete the Video with the provided ID, if it exists. Returns null if the Video does not exist, otherwise returns the deleted object. */
  deleteVideo?: Maybe<Video>;
  /** Delete the Vote with the provided ID, if it exists. Returns null if the Vote does not exist, otherwise returns the deleted object. */
  deleteVote?: Maybe<Vote>;
  /** Delete the VoteResponse with the provided ID, if it exists. Returns null if the VoteResponse does not exist, otherwise returns the deleted object. */
  deleteVoteResponse?: Maybe<VoteResponse>;
  /** Log out the current user. The current session cookie is deleted, even if the user wasn't logged in. Returns true if successful, false otherwise. */
  logout: Scalars['Boolean'];
  /** Update the Asset with the provided ID to have the passed values. Throws an error if Asset with ID does not exist. */
  updateAsset: Asset;
  /** Update the BlogPost with the provided ID to have the passed values. Throws an error if BlogPost with ID does not exist. */
  updateBlogPost: BlogPost;
  /** Update the Category with the provided ID to have the passed values. Throws an error if Category with ID does not exist. */
  updateCategory: Category;
  /** Update the ContactSubmission with the provided ID to have the passed values. Throws an error if ContactSubmission with ID does not exist. */
  updateContactSubmission: ContactSubmission;
  /** Update the Credit with the provided ID to have the passed values. Throws an error if Credit with ID does not exist. */
  updateCredit: Credit;
  /** Update the Group with the provided ID to have the passed values. Throws an error if Group with ID does not exist. */
  updateGroup: Group;
  /** Update the GroupPermission with the provided ID to have the passed values. Throws an error if GroupPermission with ID does not exist. */
  updateGroupPermission: GroupPermission;
  /** Update the Image with the provided ID to have the passed values. Throws an error if Image with ID does not exist. */
  updateImage: Image;
  /** Update the Person with the provided ID to have the passed values. Throws an error if Person with ID does not exist. */
  updatePerson: Person;
  /** Update the PersonImage with the provided ID to have the passed values. Throws an error if PersonImage with ID does not exist. */
  updatePersonImage: PersonImage;
  /** Update the Production with the provided ID to have the passed values. Throws an error if Production with ID does not exist. */
  updateProduction: Production;
  /** Update the ProductionImage with the provided ID to have the passed values. Throws an error if ProductionImage with ID does not exist. */
  updateProductionImage: ProductionImage;
  /** Update the ProductionRSVP with the provided ID to have the passed values. Throws an error if ProductionRSVP with ID does not exist. */
  updateProductionRSVP: ProductionRsvp;
  /** Update the ProductionVideo with the provided ID to have the passed values. Throws an error if ProductionVideo with ID does not exist. */
  updateProductionVideo: ProductionVideo;
  /** Update the Redirect with the provided ID to have the passed values. Throws an error if Redirect with ID does not exist. */
  updateRedirect: Redirect;
  /** Update the Role with the provided ID to have the passed values. Throws an error if Role with ID does not exist. */
  updateRole: Role;
  /** Update the User with the provided ID to have the passed values. Throws an error if User with ID does not exist. */
  updateUser: User;
  /** Update the UserPermission with the provided ID to have the passed values. Throws an error if UserPermission with ID does not exist. The User updating the Permission must also have the Permission that's being update to and from.. */
  updateUserPermission: UserPermission;
  /** Update the Video with the provided ID to have the passed values. Throws an error if Video with ID does not exist. */
  updateVideo: Video;
  /** Update the Vote with the provided ID to have the passed values. Throws an error if Vote with ID does not exist. */
  updateVote: Vote;
  /** Update the VoteResponse with the provided ID to have the passed values. Throws an error if VoteResponse with ID does not exist. */
  updateVoteResponse: VoteResponse;
  /** Attempt to login with the given credentials. Returns true if successful, false otherwise. The current session cookie is updated to be for the newly logged in user, or a new cookie is created if one wasn't sent with the request. */
  usernameLogin: Scalars['Boolean'];
};


export type MutationCreateAlertLogArgs = {
  input: AlertLogCreateInput;
};


export type MutationCreateAssetArgs = {
  input: AssetCreateInput;
};


export type MutationCreateBlogPostArgs = {
  input: BlogPostCreateInput;
};


export type MutationCreateCategoryArgs = {
  input: CategoryCreateInput;
};


export type MutationCreateContactSubmissionArgs = {
  input: ContactSubmissionCreateInput;
};


export type MutationCreateContactSubmissionAssigneeArgs = {
  input: ContactSubmissionAssigneeCreateInput;
};


export type MutationCreateCreditArgs = {
  input: CreditCreateInput;
};


export type MutationCreateGroupArgs = {
  input: GroupCreateInput;
};


export type MutationCreateGroupPermissionArgs = {
  input: GroupPermissionCreateInput;
};


export type MutationCreateImageArgs = {
  input: ImageCreateInput;
};


export type MutationCreatePersonArgs = {
  input: PersonCreateInput;
};


export type MutationCreatePersonImageArgs = {
  input: PersonImageCreateInput;
};


export type MutationCreateProductionArgs = {
  input: ProductionCreateInput;
};


export type MutationCreateProductionImageArgs = {
  input: ProductionImageCreateInput;
};


export type MutationCreateProductionRsvpArgs = {
  input: ProductionRsvpCreateInput;
};


export type MutationCreateProductionTagArgs = {
  input: ProductionTagCreateInput;
};


export type MutationCreateProductionVideoArgs = {
  input: ProductionVideoCreateInput;
};


export type MutationCreateRedirectArgs = {
  input: RedirectCreateInput;
};


export type MutationCreateRoleArgs = {
  input: RoleCreateInput;
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


export type MutationCreateVideoArgs = {
  input: VideoCreateInput;
};


export type MutationCreateVoteArgs = {
  input: VoteCreateInput;
};


export type MutationCreateVoteResponseArgs = {
  input: VoteResponseCreateInput;
};


export type MutationDeleteAssetArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteBlogPostArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteContactSubmissionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteContactSubmissionAssigneeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteCreditArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteGroupArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteGroupPermissionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteImageArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePersonArgs = {
  id: Scalars['ID'];
};


export type MutationDeletePersonImageArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductionArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductionImageArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductionRsvpArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductionTagArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteProductionVideoArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRedirectArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRoleArgs = {
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


export type MutationDeleteVideoArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVoteArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteVoteResponseArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAssetArgs = {
  id: Scalars['ID'];
  input: AssetUpdateInput;
};


export type MutationUpdateBlogPostArgs = {
  id: Scalars['ID'];
  input: BlogPostUpdateInput;
};


export type MutationUpdateCategoryArgs = {
  id: Scalars['ID'];
  input: CategoryUpdateInput;
};


export type MutationUpdateContactSubmissionArgs = {
  id: Scalars['ID'];
  input: ContactSubmissionUpdateInput;
};


export type MutationUpdateCreditArgs = {
  id: Scalars['ID'];
  input: CreditUpdateInput;
};


export type MutationUpdateGroupArgs = {
  id: Scalars['ID'];
  input: GroupUpdateInput;
};


export type MutationUpdateGroupPermissionArgs = {
  id: Scalars['ID'];
  input: GroupPermissionUpdateInput;
};


export type MutationUpdateImageArgs = {
  id: Scalars['ID'];
  input: ImageUpdateInput;
};


export type MutationUpdatePersonArgs = {
  id: Scalars['ID'];
  input: PersonUpdateInput;
};


export type MutationUpdatePersonImageArgs = {
  id: Scalars['ID'];
  input: PersonImageUpdateInput;
};


export type MutationUpdateProductionArgs = {
  id: Scalars['ID'];
  input: ProductionUpdateInput;
};


export type MutationUpdateProductionImageArgs = {
  id: Scalars['ID'];
  input: ProductionImageUpdateInput;
};


export type MutationUpdateProductionRsvpArgs = {
  id: Scalars['ID'];
  input: ProductionRsvpUpdateInput;
};


export type MutationUpdateProductionVideoArgs = {
  id: Scalars['ID'];
  input: ProductionVideoUpdateInput;
};


export type MutationUpdateRedirectArgs = {
  id: Scalars['ID'];
  input: RedirectUpdateInput;
};


export type MutationUpdateRoleArgs = {
  id: Scalars['ID'];
  input: RoleUpdateInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  input: UserUpdateInput;
};


export type MutationUpdateUserPermissionArgs = {
  id: Scalars['ID'];
  input: UserPermissionUpdateInput;
};


export type MutationUpdateVideoArgs = {
  id: Scalars['ID'];
  input: VideoUpdateInput;
};


export type MutationUpdateVoteArgs = {
  id: Scalars['ID'];
  input: VoteUpdateInput;
};


export type MutationUpdateVoteResponseArgs = {
  id: Scalars['ID'];
  input: VoteResponseUpdateInput;
};


export type MutationUsernameLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};

/**
 * Input type used for pagination in multi-document searches. Offset-based OR cursor-based pagination can be
 * used, or both. This is fed to Prisma. https://www.prisma.io/docs/concepts/components/prisma-client/pagination
 */
export type Pagination = {
  /**
   * ID of the first document to fetch. If the document doesn't exist or you don't have permission, then it's location
   * is "unknown", and an empty list will always be returned, since we cannot determine what comes before/after it. As
   * an example, if you have 10 documents numbered 1-10 and pass {cursor: 5, take: 3}, then you will receive documents
   * 5-7.
   */
  cursor?: InputMaybe<Scalars['ID']>;
  /**
   * Number of documents to skip over. Must be an integer greater than or equal to 0 when used. As an example, if you
   * have 10 documents numbered 1-10 and pass {skip: 5, take: 3}, then you will receive documents 6-8.
   */
  skip?: InputMaybe<Scalars['Int']>;
  /** Number of documents to fetch. Must be an integer greater than or equal to 1 when used. */
  take: Scalars['Int'];
};

/**
 * A Permission is either a UserPermission or a GroupPermission. This is useful when retrieving what permissions
 * a user has if you don't care whether they're inherited from a group or not.
 */
export type Permission = GroupPermission | UserPermission;

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
  imageId: Scalars['ID'];
  personId: Scalars['ID'];
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
  categoryId?: InputMaybe<Scalars['ID']>;
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
  thumbnailId?: InputMaybe<Scalars['ID']>;
};

export type ProductionImage = {
  __typename?: 'ProductionImage';
  id: Scalars['ID'];
  image: Image;
  priority: Scalars['Int'];
  production: Production;
};

export type ProductionImageCreateInput = {
  imageId: Scalars['ID'];
  /** Defaults to 0. */
  priority?: Scalars['Int'];
  productionId: Scalars['ID'];
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
  willAttend?: Maybe<ProductionRsvpAttendanceState>;
};

export enum ProductionRsvpAttendanceState {
  Maybe = 'MAYBE',
  No = 'NO',
  Yes = 'YES'
}

export type ProductionRsvpCreateInput = {
  notes?: InputMaybe<Scalars['String']>;
  productionId: Scalars['ID'];
  userId: Scalars['ID'];
  willAttend?: InputMaybe<ProductionRsvpAttendanceState>;
};

export type ProductionRsvpUpdateInput = {
  notes?: InputMaybe<Scalars['String']>;
  willAttend?: InputMaybe<ProductionRsvpAttendanceState>;
};

export type ProductionTag = {
  __typename?: 'ProductionTag';
  id: Scalars['ID'];
  production: Production;
  tag: Scalars['String'];
};

export type ProductionTagCreateInput = {
  productionId: Scalars['ID'];
  tag: Scalars['String'];
};

export type ProductionUpdateInput = {
  categoryId?: InputMaybe<Scalars['ID']>;
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
  thumbnailId?: InputMaybe<Scalars['ID']>;
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
  productionId: Scalars['ID'];
  videoId: Scalars['ID'];
};

export type ProductionVideoUpdateInput = {
  priority?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  /** Get a list of access logs which the user currently has access to read. */
  findManyAccessLog: Array<AccessLog>;
  /** Get a list of alert logs which the user currently has access to read. */
  findManyAlertLog: Array<AlertLog>;
  /** Get a list of assets which the user currently has access to read. */
  findManyAsset: Array<Asset>;
  /** Get a list of audit logs which the user currently has access to read. */
  findManyAuditLog: Array<AuditLog>;
  /** Get a list of blog posts which the user currently has access to read. */
  findManyBlogPost: Array<BlogPost>;
  /** Get a list of categories which the user currently has access to read. */
  findManyCategory: Array<Category>;
  /** Get a list of contact submissions which the user currently has access to read. */
  findManyContactSubmission: Array<ContactSubmission>;
  /** Get a list of contact submission assignees which the user currently has access to read. */
  findManyContactSubmissionAssignee: Array<ContactSubmissionAssignee>;
  /** Get a list of credits which the user currently has access to read. */
  findManyCredit: Array<Credit>;
  /** Get a list of groups which the user currently has access to read. */
  findManyGroup: Array<Group>;
  /** Get a list of images which the user currently has access to read. */
  findManyImage: Array<Image>;
  /** Get a list of people which the user currently has access to read. */
  findManyPerson: Array<Person>;
  /** Get a list of person-image pairs which the user currently has access to read. */
  findManyPersonImage: Array<PersonImage>;
  /** Get a list of productions which the user currently has access to read. */
  findManyProduction: Array<Production>;
  /** Get a list of production-image pairs which the user currently has access to read. */
  findManyProductionImage: Array<ProductionImage>;
  /** Get a list of production RSVPs which the user currently has access to read. */
  findManyProductionRSVP: Array<ProductionRsvp>;
  /** Get a list of production-video pairs which the user currently has access to read. */
  findManyProductionVideo: Array<ProductionVideo>;
  /** Get a list of redirects which the user currently has access to read. */
  findManyRedirect: Array<Redirect>;
  /** Get a list of roles which the user currently has access to read. */
  findManyRole: Array<Role>;
  /** Get a list of users which the user currently has access to read. */
  findManyUser: Array<User>;
  /** Get a list of videos which the user currently has access to read. */
  findManyVideo: Array<Video>;
  /** Get a list of votes which the user currently has access to read. */
  findManyVote: Array<Vote>;
  /** Get a single access log, given its ID, or null if that access log does not exist. */
  findOneAccessLog?: Maybe<AccessLog>;
  /** Get a single alert log, given its ID, or null if that alert log does not exist. */
  findOneAlertLog?: Maybe<AlertLog>;
  /** Get a single asset, given its ID, or null if that asset does not exist. */
  findOneAsset?: Maybe<Asset>;
  /** Get a single audit log, given its ID, or null if that audit log does not exist. */
  findOneAuditLog?: Maybe<AuditLog>;
  /** Get a single blog post, given its ID, or null if that blog post does not exist. */
  findOneBlogPost?: Maybe<BlogPost>;
  /** Get a single category, given its ID, or null if that category does not exist. */
  findOneCategory?: Maybe<Category>;
  /** Get a single contact submission, given its ID, or null if that contact submission does not exist. */
  findOneContactSubmission?: Maybe<ContactSubmission>;
  /** Get a single contact submission assignee, given its ID, or null if that contact submission assignee does not exist. */
  findOneContactSubmissionAssignee?: Maybe<ContactSubmissionAssignee>;
  /** Get a single credit, given its ID, or null if that credit does not exist. */
  findOneCredit?: Maybe<Credit>;
  /** Get a single group, given its ID, or null if that group does not exist. */
  findOneGroup?: Maybe<Group>;
  /** Get a single group permission, given its ID, or null if that group permission does not exist. */
  findOneGroupPermission?: Maybe<GroupPermission>;
  /** Get a single image, given its ID, or null if that image does not exist. */
  findOneImage?: Maybe<Image>;
  /** Get a single person, given its ID, or null if that person does not exist. */
  findOnePerson?: Maybe<Person>;
  /** Get a single person-image pair, given its ID, or null if that person-image pair does not exist. */
  findOnePersonImage?: Maybe<PersonImage>;
  /** Get a single production, given its ID, or null if that production does not exist. */
  findOneProduction?: Maybe<Production>;
  /** Get a single production-image pair, given its ID, or null if that production-image pair does not exist. */
  findOneProductionImage?: Maybe<ProductionImage>;
  /** Get a single production RSVP, given its ID, or null if that production RSVP does not exist. */
  findOneProductionRSVP?: Maybe<ProductionRsvp>;
  /** Get a single production tag, given its ID, or null if that production tag does not exist. */
  findOneProductionTag?: Maybe<ProductionTag>;
  /** Get a single production-video pair, given its ID, or null if that production-video pair does not exist. */
  findOneProductionVideo?: Maybe<ProductionVideo>;
  /** Get a single production, given its ID, or null if that redirect does not exist. */
  findOneRedirect?: Maybe<Redirect>;
  /** Get a single role, given its ID, or null if that role does not exist. */
  findOneRole?: Maybe<Role>;
  /** Get a single user given their ID, or null if that user does not exist. */
  findOneUser?: Maybe<User>;
  /** Get a single user-group pair, given its ID, or null if that user-group pair does not exist. */
  findOneUserGroup?: Maybe<UserGroup>;
  /** Get a single user permission, given its ID, or null if that user permission does not exist. */
  findOneUserPermission?: Maybe<UserPermission>;
  /** Get a single video, given its ID, or null if that video does not exist. */
  findOneVideo?: Maybe<Video>;
  /** Get a single vote, given its ID, or null if that vote does not exist. */
  findOneVote?: Maybe<Vote>;
  /** Get a single vote response, given its ID, or null if that vote response does not exist. */
  findOneVoteResponse?: Maybe<VoteResponse>;
  /** Get the permissions that the current user has, including permissions inherited from groups. */
  permissionsFor: Array<Permission>;
};


export type QueryFindManyAccessLogArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyAlertLogArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyAssetArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyAuditLogArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyBlogPostArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyCategoryArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyContactSubmissionArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyContactSubmissionAssigneeArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyCreditArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyGroupArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyImageArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyPersonArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyPersonImageArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyProductionArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyProductionImageArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyProductionRsvpArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyProductionVideoArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyRedirectArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyRoleArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyUserArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyVideoArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindManyVoteArgs = {
  pagination?: InputMaybe<Pagination>;
};


export type QueryFindOneAccessLogArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneAlertLogArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneAssetArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneAuditLogArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneBlogPostArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneCategoryArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneContactSubmissionArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneContactSubmissionAssigneeArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneCreditArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneGroupArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneGroupPermissionArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneImageArgs = {
  id: Scalars['ID'];
};


export type QueryFindOnePersonArgs = {
  id: Scalars['ID'];
};


export type QueryFindOnePersonImageArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneProductionArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneProductionImageArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneProductionRsvpArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneProductionTagArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneProductionVideoArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneRedirectArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneRoleArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneUserArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneUserGroupArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneUserPermissionArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneVideoArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneVoteArgs = {
  id: Scalars['ID'];
};


export type QueryFindOneVoteResponseArgs = {
  id: Scalars['ID'];
};


export type QueryPermissionsForArgs = {
  user?: InputMaybe<Scalars['ID']>;
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
  personId: Scalars['ID'];
  /** Defaults to 0. */
  priority?: Scalars['Int'];
  startTime?: InputMaybe<Scalars['DateTime']>;
};

export type RoleUpdateInput = {
  endTime?: InputMaybe<Scalars['DateTime']>;
  name?: InputMaybe<Scalars['String']>;
  personId?: InputMaybe<Scalars['ID']>;
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
  mail: Scalars['EmailAddress'];
  permissions?: Maybe<Array<UserPermission>>;
  person?: Maybe<Person>;
  productionRsvps?: Maybe<Array<ProductionRsvp>>;
  username: Scalars['String'];
  voteResponses?: Maybe<Array<VoteResponse>>;
};

export type UserCreateInput = {
  discord?: InputMaybe<Scalars['String']>;
  mail: Scalars['EmailAddress'];
  password?: InputMaybe<Scalars['String']>;
  personId?: InputMaybe<Scalars['ID']>;
  username: Scalars['String'];
};

export type UserGroup = {
  __typename?: 'UserGroup';
  group: Group;
  id: Scalars['ID'];
  user: User;
};

export type UserGroupCreateInput = {
  groupId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type UserPermission = {
  __typename?: 'UserPermission';
  action: Scalars['String'];
  conditions?: Maybe<Scalars['JSONObject']>;
  fields?: Maybe<Array<Scalars['String']>>;
  id: Scalars['ID'];
  inverted: Scalars['Boolean'];
  reason?: Maybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
  user: User;
};

export type UserPermissionCreateInput = {
  action: Scalars['String'];
  conditions?: InputMaybe<Scalars['JSONObject']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject: Array<Scalars['String']>;
  userId: Scalars['ID'];
};

export type UserPermissionUpdateInput = {
  action?: InputMaybe<Scalars['String']>;
  conditions?: InputMaybe<Scalars['JSONObject']>;
  fields?: InputMaybe<Array<Scalars['String']>>;
  inverted?: InputMaybe<Scalars['Boolean']>;
  reason?: InputMaybe<Scalars['String']>;
  subject?: InputMaybe<Array<Scalars['String']>>;
};

export type UserUpdateInput = {
  discord?: InputMaybe<Scalars['String']>;
  mail?: InputMaybe<Scalars['EmailAddress']>;
  password?: InputMaybe<Scalars['String']>;
  personId?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};

export type Video = {
  __typename?: 'Video';
  format: VideoFormat;
  id: Scalars['ID'];
  metadata?: Maybe<Scalars['JSONObject']>;
  name: Scalars['String'];
  videoFor?: Maybe<Array<ProductionVideo>>;
};

export type VideoCreateInput = {
  format: VideoFormat;
  metadata?: InputMaybe<Scalars['JSONObject']>;
  name: Scalars['String'];
};

export enum VideoFormat {
  Embed = 'EMBED',
  Hls = 'HLS',
  Rtmp = 'RTMP'
}

export type VideoUpdateInput = {
  format?: InputMaybe<VideoFormat>;
  metadata?: InputMaybe<Scalars['JSONObject']>;
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
  userId: Scalars['ID'];
  voteId: Scalars['ID'];
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

export type FindAllProductionsQueryVariables = Exact<{
  pagination?: InputMaybe<Pagination>;
}>;


export type FindAllProductionsQuery = { __typename?: 'Query', productions: Array<{ __typename?: 'Production', id: string, name: string, startTime?: any | null, description?: string | null, thumbnail?: { __typename?: 'Image', path: string } | null }> };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logoutSuccess: boolean };

export type UsernameLoginMutationVariables = Exact<{
  username: Scalars['String'];
  password: Scalars['String'];
}>;


export type UsernameLoginMutation = { __typename?: 'Mutation', loginSuccess: boolean };


export const FindAllProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productions"},"name":{"kind":"Name","value":"findManyProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<FindAllProductionsQuery, FindAllProductionsQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"logoutSuccess"},"name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const UsernameLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UsernameLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"loginSuccess"},"name":{"kind":"Name","value":"usernameLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<UsernameLoginMutation, UsernameLoginMutationVariables>;