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
  /** Unique ID for this AccessLog. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** IP address which the access that generated this access log originated from. */
  ip?: Maybe<Scalars['String']>;
  /** Name of the service which this access log is a record for. */
  service?: Maybe<Scalars['String']>;
  /** DateTime at which this access log was generated. */
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  /** ID of the user who initiated this access log. */
  userId?: Maybe<Scalars['BigInt']>;
};

export enum AccessLogOrderableFields {
  Id = 'id',
  Service = 'service',
  Timestamp = 'timestamp'
}

export type AlertLog = {
  __typename?: 'AlertLog';
  /** Unique ID for this alert. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** The message logged by this alert. This is what is displayed to the user(s) viewing alerts. */
  message?: Maybe<Scalars['String']>;
  /**
   * Severity of this alert. Currently can be any value, but should probably be one of the following:
   * - "INFO"
   * - "WARN"
   * - "ERROR"
   * A Postgres enum could be added in the future to enforce this. This could also be a number, which would allow
   * for easier filtering of alerts by severity.
   */
  severity?: Maybe<Scalars['String']>;
  /** DateTime at which this alert was generated. */
  timestamp?: Maybe<Scalars['DateTime']>;
};

export enum AlertLogOrderableFields {
  Id = 'id',
  Message = 'message',
  Severity = 'severity',
  Timestamp = 'timestamp'
}

/**
 * Assets are the physical objects that are property of RPI TV, or are otherwise managed and tracked by RPI TV.
 *
 * Due to the club's rapidly revolving door of members, it's easy for equipment to get lost or forgotten about. The
 * Asset system is intended to assist in keeping track of what assets RPI TV owns, where they were purchased, how
 * much they were purchased for, and where they are being used (and by whom).
 *
 * Assets currently do not have a "checked in" or "checked out" status. Instead, each asset has a last known location,
 * as well as the last known user who was using the asset. When an asset is "checked out", the user will scan the
 * location's bar code and the asset's QR code, which will update the asset's last known location and last known
 * handler. It is presumed that an asset will not be checked out for long, or if it is, the user who checked it out
 * will have it in their possession at all times, so they will know the status of it while it is in their possession.
 * When the user wants to "check in" the asset, the same process is done as when they checked it out.
 */
export type Asset = {
  __typename?: 'Asset';
  children?: Maybe<Array<Asset>>;
  /** Unique ID for this asset. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /**
   * Flag whether this asset is lost or not. The asset is usually considered lost if the asset is not at the last
   * known location and the last known handler cannot account for its current location.
   */
  isLost?: Maybe<Scalars['Boolean']>;
  lastKnownHandler?: Maybe<User>;
  /** The user ID of the user who last checked this asset out/in. */
  lastKnownHandlerId?: Maybe<Scalars['BigInt']>;
  /**
   * The last known location of this asset. This should be the last location that the asset was checked out
   * from/checked into.
   */
  lastKnownLocation?: Maybe<Scalars['String']>;
  /**
   * The model number of this asset. While the asset name is a human-readable name for quickly identifying what the
   * asset is for, the model number is defined by the manufacturer, and is used to identify the exact model of the
   * asset. This is useful for future club members who wish to re-purchase an asset or find out more information
   * about it, such as the manual. Not all assets will have a model number, in which case this can be set to null.
   */
  modelNumber?: Maybe<Scalars['String']>;
  /** The name of this asset. This isn't necessarily the same as the model name, but it should be a human-readable */
  name?: Maybe<Scalars['String']>;
  /** Optional notes about this asset. */
  notes?: Maybe<Scalars['String']>;
  parent?: Maybe<Asset>;
  /**
   * Some assets are part of a larger set of assets. For example, a camera may be part of a camera kit, which
   * includes a camera, a lens, a battery, and a bag. It doesn't make sense to require the user to scan the QR code
   * for all of these assets. Instead, the kit itself can be scanned and all child assets will be updated. Note that
   * scanning a child will not update a parent, nor it's siblings. If the asset is not part of a set, this can be
   * set to null.
   */
  parentId?: Maybe<Scalars['BigInt']>;
  /**
   * DateTime at which this asset was purchased. This doesn't have to be super specific, but gives future club
   * members a rough idea of how old a piece of equipment is, and whether it may still be under warranty. This
   * should be the date that the asset was purchased, not the date that it was received. If the purchase date is
   * unknown, it can be set to null.
   */
  purchaseDate?: Maybe<Scalars['DateTime']>;
  /**
   * The location where this asset was purchased. This is useful for new club members who wish to re-purchase an
   * asset, and want to know where to purchase it from. If the purchase location is unknown, it can be set to null.
   * Purchase location should be as specific as possible, and can be either a physical location or a website URL.
   */
  purchaseLocation?: Maybe<Scalars['String']>;
  /**
   * The price which this asset was purchased for in pennies. This is useful for new club members who wish to
   * re-purchase an asset, and want to know the worth of the asset, for example. If an asset wasn't purchased,
   * (i.e. it was donated), the purchase price can be set to 0. If the purchase price is unknown, it can also be set
   * to null.
   */
  purchasePrice?: Maybe<Scalars['Int']>;
  /**
   * The serial number of this asset. Serial numbers are useful for warranty or support tickets with the manufacturer.
   * Most assets will likely have a serial number somewhere, however it may be hard to find, or doesn't necessarily
   * make sense to log it. In this case, the serial number can be set to null.
   */
  serialNumber?: Maybe<Scalars['String']>;
  /**
   * Unique tag number for this asset. This is what is printed/written/labeled on the asset itself. Sometimes, assets
   * are not tagged (e.g. due to physical size constraints), however they should still have a tag number.
   */
  tag?: Maybe<Scalars['Int']>;
};


/**
 * Assets are the physical objects that are property of RPI TV, or are otherwise managed and tracked by RPI TV.
 *
 * Due to the club's rapidly revolving door of members, it's easy for equipment to get lost or forgotten about. The
 * Asset system is intended to assist in keeping track of what assets RPI TV owns, where they were purchased, how
 * much they were purchased for, and where they are being used (and by whom).
 *
 * Assets currently do not have a "checked in" or "checked out" status. Instead, each asset has a last known location,
 * as well as the last known user who was using the asset. When an asset is "checked out", the user will scan the
 * location's bar code and the asset's QR code, which will update the asset's last known location and last known
 * handler. It is presumed that an asset will not be checked out for long, or if it is, the user who checked it out
 * will have it in their possession at all times, so they will know the status of it while it is in their possession.
 * When the user wants to "check in" the asset, the same process is done as when they checked it out.
 */
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

/**
 * Audit logs are used to track changes to resources within the database. At the moment, Prisma does not have an elegant
 * way of generating these automatically with the user's ID. It would be possible to generate automatically if we
 * weren't logging the user who made the change using Prisma middleware or extensions. For now, they have to be
 * logged manually using {@link PrismaServicegenAuditLog }.
 *
 * All automatic generation solutions that I came up with involved violating type safety, relying on private Prisma
 * interfaces, and/or were so obtuse and hacky that it wasn't worth it.
 */
export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String'];
  details: Array<Scalars['String']>;
  /** Unique ID for this audit log. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /**
   * Identifier of the resource that was changed. This should be the ID of the resource. If {@link  #subject} is null,
   * then this should also be null.
   */
  identifier?: Maybe<Scalars['BigInt']>;
  /**
   * Custom message to display to the user when this audit log is displayed. This should be a human-readable message.
   * This will be combined with the automatically generated message based on {@link  #prevValue}.
   */
  message?: Maybe<Scalars['String']>;
  /**
   * The type of subject which was changed. This should be one of the values in {@link AbilitySubjects }. If the change
   * was to a resource that is not a subject, this should be null.
   */
  subject?: Maybe<Scalars['String']>;
  /** DateTime at which this audit log was created. */
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  /** User ID of the user that initiated this audit log. */
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
  /**
   * The name to display for the author, as opposed to the actual username/person name. This allows for posting
   * blogs as a "group".
   */
  authorDisplayName?: Maybe<Scalars['String']>;
  /** The User ID of the author of this blog post. */
  authorId?: Maybe<Scalars['BigInt']>;
  /** The actual body of the blog post. */
  content?: Maybe<Scalars['String']>;
  /** Unique ID for this blog post. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** DateTime at which this blog post was posted. */
  postedAt?: Maybe<Scalars['DateTime']>;
  /** The title of the blog post. */
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
  /** Unique ID for this category. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** The name of this category */
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Category>;
  /** The ID of the parent category, or null if this is a top-level category. */
  parentId?: Maybe<Scalars['BigInt']>;
  /** The priority of this category. Categories with a higher priority should be displayed first. */
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
  /** Additional metadata about this ContactSubmission. Unstructured JSON data. */
  additionalData?: Maybe<Scalars['JSON']>;
  /** The main body of the ContactSubmission. */
  body?: Maybe<Scalars['String']>;
  /** The email address for how to reach the person who submitted this ContactSubmission. */
  email?: Maybe<Scalars['String']>;
  /** Unique ID for this ContactSubmission. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** The name of the person who submitted this ContactSubmission. */
  name?: Maybe<Scalars['String']>;
  /** Flag whether this contact submission has been resolved or not. */
  resolved?: Maybe<Scalars['Boolean']>;
  /** The subject/title of the ContactSubmission. */
  subject?: Maybe<Scalars['String']>;
  /** Timestamp at which this ContactSubmission was submitted. */
  timestamp?: Maybe<Scalars['DateTime']>;
};

export enum ContactSubmissionOrderableFields {
  Id = 'id',
  Timestamp = 'timestamp'
}

/** Input type for createAlertLog mutation */
export type CreateAlertLogInput = {
  /** The message logged by this alert. This is what is displayed to the user(s) viewing alerts. */
  message?: InputMaybe<Scalars['String']>;
  /**
   * Severity of this alert. Currently can be any value, but should probably be one of the following:
   * - "INFO"
   * - "WARN"
   * - "ERROR"
   * A Postgres enum could be added in the future to enforce this. This could also be a number, which would allow
   * for easier filtering of alerts by severity.
   */
  severity?: InputMaybe<Scalars['String']>;
};

/** Input type for createAsset mutation */
export type CreateAssetInput = {
  /**
   * Flag whether this asset is lost or not. The asset is usually considered lost if the asset is not at the last
   * known location and the last known handler cannot account for its current location.
   */
  isLost?: InputMaybe<Scalars['Boolean']>;
  /** The user ID of the user who last checked this asset out/in. */
  lastKnownHandlerId?: InputMaybe<Scalars['BigInt']>;
  /**
   * The last known location of this asset. This should be the last location that the asset was checked out
   * from/checked into.
   */
  lastKnownLocation?: InputMaybe<Scalars['String']>;
  /**
   * The model number of this asset. While the asset name is a human-readable name for quickly identifying what the
   * asset is for, the model number is defined by the manufacturer, and is used to identify the exact model of the
   * asset. This is useful for future club members who wish to re-purchase an asset or find out more information
   * about it, such as the manual. Not all assets will have a model number, in which case this can be set to null.
   */
  modelNumber?: InputMaybe<Scalars['String']>;
  /** The name of this asset. This isn't necessarily the same as the model name, but it should be a human-readable */
  name?: InputMaybe<Scalars['String']>;
  /** Optional notes about this asset. */
  notes?: InputMaybe<Scalars['String']>;
  /**
   * Some assets are part of a larger set of assets. For example, a camera may be part of a camera kit, which
   * includes a camera, a lens, a battery, and a bag. It doesn't make sense to require the user to scan the QR code
   * for all of these assets. Instead, the kit itself can be scanned and all child assets will be updated. Note that
   * scanning a child will not update a parent, nor it's siblings. If the asset is not part of a set, this can be
   * set to null.
   */
  parentId?: InputMaybe<Scalars['BigInt']>;
  /**
   * DateTime at which this asset was purchased. This doesn't have to be super specific, but gives future club
   * members a rough idea of how old a piece of equipment is, and whether it may still be under warranty. This
   * should be the date that the asset was purchased, not the date that it was received. If the purchase date is
   * unknown, it can be set to null.
   */
  purchaseDate?: InputMaybe<Scalars['DateTime']>;
  /**
   * The location where this asset was purchased. This is useful for new club members who wish to re-purchase an
   * asset, and want to know where to purchase it from. If the purchase location is unknown, it can be set to null.
   * Purchase location should be as specific as possible, and can be either a physical location or a website URL.
   */
  purchaseLocation?: InputMaybe<Scalars['String']>;
  /**
   * The price which this asset was purchased for in pennies. This is useful for new club members who wish to
   * re-purchase an asset, and want to know the worth of the asset, for example. If an asset wasn't purchased,
   * (i.e. it was donated), the purchase price can be set to 0. If the purchase price is unknown, it can also be set
   * to null.
   */
  purchasePrice?: InputMaybe<Scalars['Int']>;
  /**
   * The serial number of this asset. Serial numbers are useful for warranty or support tickets with the manufacturer.
   * Most assets will likely have a serial number somewhere, however it may be hard to find, or doesn't necessarily
   * make sense to log it. In this case, the serial number can be set to null.
   */
  serialNumber?: InputMaybe<Scalars['String']>;
  /**
   * Unique tag number for this asset. This is what is printed/written/labeled on the asset itself. Sometimes, assets
   * are not tagged (e.g. due to physical size constraints), however they should still have a tag number.
   */
  tag?: InputMaybe<Scalars['Int']>;
};

/** Input type for createBlogPost mutation */
export type CreateBlogPostInput = {
  /**
   * The name to display for the author, as opposed to the actual username/person name. This allows for posting
   * blogs as a "group".
   */
  authorDisplayName?: InputMaybe<Scalars['String']>;
  /** The User ID of the author of this blog post. */
  authorId?: InputMaybe<Scalars['BigInt']>;
  /** The actual body of the blog post. */
  content?: InputMaybe<Scalars['String']>;
  /** DateTime at which this blog post was posted. */
  postedAt?: InputMaybe<Scalars['DateTime']>;
  /** The title of the blog post. */
  title?: InputMaybe<Scalars['String']>;
};

/** Input type for createCategory mutation */
export type CreateCategoryInput = {
  /** The name of this category */
  name?: InputMaybe<Scalars['String']>;
  /** The ID of the parent category, or null if this is a top-level category. */
  parentId?: InputMaybe<Scalars['BigInt']>;
  /** The priority of this category. Categories with a higher priority should be displayed first. */
  priority?: InputMaybe<Scalars['Int']>;
};

/** Input type for createContactSubmission mutation */
export type CreateContactSubmissionInput = {
  /** Additional metadata about this ContactSubmission. Unstructured JSON data. */
  additionalData?: InputMaybe<Scalars['JSON']>;
  /** The main body of the ContactSubmission. */
  body?: InputMaybe<Scalars['String']>;
  /** The email address for how to reach the person who submitted this ContactSubmission. */
  email?: InputMaybe<Scalars['String']>;
  /** The name of the person who submitted this ContactSubmission. */
  name?: InputMaybe<Scalars['String']>;
  /** Flag whether this contact submission has been resolved or not. */
  resolved?: InputMaybe<Scalars['Boolean']>;
  /** The subject/title of the ContactSubmission. */
  subject?: InputMaybe<Scalars['String']>;
};

/** Input type for createCredit mutation */
export type CreateCreditInput = {
  /** The ID of the person this Credit belongs to. */
  personId?: InputMaybe<Scalars['BigInt']>;
  /** The priority of this Credit. Credits with a higher priority should be displayed first. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The ID of the production this Credit is for. */
  productionId?: InputMaybe<Scalars['BigInt']>;
  /** The title of this Credit */
  title?: InputMaybe<Scalars['String']>;
};

/** Input type for createGroup mutation */
export type CreateGroupInput = {
  /** The display name for this Group */
  name?: InputMaybe<Scalars['String']>;
  /** The ID of the parent of this Group. If null, this Group is a top-level Group. */
  parentId?: InputMaybe<Scalars['BigInt']>;
  /**
   * The priority of this Group. Groups with a higher priority will override the permissions of Groups with a lower
   * priority.
   */
  priority?: InputMaybe<Scalars['Int']>;
};

/** Input type for createGroupPermission mutation */
export type CreateGroupPermissionInput = {
  /** The action for this GroupPermission. Should be a valid action within {@link AbilityAction }. */
  action?: InputMaybe<Scalars['String']>;
  /** Any conditional checks for this GroupPermission. */
  conditions?: InputMaybe<Scalars['JSON']>;
  /** The set of fields for this GroupPermission. */
  fields?: InputMaybe<Array<Scalars['String']>>;
  /** ID of the group which this GroupPermission is for. */
  groupId?: InputMaybe<Scalars['BigInt']>;
  /** True if this GroupPermission is a denying permission. False if this GroupPermission is an allowing permission. */
  inverted?: InputMaybe<Scalars['Boolean']>;
  /** The reason for this GroupPermission if this GroupPermission has {@link  #inverted} equal to true. */
  reason?: InputMaybe<Scalars['String']>;
  /** The set of subjects for this GroupPermission. Should be all valid subjects within {@link AbilitySubjects }. */
  subject?: InputMaybe<Array<Scalars['String']>>;
};

/** Input type for createImage mutation */
export type CreateImageInput = {
  /** The description for this image. */
  description?: InputMaybe<Scalars['String']>;
  /** The display name for this image. */
  name?: InputMaybe<Scalars['String']>;
  /** The path/URI for this image. */
  path?: InputMaybe<Scalars['String']>;
};

/** Input type for createPersonImage mutation */
export type CreatePersonImageInput = {
  /** ID of the image this PersonImage is associated with. */
  imageId?: InputMaybe<Scalars['BigInt']>;
  /** ID of the person this PersonImage is associated with. */
  personId?: InputMaybe<Scalars['BigInt']>;
  /** Priority of this PersonImage. Higher priority images should be displayed first. */
  priority?: InputMaybe<Scalars['Int']>;
};

/** Input type for createPerson mutation */
export type CreatePersonInput = {
  /** An "about me" section for this Person. */
  description?: InputMaybe<Scalars['String']>;
  /**
   * The date that this Person intends on graduating from the university. This allows for automated role removals,
   * as well as displaying the Person's class year on their profile.
   */
  graduation?: InputMaybe<Scalars['DateTime']>;
  /** The name (or pseudonym) for this Person. Should likely be in the format "First Last". */
  name?: InputMaybe<Scalars['String']>;
  /** ID of the image which should be used for this Person's profile picture. */
  profilePictureId?: InputMaybe<Scalars['BigInt']>;
  /** The pronouns for this Person. Should likely be in the format "they/them". Optional. */
  pronouns?: InputMaybe<Scalars['String']>;
};

/** Input type for createPersonRole mutation */
export type CreatePersonRoleInput = {
  /** End date of when this PersonRole association should no longer be active. */
  endTime?: InputMaybe<Scalars['DateTime']>;
  /** ID of the person this PersonRole is associated with. */
  personId?: InputMaybe<Scalars['BigInt']>;
  /** ID of the role this PersonRole is associated with. */
  roleId?: InputMaybe<Scalars['BigInt']>;
  /** Start date of when this PersonRole association should begin. */
  startTime?: InputMaybe<Scalars['DateTime']>;
};

/** Input type for createProductionImage mutation */
export type CreateProductionImageInput = {
  /** ID of the image this ProductionImage is associated with. */
  imageId?: InputMaybe<Scalars['BigInt']>;
  /** The priority of this ProductionImage. Higher priority ProductionImages should appear before lower priority ones. */
  priority?: InputMaybe<Scalars['Int']>;
  /** ID of the production this ProductionImage is associated with. */
  productionId?: InputMaybe<Scalars['BigInt']>;
};

/** Input type for createProduction mutation */
export type CreateProductionInput = {
  /** The ID of the category which this Production belongs to. */
  categoryId?: InputMaybe<Scalars['BigInt']>;
  /** The closet meeting location for club members to meet at before the Production. */
  closetLocation?: InputMaybe<Scalars['String']>;
  /** The time that club members should meet at the closet location before the Production. */
  closetTime?: InputMaybe<Scalars['DateTime']>;
  /** The Description of this Production */
  description?: InputMaybe<Scalars['String']>;
  /**
   * The ID of the Discord channel within the Discord server that messages related to this Production should be sent
   * to.
   */
  discordChannel?: InputMaybe<Scalars['String']>;
  /** The ID of the Discord server that messages related to this Production should be sent to. */
  discordServer?: InputMaybe<Scalars['String']>;
  /**
   * The expected end time of this Production. This is used, in combination with start time, to determine which
   * Productions are live.
   */
  endTime?: InputMaybe<Scalars['DateTime']>;
  /** The location of the event for this Production. */
  eventLocation?: InputMaybe<Scalars['String']>;
  /** The title/name of this Production */
  name?: InputMaybe<Scalars['String']>;
  /**
   * The expected start time of this Production. This is used, in combination with end time, to determine which
   * Productions are live.
   */
  startTime?: InputMaybe<Scalars['DateTime']>;
  /** Any notes that the team has about this Production. Can be markup. */
  teamNotes?: InputMaybe<Scalars['String']>;
  /** The ID of the Image which should be used as the thumbnail for this Production. */
  thumbnailId?: InputMaybe<Scalars['BigInt']>;
};

/** Input type for createProductionRSVP mutation */
export type CreateProductionRsvpInput = {
  /** Any additional notes provided by the User, officers, or producers. */
  notes?: InputMaybe<Scalars['String']>;
  /** ID of the Production that the User is RSVPing for. */
  productionId?: InputMaybe<Scalars['BigInt']>;
  /** ID of the User that is RSVPing for the Production. */
  userId?: InputMaybe<Scalars['BigInt']>;
  /** The User's response to the Production's RSVP. Should be "yes", "no", or "maybe". */
  willAttend?: InputMaybe<Scalars['String']>;
};

/** Input type for createProductionTag mutation */
export type CreateProductionTagInput = {
  /** ID of the Production that this tag is associated with. */
  productionId?: InputMaybe<Scalars['BigInt']>;
  /** This tag's value. */
  tag?: InputMaybe<Scalars['String']>;
};

/** Input type for createProductionVideo mutation */
export type CreateProductionVideoInput = {
  /** The priority of this ProductionVideo. Higher priority ProductionVideos should appear before lower priority ones. */
  priority?: InputMaybe<Scalars['Int']>;
  /** ID of the person this ProductionVideo is associated with. */
  productionId?: InputMaybe<Scalars['BigInt']>;
  /** ID of the video this ProductionVideo is associated with. */
  videoId?: InputMaybe<Scalars['BigInt']>;
};

/** Input type for createRedirect mutation */
export type CreateRedirectInput = {
  /** The date and time at which this Redirect expires. If null, this Redirect never expires. */
  expires?: InputMaybe<Scalars['DateTime']>;
  /** The key used in URLs to access this Redirect. */
  key?: InputMaybe<Scalars['String']>;
  /** The URL which this Redirect redirects to. */
  location?: InputMaybe<Scalars['String']>;
};

/** Input type for createRole mutation */
export type CreateRoleInput = {
  /** The optional description of this role. May be what people within this role are responsible for, for example. */
  description?: InputMaybe<Scalars['String']>;
  /** Flag for whether this Role should be displayed in the leadership section on the website's "About Us" page. */
  displayInLeadership?: InputMaybe<Scalars['Boolean']>;
  /** Flag for whether this Role should be displayed in the membership section on the website's "About Us" page. */
  displayInMembership?: InputMaybe<Scalars['Boolean']>;
  /** The name of this role. */
  name?: InputMaybe<Scalars['String']>;
  /** Priority of this Role when displayed on the "About Us" page or next to other Role's on a Person's profile. */
  priority?: InputMaybe<Scalars['Int']>;
};

/** Input type for createCategory mutation */
export type CreateStreamInput = {
  /** The location this stream is being pulled from. */
  from?: InputMaybe<Scalars['String']>;
  /** The location this stream is being pushed to. */
  to?: InputMaybe<Scalars['String']>;
};

/** Input type for createUserGroup mutation */
export type CreateUserGroupInput = {
  /** ID of the group this UserGroup is associated with. */
  groupId?: InputMaybe<Scalars['BigInt']>;
  /** ID of the user this UserGroup is associated with. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** Input type for createUser mutation */
export type CreateUserInput = {
  /** Discord account ID for this user, or null if the user does not have a linked Discord account. */
  discord?: InputMaybe<Scalars['String']>;
  /** Email address for this user. */
  mail?: InputMaybe<Scalars['String']>;
  /** The password to set for this user */
  password?: InputMaybe<Scalars['String']>;
  /** Attached Person's ID, or null if this user does not have a linked Person. */
  personId?: InputMaybe<Scalars['BigInt']>;
  /**
   * Unique username for this user. Must be less than or equal to 8 characters in length and must be alphanumeric.
   * Recommended to be the user's RCS ID.
   */
  username?: InputMaybe<Scalars['String']>;
};

/** Input type for createUserPermission mutation */
export type CreateUserPermissionInput = {
  /** The action for this UserPermission. Should be a valid action within {@link AbilityAction }. */
  action?: InputMaybe<Scalars['String']>;
  /** Any conditional checks for this UserPermission. */
  conditions?: InputMaybe<Scalars['JSON']>;
  /** The set of fields for this UserPermission. */
  fields?: InputMaybe<Array<Scalars['String']>>;
  /** True if this UserPermission is a denying permission. False if this UserPermission is an allowing permission. */
  inverted?: InputMaybe<Scalars['Boolean']>;
  /** The reason for this UserPermission if this UserPermission has {@link  #inverted} equal to true. */
  reason?: InputMaybe<Scalars['String']>;
  /** The set of subjects for this UserPermission. Should be all valid subjects within {@link AbilitySubjects }. */
  subject?: InputMaybe<Array<Scalars['String']>>;
  /** ID of the user which this UserPermission is for. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/** Input type for createVideo mutation */
export type CreateVideoInput = {
  /** The format for this Video. Probably either "EMBED", "RTMP", or "HLS". */
  format?: InputMaybe<Scalars['String']>;
  /**
   * All additional data about this video. This is an unstructured JSON object. The data will vary depending on the
   * format of the video.
   */
  metadata?: InputMaybe<Scalars['JSON']>;
  /** The display name for this Video. */
  name?: InputMaybe<Scalars['String']>;
};

/** Input type for createVote mutation */
export type CreateVoteInput = {
  /** Additional describing information about this vote. */
  description?: InputMaybe<Scalars['String']>;
  /** Timestamp at which this vote closes and no more responses will be accepted. */
  expires?: InputMaybe<Scalars['DateTime']>;
  /** An array of available options for responses to this vote. */
  options?: InputMaybe<Array<Scalars['String']>>;
  /** The question proposed in this vote. */
  question?: InputMaybe<Scalars['String']>;
};

/** Input type for createVoteResponse mutation */
export type CreateVoteResponseInput = {
  /**
   * The user's selection for this VoteResponse. If the vote's options are changed, this field will still remain
   * unchanged unless the user updates their vote.
   */
  selection?: InputMaybe<Scalars['String']>;
  /** Timestamp at which this VoteResponse was submitted. */
  timestamp?: InputMaybe<Scalars['DateTime']>;
  /** ID of the user this VoteResponse is associated with. */
  userId?: InputMaybe<Scalars['BigInt']>;
  /** ID of the vote this VoteResponse is associated with. */
  voteId?: InputMaybe<Scalars['BigInt']>;
};

export type Credit = {
  __typename?: 'Credit';
  /** Unique ID for this Credit. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  person?: Maybe<Person>;
  /** The ID of the person this Credit belongs to. */
  personId?: Maybe<Scalars['BigInt']>;
  /** The priority of this Credit. Credits with a higher priority should be displayed first. */
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
  /** The ID of the production this Credit is for. */
  productionId?: Maybe<Scalars['BigInt']>;
  /** The title of this Credit */
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

/** Input type for filtering AccessLogs in ReadMany queries. */
export type FilterAccessLogInput = {
  AND?: InputMaybe<Array<FilterAccessLogInput>>;
  NOT?: InputMaybe<FilterAccessLogInput>;
  OR?: InputMaybe<Array<FilterAccessLogInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by IP address */
  ip?: InputMaybe<StringComparisonInput>;
  /** Filter by service name */
  service?: InputMaybe<StringComparisonInput>;
  /** Filter by timestamp */
  timestamp?: InputMaybe<DateComparisonInput>;
  /** Filter by User ID */
  userId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering AlertLogs in ReadMany queries. */
export type FilterAlertLogInput = {
  AND?: InputMaybe<Array<FilterAlertLogInput>>;
  NOT?: InputMaybe<FilterAlertLogInput>;
  OR?: InputMaybe<Array<FilterAlertLogInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by message */
  message?: InputMaybe<StringComparisonInput>;
  /** Filter by severity */
  severity?: InputMaybe<StringComparisonInput>;
  /** Filter by timestamp */
  timestamp?: InputMaybe<DateComparisonInput>;
};

/** Input type for filtering Assets in ReadMany queries. */
export type FilterAssetInput = {
  AND?: InputMaybe<Array<FilterAssetInput>>;
  NOT?: InputMaybe<FilterAssetInput>;
  OR?: InputMaybe<Array<FilterAssetInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by whether the asset is lost or not */
  isLost?: InputMaybe<BooleanComparisonInput>;
  /** Filter by the last known handler of the asset */
  lastKnownHandlerId?: InputMaybe<NumberComparisonInput>;
  /** Filter by the last known location of the asset */
  lastKnownLocation?: InputMaybe<StringComparisonInput>;
  /** Filter by the model number of the asset */
  modelNumber?: InputMaybe<StringComparisonInput>;
  /** Filter by human-readable name */
  name?: InputMaybe<StringComparisonInput>;
  /** Filter by the notes associated with the asset */
  notes?: InputMaybe<StringComparisonInput>;
  /** Filter by the parent asset of the asset */
  parentId?: InputMaybe<NumberComparisonInput>;
  /** Filter by when the asset was purchased */
  purchaseDate?: InputMaybe<DateComparisonInput>;
  /** Filter by where the asset was purchased */
  purchaseLocation?: InputMaybe<StringComparisonInput>;
  /** Filter by the purchase price of the asset */
  purchasePrice?: InputMaybe<NumberComparisonInput>;
  /** Filter by the serial number of the asset */
  serialNumber?: InputMaybe<StringComparisonInput>;
  /** Filter by tag number */
  tag?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering AuditLogs in ReadMany queries. */
export type FilterAuditLogInput = {
  AND?: InputMaybe<Array<FilterAuditLogInput>>;
  NOT?: InputMaybe<FilterAuditLogInput>;
  OR?: InputMaybe<Array<FilterAuditLogInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by the identifier of the object within the subject type (e.g. the ID of the user) */
  identifier?: InputMaybe<NumberComparisonInput>;
  /** Filter by the changed subject type */
  subject?: InputMaybe<StringComparisonInput>;
  /** Filter by the time the change was made */
  timestamp?: InputMaybe<DateComparisonInput>;
  /** Filter by the user who made the change */
  userId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering BlogPosts in ReadMany queries. */
export type FilterBlogPostInput = {
  AND?: InputMaybe<Array<FilterBlogPostInput>>;
  NOT?: InputMaybe<FilterBlogPostInput>;
  OR?: InputMaybe<Array<FilterBlogPostInput>>;
  /** Filter by author display name */
  authorDisplayName?: InputMaybe<StringComparisonInput>;
  /** Filter by author ID */
  authorId?: InputMaybe<NumberComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by when the blog post was posted. */
  postedAt?: InputMaybe<DateComparisonInput>;
  /** Filter by title */
  title?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering Categories in ReadMany queries. */
export type FilterCategoryInput = {
  AND?: InputMaybe<Array<FilterCategoryInput>>;
  NOT?: InputMaybe<FilterCategoryInput>;
  OR?: InputMaybe<Array<FilterCategoryInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by name */
  name?: InputMaybe<StringComparisonInput>;
  /** Filter by parent category ID */
  parentId?: InputMaybe<NumberComparisonInput>;
  /** Filter by priority */
  priority?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering ContactSubmissions in ReadMany queries. */
export type FilterContactSubmissionInput = {
  AND?: InputMaybe<Array<FilterContactSubmissionInput>>;
  NOT?: InputMaybe<FilterContactSubmissionInput>;
  OR?: InputMaybe<Array<FilterContactSubmissionInput>>;
  /** Filter by the email of the person who submitted the ContactSubmission. */
  email?: InputMaybe<StringComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by the name of the person who submitted the ContactSubmission. */
  name?: InputMaybe<StringComparisonInput>;
  /** Filter by resolved status */
  resolved?: InputMaybe<BooleanComparisonInput>;
  /** Filter by timestamp */
  timestamp?: InputMaybe<DateComparisonInput>;
};

/** Input type for filtering Credits in ReadMany queries. */
export type FilterCreditInput = {
  AND?: InputMaybe<Array<FilterCreditInput>>;
  NOT?: InputMaybe<FilterCreditInput>;
  OR?: InputMaybe<Array<FilterCreditInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by ID of the Person the Credit is for */
  personId?: InputMaybe<NumberComparisonInput>;
  /** Filter by ID of the Production the Credit is for */
  productionId?: InputMaybe<NumberComparisonInput>;
  /** Filter by position title */
  title?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering Groups in ReadMany queries. */
export type FilterGroupInput = {
  AND?: InputMaybe<Array<FilterGroupInput>>;
  NOT?: InputMaybe<FilterGroupInput>;
  OR?: InputMaybe<Array<FilterGroupInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by name */
  name?: InputMaybe<StringComparisonInput>;
  /** Filter by parent group ID */
  parentId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering GroupPermissions in ReadMany queries. */
export type FilterGroupPermissionInput = {
  AND?: InputMaybe<Array<FilterGroupPermissionInput>>;
  NOT?: InputMaybe<FilterGroupPermissionInput>;
  OR?: InputMaybe<Array<FilterGroupPermissionInput>>;
  /** Filter by permission action */
  action?: InputMaybe<StringComparisonInput>;
  /** Filter by group ID */
  groupId?: InputMaybe<NumberComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by inverted status */
  inverted?: InputMaybe<BooleanComparisonInput>;
  /** Filter by inverted permissions denial reason */
  reason?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering Images in ReadMany queries. */
export type FilterImageInput = {
  AND?: InputMaybe<Array<FilterImageInput>>;
  NOT?: InputMaybe<FilterImageInput>;
  OR?: InputMaybe<Array<FilterImageInput>>;
  /** Filter by the description of this Image. */
  description?: InputMaybe<StringComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by the name of this Image. */
  name?: InputMaybe<StringComparisonInput>;
  /** Filter by the path of this Image. */
  path?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering PersonImages in ReadMany queries. */
export type FilterPersonImageInput = {
  AND?: InputMaybe<Array<FilterPersonImageInput>>;
  NOT?: InputMaybe<FilterPersonImageInput>;
  OR?: InputMaybe<Array<FilterPersonImageInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by image ID */
  imageId?: InputMaybe<NumberComparisonInput>;
  /** Filter by person ID */
  personId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering Persons in ReadMany queries. */
export type FilterPersonInput = {
  AND?: InputMaybe<Array<FilterPersonInput>>;
  NOT?: InputMaybe<FilterPersonInput>;
  OR?: InputMaybe<Array<FilterPersonInput>>;
  /** Filter by graduation */
  graduation?: InputMaybe<DateComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by name */
  name?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering PersonRoles in ReadMany queries. */
export type FilterPersonRoleInput = {
  AND?: InputMaybe<Array<FilterPersonRoleInput>>;
  NOT?: InputMaybe<FilterPersonRoleInput>;
  OR?: InputMaybe<Array<FilterPersonRoleInput>>;
  /** Filter by the end time of the PersonRole */
  endTime?: InputMaybe<DateComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by Person ID */
  personId?: InputMaybe<NumberComparisonInput>;
  /** Filter by Role ID */
  roleId?: InputMaybe<NumberComparisonInput>;
  /** Filter by the start time of the PersonRole */
  startTime?: InputMaybe<DateComparisonInput>;
};

/** Input type for filtering ProductionImages in ReadMany queries. */
export type FilterProductionImageInput = {
  AND?: InputMaybe<Array<FilterProductionImageInput>>;
  NOT?: InputMaybe<FilterProductionImageInput>;
  OR?: InputMaybe<Array<FilterProductionImageInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by Image ID */
  imageId?: InputMaybe<NumberComparisonInput>;
  /** Filter by Production ID */
  productionId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering Productions in ReadMany queries. */
export type FilterProductionInput = {
  AND?: InputMaybe<Array<FilterProductionInput>>;
  NOT?: InputMaybe<FilterProductionInput>;
  OR?: InputMaybe<Array<FilterProductionInput>>;
  /** Filter by category ID */
  categoryId?: InputMaybe<NumberComparisonInput>;
  /** Filter by closet location */
  closetLocation?: InputMaybe<StringComparisonInput>;
  /** Filter by closet time */
  closetTime?: InputMaybe<DateComparisonInput>;
  /** Filter by description */
  description?: InputMaybe<StringComparisonInput>;
  /** Filter by end time */
  endTime?: InputMaybe<DateComparisonInput>;
  /** Filter by event location */
  eventLocation?: InputMaybe<StringComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by name */
  name?: InputMaybe<StringComparisonInput>;
  /** Filter by start time */
  startTime?: InputMaybe<DateComparisonInput>;
  /** Filter by team notes */
  teamNotes?: InputMaybe<StringComparisonInput>;
  /** Filter by thumbnail Image ID */
  thumbnailId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering ProductionRSVPs in ReadMany queries. */
export type FilterProductionRsvpInput = {
  AND?: InputMaybe<Array<FilterProductionRsvpInput>>;
  NOT?: InputMaybe<FilterProductionRsvpInput>;
  OR?: InputMaybe<Array<FilterProductionRsvpInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by any additional notes provided by the User, officers, or producers */
  notes?: InputMaybe<StringComparisonInput>;
  /** Filter by Production ID */
  productionId?: InputMaybe<NumberComparisonInput>;
  /** Filter by User ID */
  userId?: InputMaybe<NumberComparisonInput>;
  /** Filter by whether the User will attend the Production */
  willAttend?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering ProductionTags in ReadMany queries. */
export type FilterProductionTagInput = {
  AND?: InputMaybe<Array<FilterProductionTagInput>>;
  NOT?: InputMaybe<FilterProductionTagInput>;
  OR?: InputMaybe<Array<FilterProductionTagInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by Production ID */
  productionId?: InputMaybe<NumberComparisonInput>;
  /** Filter by tag */
  tag?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering ProductionVideos in ReadMany queries. */
export type FilterProductionVideoInput = {
  AND?: InputMaybe<Array<FilterProductionVideoInput>>;
  NOT?: InputMaybe<FilterProductionVideoInput>;
  OR?: InputMaybe<Array<FilterProductionVideoInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by Production ID */
  productionId?: InputMaybe<NumberComparisonInput>;
  /** Filter by Video ID */
  videoId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering Redirects in ReadMany queries. */
export type FilterRedirectInput = {
  AND?: InputMaybe<Array<FilterRedirectInput>>;
  NOT?: InputMaybe<FilterRedirectInput>;
  OR?: InputMaybe<Array<FilterRedirectInput>>;
  /** Filter by when the Redirect expires. */
  expires?: InputMaybe<DateComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by Redirect key, used in URLs. */
  key?: InputMaybe<StringComparisonInput>;
  /** Filter by Redirect location. User is redirected to this URL. */
  location?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering Roles in ReadMany queries. */
export type FilterRoleInput = {
  AND?: InputMaybe<Array<FilterRoleInput>>;
  NOT?: InputMaybe<FilterRoleInput>;
  OR?: InputMaybe<Array<FilterRoleInput>>;
  /** Filter by the description of this Role. */
  description?: InputMaybe<StringComparisonInput>;
  /** Filter by whether this Role should be displayed in the leadership section on the website's "About Us" page. */
  displayInLeadership?: InputMaybe<BooleanComparisonInput>;
  /** Filter by whether this Role should be displayed in the membership section on the website's "About Us" page. */
  displayInMembership?: InputMaybe<BooleanComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by the name of this Role. */
  name?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering UserGroups in ReadMany queries. */
export type FilterUserGroupInput = {
  AND?: InputMaybe<Array<FilterUserGroupInput>>;
  NOT?: InputMaybe<FilterUserGroupInput>;
  OR?: InputMaybe<Array<FilterUserGroupInput>>;
  /** Filter by Group ID */
  groupId?: InputMaybe<NumberComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by User ID */
  userId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering Users in ReadMany queries. */
export type FilterUserInput = {
  AND?: InputMaybe<Array<FilterUserInput>>;
  NOT?: InputMaybe<FilterUserInput>;
  OR?: InputMaybe<Array<FilterUserInput>>;
  /** Filter by Discord ID */
  discord?: InputMaybe<StringComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by joined date */
  joined?: InputMaybe<DateComparisonInput>;
  /** Filter by email address */
  mail?: InputMaybe<StringComparisonInput>;
  /** Filter by Person ID */
  personId?: InputMaybe<NumberComparisonInput>;
  /** Filter by username */
  username?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering UserPermissions in ReadMany queries. */
export type FilterUserPermissionInput = {
  AND?: InputMaybe<Array<FilterUserPermissionInput>>;
  NOT?: InputMaybe<FilterUserPermissionInput>;
  OR?: InputMaybe<Array<FilterUserPermissionInput>>;
  /** Filter by permission action */
  action?: InputMaybe<StringComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by inverted status */
  inverted?: InputMaybe<BooleanComparisonInput>;
  /** Filter by inverted permissions denial reason */
  reason?: InputMaybe<StringComparisonInput>;
  /** Filter by User ID */
  userId?: InputMaybe<NumberComparisonInput>;
};

/** Input type for filtering Videos in ReadMany queries. */
export type FilterVideoInput = {
  AND?: InputMaybe<Array<FilterVideoInput>>;
  NOT?: InputMaybe<FilterVideoInput>;
  OR?: InputMaybe<Array<FilterVideoInput>>;
  /** Filter by format */
  format?: InputMaybe<StringComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by name */
  name?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering Votes in ReadMany queries. */
export type FilterVoteInput = {
  AND?: InputMaybe<Array<FilterVoteInput>>;
  NOT?: InputMaybe<FilterVoteInput>;
  OR?: InputMaybe<Array<FilterVoteInput>>;
  /** Filter by description */
  description?: InputMaybe<StringComparisonInput>;
  /** Filter by expiry datetime */
  expires?: InputMaybe<DateComparisonInput>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by question */
  question?: InputMaybe<StringComparisonInput>;
};

/** Input type for filtering VoteResponses in ReadMany queries. */
export type FilterVoteResponseInput = {
  AND?: InputMaybe<Array<FilterVoteResponseInput>>;
  NOT?: InputMaybe<FilterVoteResponseInput>;
  OR?: InputMaybe<Array<FilterVoteResponseInput>>;
  /** Filter by ID */
  id?: InputMaybe<NumberComparisonInput>;
  /** Filter by their selection */
  selection?: InputMaybe<StringComparisonInput>;
  /** Filter by when they voted */
  timestamp?: InputMaybe<DateComparisonInput>;
  /** Filter by user ID */
  userId?: InputMaybe<NumberComparisonInput>;
  /** Filter by vote ID */
  voteId?: InputMaybe<NumberComparisonInput>;
};

export type Group = {
  __typename?: 'Group';
  children?: Maybe<Array<Group>>;
  /** Unique ID for this Group. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** The display name for this Group */
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Group>;
  /** The ID of the parent of this Group. If null, this Group is a top-level Group. */
  parentId?: Maybe<Scalars['BigInt']>;
  permissions?: Maybe<Array<GroupPermission>>;
  /**
   * The priority of this Group. Groups with a higher priority will override the permissions of Groups with a lower
   * priority.
   */
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
  /** The action for this GroupPermission. Should be a valid action within {@link AbilityAction }. */
  action?: Maybe<Scalars['String']>;
  /** Any conditional checks for this GroupPermission. */
  conditions?: Maybe<Scalars['JSON']>;
  /** The set of fields for this GroupPermission. */
  fields?: Maybe<Array<Scalars['String']>>;
  group?: Maybe<Group>;
  /** ID of the group which this GroupPermission is for. */
  groupId?: Maybe<Scalars['BigInt']>;
  /** Unique ID for this GroupPermission. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** True if this GroupPermission is a denying permission. False if this GroupPermission is an allowing permission. */
  inverted?: Maybe<Scalars['Boolean']>;
  /** The reason for this GroupPermission if this GroupPermission has {@link  #inverted} equal to true. */
  reason?: Maybe<Scalars['String']>;
  /** The set of subjects for this GroupPermission. Should be all valid subjects within {@link AbilitySubjects }. */
  subject?: Maybe<Array<Scalars['String']>>;
};

export enum GroupPermissionOrderableFields {
  Action = 'action',
  Id = 'id'
}

export type Image = {
  __typename?: 'Image';
  /** The description for this image. */
  description?: Maybe<Scalars['String']>;
  /** Unique ID for this Image. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** The display name for this image. */
  name?: Maybe<Scalars['String']>;
  /** The path/URI for this image. */
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
  createContactSubmission: ContactSubmission;
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
  updateContactSubmission: ContactSubmission;
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


export type MutationCreateContactSubmissionArgs = {
  input: CreateContactSubmissionInput;
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


export type MutationUpdateContactSubmissionArgs = {
  id: Scalars['BigInt'];
  input: UpdateContactSubmissionInput;
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

/** Input type for ordering AccessLogs in ReadMany queries. */
export type OrderAccessLogInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: AccessLogOrderableFields;
};

/** Input type for ordering AlertLogs in ReadMany queries. */
export type OrderAlertLogInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: AlertLogOrderableFields;
};

/** Input type for ordering Assets in ReadMany queries. */
export type OrderAssetInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: AssetOrderableFields;
};

/** Input type for ordering AuditLogs in ReadMany queries. */
export type OrderAuditLogInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: AuditLogOrderableFields;
};

/** Input type for ordering BlogPosts in ReadMany queries. */
export type OrderBlogPostInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: BlogPostOrderableFields;
};

/** Input type for ordering Categories in ReadMany queries. */
export type OrderCategoryInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: CategoryOrderableFields;
};

/** Input type for ordering ContactSubmissions in ReadMany queries. */
export type OrderContactSubmissionInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: ContactSubmissionOrderableFields;
};

/** Input type for ordering Credits in ReadMany queries. */
export type OrderCreditInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: CreditOrderableFields;
};

export enum OrderDirection {
  Asc = 'Asc',
  Desc = 'Desc'
}

/** Input type for ordering Groups in ReadMany queries. */
export type OrderGroupInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: GroupOrderableFields;
};

/** Input type for ordering GroupPermissions in ReadMany queries. */
export type OrderGroupPermissionInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: GroupPermissionOrderableFields;
};

/** Input type for ordering Images in ReadMany queries. */
export type OrderImageInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: ImageOrderableFields;
};

/** Input type for ordering Persons in ReadMany queries. */
export type OrderPersonInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: PersonOrderableFields;
};

/** Input type for ordering PersonRoles in ReadMany queries. */
export type OrderPersonRoleInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: PersonRoleOrderableFields;
};

/** Input type for ordering Categories in ReadMany queries. */
export type OrderProductionImageInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: ProductionImageOrderableFields;
};

/** Input type for ordering Productions in ReadMany queries. */
export type OrderProductionInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: ProductionOrderableFields;
};

/** Input type for ordering ProductionRSVPs in ReadMany queries. */
export type OrderProductionRsvpInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: ProductionRsvpOrderableFields;
};

/** Input type for ordering ProductionTags in ReadMany queries. */
export type OrderProductionTagInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: ProductionTagOrderableFields;
};

/** Input type for ordering Categories in ReadMany queries. */
export type OrderProductionVideoInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: ProductionVideoOrderableFields;
};

/** Input type for ordering Redirects in ReadMany queries. */
export type OrderRedirectInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: RedirectOrderableFields;
};

/** Input type for ordering Roles in ReadMany queries. */
export type OrderRoleInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: RoleOrderableFields;
};

/** Input type for ordering Users in ReadMany queries. */
export type OrderUserInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: UserOrderableFields;
};

/** Input type for ordering UserPermissions in ReadMany queries. */
export type OrderUserPermissionInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: UserPermissionOrderableFields;
};

/** Input type for ordering Videos in ReadMany queries. */
export type OrderVideoInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: VideoOrderableFields;
};

/** Input type for ordering Votes in ReadMany queries. */
export type OrderVoteInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
  field: VoteOrderableFields;
};

/** Input type for ordering VoteResponses in ReadMany queries. */
export type OrderVoteResponseInput = {
  /** Direction to order in. Required. */
  direction: OrderDirection;
  /** Name of the field to sort by. */
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
  /** An "about me" section for this Person. */
  description?: Maybe<Scalars['String']>;
  /**
   * The date that this Person intends on graduating from the university. This allows for automated role removals,
   * as well as displaying the Person's class year on their profile.
   */
  graduation?: Maybe<Scalars['DateTime']>;
  /** Unique ID for this Person. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  images?: Maybe<Array<PersonImage>>;
  /** The name (or pseudonym) for this Person. Should likely be in the format "First Last". */
  name?: Maybe<Scalars['String']>;
  profilePicture?: Maybe<Image>;
  /** ID of the image which should be used for this Person's profile picture. */
  profilePictureId?: Maybe<Scalars['BigInt']>;
  /** The pronouns for this Person. Should likely be in the format "they/them". Optional. */
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
  /** Unique ID for this PersonImage. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  image?: Maybe<Image>;
  /** ID of the image this PersonImage is associated with. */
  imageId?: Maybe<Scalars['BigInt']>;
  person?: Maybe<Person>;
  /** ID of the person this PersonImage is associated with. */
  personId?: Maybe<Scalars['BigInt']>;
  /** Priority of this PersonImage. Higher priority images should be displayed first. */
  priority?: Maybe<Scalars['Int']>;
};

export enum PersonOrderableFields {
  Graduation = 'graduation',
  Id = 'id',
  Name = 'name'
}

export type PersonRole = {
  __typename?: 'PersonRole';
  /** End date of when this PersonRole association should no longer be active. */
  endTime?: Maybe<Scalars['DateTime']>;
  /** Unique ID for this PersonRole. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  person?: Maybe<Person>;
  /** ID of the person this PersonRole is associated with. */
  personId?: Maybe<Scalars['BigInt']>;
  role?: Maybe<Role>;
  /** ID of the role this PersonRole is associated with. */
  roleId?: Maybe<Scalars['BigInt']>;
  /** Start date of when this PersonRole association should begin. */
  startTime?: Maybe<Scalars['DateTime']>;
};

export enum PersonRoleOrderableFields {
  Id = 'id',
  StartTime = 'startTime'
}

export type Production = {
  __typename?: 'Production';
  category?: Maybe<Category>;
  /** The ID of the category which this Production belongs to. */
  categoryId?: Maybe<Scalars['BigInt']>;
  /** The closet meeting location for club members to meet at before the Production. */
  closetLocation?: Maybe<Scalars['String']>;
  /** The time that club members should meet at the closet location before the Production. */
  closetTime?: Maybe<Scalars['DateTime']>;
  credits?: Maybe<Array<Credit>>;
  /** The Description of this Production */
  description?: Maybe<Scalars['String']>;
  /**
   * The ID of the Discord channel within the Discord server that messages related to this Production should be sent
   * to.
   */
  discordChannel?: Maybe<Scalars['String']>;
  /** The ID of the Discord server that messages related to this Production should be sent to. */
  discordServer?: Maybe<Scalars['String']>;
  /**
   * The expected end time of this Production. This is used, in combination with start time, to determine which
   * Productions are live.
   */
  endTime?: Maybe<Scalars['DateTime']>;
  /** The location of the event for this Production. */
  eventLocation?: Maybe<Scalars['String']>;
  /** Unique ID for this Production. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  images?: Maybe<Array<ProductionImage>>;
  /** The title/name of this Production */
  name?: Maybe<Scalars['String']>;
  rsvps?: Maybe<Array<ProductionRsvp>>;
  /**
   * The expected start time of this Production. This is used, in combination with end time, to determine which
   * Productions are live.
   */
  startTime?: Maybe<Scalars['DateTime']>;
  tags?: Maybe<Array<ProductionTag>>;
  /** Any notes that the team has about this Production. Can be markup. */
  teamNotes?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Image>;
  /** The ID of the Image which should be used as the thumbnail for this Production. */
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
  /** Unique ID for this ProductionImage. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  image?: Maybe<Image>;
  /** ID of the image this ProductionImage is associated with. */
  imageId?: Maybe<Scalars['BigInt']>;
  /** The priority of this ProductionImage. Higher priority ProductionImages should appear before lower priority ones. */
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
  /** ID of the production this ProductionImage is associated with. */
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
  /** Unique ID for this ProductionRSVP. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** Any additional notes provided by the User, officers, or producers. */
  notes?: Maybe<Scalars['String']>;
  production?: Maybe<Production>;
  /** ID of the Production that the User is RSVPing for. */
  productionId?: Maybe<Scalars['BigInt']>;
  user?: Maybe<User>;
  /** ID of the User that is RSVPing for the Production. */
  userId?: Maybe<Scalars['BigInt']>;
  /** The User's response to the Production's RSVP. Should be "yes", "no", or "maybe". */
  willAttend?: Maybe<Scalars['String']>;
};

export enum ProductionRsvpOrderableFields {
  Id = 'id',
  WillAttend = 'willAttend'
}

export type ProductionTag = {
  __typename?: 'ProductionTag';
  /** Unique ID for this ProductionTag. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  production?: Maybe<Production>;
  /** ID of the Production that this tag is associated with. */
  productionId?: Maybe<Scalars['BigInt']>;
  /** This tag's value. */
  tag?: Maybe<Scalars['String']>;
};

export enum ProductionTagOrderableFields {
  Id = 'id',
  Tag = 'tag'
}

export type ProductionVideo = {
  __typename?: 'ProductionVideo';
  /** Unique ID for this ProductionVideo. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** The priority of this ProductionVideo. Higher priority ProductionVideos should appear before lower priority ones. */
  priority?: Maybe<Scalars['Int']>;
  production?: Maybe<Production>;
  /** ID of the person this ProductionVideo is associated with. */
  productionId?: Maybe<Scalars['BigInt']>;
  video?: Maybe<Video>;
  /** ID of the video this ProductionVideo is associated with. */
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
  /** The date and time at which this Redirect expires. If null, this Redirect never expires. */
  expires?: Maybe<Scalars['DateTime']>;
  /** Unique ID for this Redirect. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** The key used in URLs to access this Redirect. */
  key?: Maybe<Scalars['String']>;
  /** The URL which this Redirect redirects to. */
  location?: Maybe<Scalars['String']>;
};

export enum RedirectOrderableFields {
  Expires = 'expires',
  Id = 'id',
  Key = 'key'
}

export type Role = {
  __typename?: 'Role';
  /** The optional description of this role. May be what people within this role are responsible for, for example. */
  description?: Maybe<Scalars['String']>;
  /** Flag for whether this Role should be displayed in the leadership section on the website's "About Us" page. */
  displayInLeadership?: Maybe<Scalars['Boolean']>;
  /** Flag for whether this Role should be displayed in the membership section on the website's "About Us" page. */
  displayInMembership?: Maybe<Scalars['Boolean']>;
  /** Unique ID for this Role. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** The name of this role. */
  name?: Maybe<Scalars['String']>;
  people?: Maybe<Array<PersonRole>>;
  /** Priority of this Role when displayed on the "About Us" page or next to other Role's on a Person's profile. */
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
  /** The location this stream is being pulled from. */
  from?: Maybe<Scalars['String']>;
  /** Unique ID for this stream. Automatically generated. */
  id?: Maybe<Scalars['UUID']>;
  /** The latest message from this stream. */
  message?: Maybe<Scalars['String']>;
  /** The location this stream is being pushed to. */
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

/**
 * Input type for updateAlertLog mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateAlertLogInput = {
  /** The message logged by this alert. This is what is displayed to the user(s) viewing alerts. */
  message?: InputMaybe<Scalars['String']>;
  /**
   * Severity of this alert. Currently can be any value, but should probably be one of the following:
   * - "INFO"
   * - "WARN"
   * - "ERROR"
   * A Postgres enum could be added in the future to enforce this. This could also be a number, which would allow
   * for easier filtering of alerts by severity.
   */
  severity?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateAsset mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateAssetInput = {
  /**
   * Flag whether this asset is lost or not. The asset is usually considered lost if the asset is not at the last
   * known location and the last known handler cannot account for its current location.
   */
  isLost?: InputMaybe<Scalars['Boolean']>;
  /** The user ID of the user who last checked this asset out/in. */
  lastKnownHandlerId?: InputMaybe<Scalars['BigInt']>;
  /**
   * The last known location of this asset. This should be the last location that the asset was checked out
   * from/checked into.
   */
  lastKnownLocation?: InputMaybe<Scalars['String']>;
  /**
   * The model number of this asset. While the asset name is a human-readable name for quickly identifying what the
   * asset is for, the model number is defined by the manufacturer, and is used to identify the exact model of the
   * asset. This is useful for future club members who wish to re-purchase an asset or find out more information
   * about it, such as the manual. Not all assets will have a model number, in which case this can be set to null.
   */
  modelNumber?: InputMaybe<Scalars['String']>;
  /** The name of this asset. This isn't necessarily the same as the model name, but it should be a human-readable */
  name?: InputMaybe<Scalars['String']>;
  /** Optional notes about this asset. */
  notes?: InputMaybe<Scalars['String']>;
  /**
   * Some assets are part of a larger set of assets. For example, a camera may be part of a camera kit, which
   * includes a camera, a lens, a battery, and a bag. It doesn't make sense to require the user to scan the QR code
   * for all of these assets. Instead, the kit itself can be scanned and all child assets will be updated. Note that
   * scanning a child will not update a parent, nor it's siblings. If the asset is not part of a set, this can be
   * set to null.
   */
  parentId?: InputMaybe<Scalars['BigInt']>;
  /**
   * DateTime at which this asset was purchased. This doesn't have to be super specific, but gives future club
   * members a rough idea of how old a piece of equipment is, and whether it may still be under warranty. This
   * should be the date that the asset was purchased, not the date that it was received. If the purchase date is
   * unknown, it can be set to null.
   */
  purchaseDate?: InputMaybe<Scalars['DateTime']>;
  /**
   * The location where this asset was purchased. This is useful for new club members who wish to re-purchase an
   * asset, and want to know where to purchase it from. If the purchase location is unknown, it can be set to null.
   * Purchase location should be as specific as possible, and can be either a physical location or a website URL.
   */
  purchaseLocation?: InputMaybe<Scalars['String']>;
  /**
   * The price which this asset was purchased for in pennies. This is useful for new club members who wish to
   * re-purchase an asset, and want to know the worth of the asset, for example. If an asset wasn't purchased,
   * (i.e. it was donated), the purchase price can be set to 0. If the purchase price is unknown, it can also be set
   * to null.
   */
  purchasePrice?: InputMaybe<Scalars['Int']>;
  /**
   * The serial number of this asset. Serial numbers are useful for warranty or support tickets with the manufacturer.
   * Most assets will likely have a serial number somewhere, however it may be hard to find, or doesn't necessarily
   * make sense to log it. In this case, the serial number can be set to null.
   */
  serialNumber?: InputMaybe<Scalars['String']>;
  /**
   * Unique tag number for this asset. This is what is printed/written/labeled on the asset itself. Sometimes, assets
   * are not tagged (e.g. due to physical size constraints), however they should still have a tag number.
   */
  tag?: InputMaybe<Scalars['Int']>;
};

/**
 * Input type for updateBlogPost mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateBlogPostInput = {
  /**
   * The name to display for the author, as opposed to the actual username/person name. This allows for posting
   * blogs as a "group".
   */
  authorDisplayName?: InputMaybe<Scalars['String']>;
  /** The User ID of the author of this blog post. */
  authorId?: InputMaybe<Scalars['BigInt']>;
  /** The actual body of the blog post. */
  content?: InputMaybe<Scalars['String']>;
  /** DateTime at which this blog post was posted. */
  postedAt?: InputMaybe<Scalars['DateTime']>;
  /** The title of the blog post. */
  title?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateCategory mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateCategoryInput = {
  /** The name of this category */
  name?: InputMaybe<Scalars['String']>;
  /** The ID of the parent category, or null if this is a top-level category. */
  parentId?: InputMaybe<Scalars['BigInt']>;
  /** The priority of this category. Categories with a higher priority should be displayed first. */
  priority?: InputMaybe<Scalars['Int']>;
};

/**
 * Input type for updateContactSubmission mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateContactSubmissionInput = {
  /** Additional metadata about this ContactSubmission. Unstructured JSON data. */
  additionalData?: InputMaybe<Scalars['JSON']>;
  /** The main body of the ContactSubmission. */
  body?: InputMaybe<Scalars['String']>;
  /** The email address for how to reach the person who submitted this ContactSubmission. */
  email?: InputMaybe<Scalars['String']>;
  /** The name of the person who submitted this ContactSubmission. */
  name?: InputMaybe<Scalars['String']>;
  /** Flag whether this contact submission has been resolved or not. */
  resolved?: InputMaybe<Scalars['Boolean']>;
  /** The subject/title of the ContactSubmission. */
  subject?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateCredit mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateCreditInput = {
  /** The ID of the person this Credit belongs to. */
  personId?: InputMaybe<Scalars['BigInt']>;
  /** The priority of this Credit. Credits with a higher priority should be displayed first. */
  priority?: InputMaybe<Scalars['Int']>;
  /** The ID of the production this Credit is for. */
  productionId?: InputMaybe<Scalars['BigInt']>;
  /** The title of this Credit */
  title?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateGroup mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateGroupInput = {
  /** The display name for this Group */
  name?: InputMaybe<Scalars['String']>;
  /** The ID of the parent of this Group. If null, this Group is a top-level Group. */
  parentId?: InputMaybe<Scalars['BigInt']>;
  /**
   * The priority of this Group. Groups with a higher priority will override the permissions of Groups with a lower
   * priority.
   */
  priority?: InputMaybe<Scalars['Int']>;
};

/**
 * Input type for updateGroupPermission mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateGroupPermissionInput = {
  /** The action for this GroupPermission. Should be a valid action within {@link AbilityAction }. */
  action?: InputMaybe<Scalars['String']>;
  /** Any conditional checks for this GroupPermission. */
  conditions?: InputMaybe<Scalars['JSON']>;
  /** The set of fields for this GroupPermission. */
  fields?: InputMaybe<Array<Scalars['String']>>;
  /** ID of the group which this GroupPermission is for. */
  groupId?: InputMaybe<Scalars['BigInt']>;
  /** True if this GroupPermission is a denying permission. False if this GroupPermission is an allowing permission. */
  inverted?: InputMaybe<Scalars['Boolean']>;
  /** The reason for this GroupPermission if this GroupPermission has {@link  #inverted} equal to true. */
  reason?: InputMaybe<Scalars['String']>;
  /** The set of subjects for this GroupPermission. Should be all valid subjects within {@link AbilitySubjects }. */
  subject?: InputMaybe<Array<Scalars['String']>>;
};

/**
 * Input type for updateImage mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateImageInput = {
  /** The description for this image. */
  description?: InputMaybe<Scalars['String']>;
  /** The display name for this image. */
  name?: InputMaybe<Scalars['String']>;
  /** The path/URI for this image. */
  path?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updatePersonImage mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdatePersonImageInput = {
  /** Priority of this PersonImage. Higher priority images should be displayed first. */
  priority?: InputMaybe<Scalars['Int']>;
};

/**
 * Input type for updatePerson mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdatePersonInput = {
  /** An "about me" section for this Person. */
  description?: InputMaybe<Scalars['String']>;
  /**
   * The date that this Person intends on graduating from the university. This allows for automated role removals,
   * as well as displaying the Person's class year on their profile.
   */
  graduation?: InputMaybe<Scalars['DateTime']>;
  /** The name (or pseudonym) for this Person. Should likely be in the format "First Last". */
  name?: InputMaybe<Scalars['String']>;
  /** ID of the image which should be used for this Person's profile picture. */
  profilePictureId?: InputMaybe<Scalars['BigInt']>;
  /** The pronouns for this Person. Should likely be in the format "they/them". Optional. */
  pronouns?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updatePersonRole mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdatePersonRoleInput = {
  /** End date of when this PersonRole association should no longer be active. */
  endTime?: InputMaybe<Scalars['DateTime']>;
  /** Start date of when this PersonRole association should begin. */
  startTime?: InputMaybe<Scalars['DateTime']>;
};

/**
 * Input type for updateProductionImage mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateProductionImageInput = {
  /** The priority of this ProductionImage. Higher priority ProductionImages should appear before lower priority ones. */
  priority?: InputMaybe<Scalars['Int']>;
};

/**
 * Input type for updateProduction mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateProductionInput = {
  /** The ID of the category which this Production belongs to. */
  categoryId?: InputMaybe<Scalars['BigInt']>;
  /** The closet meeting location for club members to meet at before the Production. */
  closetLocation?: InputMaybe<Scalars['String']>;
  /** The time that club members should meet at the closet location before the Production. */
  closetTime?: InputMaybe<Scalars['DateTime']>;
  /** The Description of this Production */
  description?: InputMaybe<Scalars['String']>;
  /**
   * The ID of the Discord channel within the Discord server that messages related to this Production should be sent
   * to.
   */
  discordChannel?: InputMaybe<Scalars['String']>;
  /** The ID of the Discord server that messages related to this Production should be sent to. */
  discordServer?: InputMaybe<Scalars['String']>;
  /**
   * The expected end time of this Production. This is used, in combination with start time, to determine which
   * Productions are live.
   */
  endTime?: InputMaybe<Scalars['DateTime']>;
  /** The location of the event for this Production. */
  eventLocation?: InputMaybe<Scalars['String']>;
  /** The title/name of this Production */
  name?: InputMaybe<Scalars['String']>;
  /**
   * The expected start time of this Production. This is used, in combination with end time, to determine which
   * Productions are live.
   */
  startTime?: InputMaybe<Scalars['DateTime']>;
  /** Any notes that the team has about this Production. Can be markup. */
  teamNotes?: InputMaybe<Scalars['String']>;
  /** The ID of the Image which should be used as the thumbnail for this Production. */
  thumbnailId?: InputMaybe<Scalars['BigInt']>;
};

/**
 * Input type for updateProductionRSVP mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateProductionRsvpInput = {
  /** Any additional notes provided by the User, officers, or producers. */
  notes?: InputMaybe<Scalars['String']>;
  /** The User's response to the Production's RSVP. Should be "yes", "no", or "maybe". */
  willAttend?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateProductionVideo mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateProductionVideoInput = {
  /** The priority of this ProductionVideo. Higher priority ProductionVideos should appear before lower priority ones. */
  priority?: InputMaybe<Scalars['Int']>;
};

/**
 * Input type for updateRedirect mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateRedirectInput = {
  /** The date and time at which this Redirect expires. If null, this Redirect never expires. */
  expires?: InputMaybe<Scalars['DateTime']>;
  /** The key used in URLs to access this Redirect. */
  key?: InputMaybe<Scalars['String']>;
  /** The URL which this Redirect redirects to. */
  location?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateRole mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateRoleInput = {
  /** The optional description of this role. May be what people within this role are responsible for, for example. */
  description?: InputMaybe<Scalars['String']>;
  /** Flag for whether this Role should be displayed in the leadership section on the website's "About Us" page. */
  displayInLeadership?: InputMaybe<Scalars['Boolean']>;
  /** Flag for whether this Role should be displayed in the membership section on the website's "About Us" page. */
  displayInMembership?: InputMaybe<Scalars['Boolean']>;
  /** The name of this role. */
  name?: InputMaybe<Scalars['String']>;
  /** Priority of this Role when displayed on the "About Us" page or next to other Role's on a Person's profile. */
  priority?: InputMaybe<Scalars['Int']>;
};

/** Input type for updateUser mutation. Null values are not updated. To update a non-null value to null, explicitly pass null. */
export type UpdateUserInput = {
  /** Discord account ID for this user, or null if the user does not have a linked Discord account. */
  discord?: InputMaybe<Scalars['String']>;
  /** Email address for this user. */
  mail?: InputMaybe<Scalars['String']>;
  /** The password to set for this user */
  password?: InputMaybe<Scalars['String']>;
  /** Attached Person's ID, or null if this user does not have a linked Person. */
  personId?: InputMaybe<Scalars['BigInt']>;
  /**
   * Unique username for this user. Must be less than or equal to 8 characters in length and must be alphanumeric.
   * Recommended to be the user's RCS ID.
   */
  username?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateUserPermission mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateUserPermissionInput = {
  /** The action for this UserPermission. Should be a valid action within {@link AbilityAction }. */
  action?: InputMaybe<Scalars['String']>;
  /** Any conditional checks for this UserPermission. */
  conditions?: InputMaybe<Scalars['JSON']>;
  /** The set of fields for this UserPermission. */
  fields?: InputMaybe<Array<Scalars['String']>>;
  /** True if this UserPermission is a denying permission. False if this UserPermission is an allowing permission. */
  inverted?: InputMaybe<Scalars['Boolean']>;
  /** The reason for this UserPermission if this UserPermission has {@link  #inverted} equal to true. */
  reason?: InputMaybe<Scalars['String']>;
  /** The set of subjects for this UserPermission. Should be all valid subjects within {@link AbilitySubjects }. */
  subject?: InputMaybe<Array<Scalars['String']>>;
  /** ID of the user which this UserPermission is for. */
  userId?: InputMaybe<Scalars['BigInt']>;
};

/**
 * Input type for updateVideo mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateVideoInput = {
  /** The format for this Video. Probably either "EMBED", "RTMP", or "HLS". */
  format?: InputMaybe<Scalars['String']>;
  /**
   * All additional data about this video. This is an unstructured JSON object. The data will vary depending on the
   * format of the video.
   */
  metadata?: InputMaybe<Scalars['JSON']>;
  /** The display name for this Video. */
  name?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateVote mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateVoteInput = {
  /** Additional describing information about this vote. */
  description?: InputMaybe<Scalars['String']>;
  /** Timestamp at which this vote closes and no more responses will be accepted. */
  expires?: InputMaybe<Scalars['DateTime']>;
  /** An array of available options for responses to this vote. */
  options?: InputMaybe<Array<Scalars['String']>>;
  /** The question proposed in this vote. */
  question?: InputMaybe<Scalars['String']>;
};

/**
 * Input type for updateVoteResponse mutation. Null values are not updated. To update a non-null value to null, explicitly
 * pass null.
 */
export type UpdateVoteResponseInput = {
  /**
   * The user's selection for this VoteResponse. If the vote's options are changed, this field will still remain
   * unchanged unless the user updates their vote.
   */
  selection?: InputMaybe<Scalars['String']>;
  /** Timestamp at which this VoteResponse was submitted. */
  timestamp?: InputMaybe<Scalars['DateTime']>;
};

export type User = {
  __typename?: 'User';
  accessLogs?: Maybe<Array<AccessLog>>;
  auditLogs?: Maybe<Array<AuditLog>>;
  checkedOutAssets?: Maybe<Array<Asset>>;
  /** Discord account ID for this user, or null if the user does not have a linked Discord account. */
  discord?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<UserGroup>>;
  /** Unique ID for this User. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** DateTime at which the user's account was created. */
  joined?: Maybe<Scalars['DateTime']>;
  /** Email address for this user. */
  mail?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<UserPermission>>;
  person?: Maybe<Person>;
  /** Attached Person's ID, or null if this user does not have a linked Person. */
  personId?: Maybe<Scalars['BigInt']>;
  productionRsvps?: Maybe<Array<ProductionRsvp>>;
  /**
   * Unique username for this user. Must be less than or equal to 8 characters in length and must be alphanumeric.
   * Recommended to be the user's RCS ID.
   */
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
  /** ID of the group this UserGroup is associated with. */
  groupId?: Maybe<Scalars['BigInt']>;
  /** Unique ID for this UserGroup. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  user?: Maybe<User>;
  /** ID of the user this UserGroup is associated with. */
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
  /** The action for this UserPermission. Should be a valid action within {@link AbilityAction }. */
  action?: Maybe<Scalars['String']>;
  /** Any conditional checks for this UserPermission. */
  conditions?: Maybe<Scalars['JSON']>;
  /** The set of fields for this UserPermission. */
  fields?: Maybe<Array<Scalars['String']>>;
  /** Unique ID for this UserPermission. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** True if this UserPermission is a denying permission. False if this UserPermission is an allowing permission. */
  inverted?: Maybe<Scalars['Boolean']>;
  /** The reason for this UserPermission if this UserPermission has {@link  #inverted} equal to true. */
  reason?: Maybe<Scalars['String']>;
  /** The set of subjects for this UserPermission. Should be all valid subjects within {@link AbilitySubjects }. */
  subject?: Maybe<Array<Scalars['String']>>;
  user?: Maybe<User>;
  /** ID of the user which this UserPermission is for. */
  userId?: Maybe<Scalars['BigInt']>;
};

export enum UserPermissionOrderableFields {
  Action = 'action',
  Id = 'id'
}

export type Video = {
  __typename?: 'Video';
  /** The format for this Video. Probably either "EMBED", "RTMP", or "HLS". */
  format?: Maybe<Scalars['String']>;
  /** Unique ID for this Video. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /**
   * All additional data about this video. This is an unstructured JSON object. The data will vary depending on the
   * format of the video.
   */
  metadata?: Maybe<Scalars['JSON']>;
  /** The display name for this Video. */
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
  /** Additional describing information about this vote. */
  description?: Maybe<Scalars['String']>;
  /** Timestamp at which this vote closes and no more responses will be accepted. */
  expires?: Maybe<Scalars['DateTime']>;
  /** Unique ID for this Vote. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /** An array of available options for responses to this vote. */
  options?: Maybe<Array<Scalars['String']>>;
  /** The question proposed in this vote. */
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
  /** Unique ID for this VoteResponse. Automatically generated. */
  id?: Maybe<Scalars['BigInt']>;
  /**
   * The user's selection for this VoteResponse. If the vote's options are changed, this field will still remain
   * unchanged unless the user updates their vote.
   */
  selection?: Maybe<Scalars['String']>;
  /** Timestamp at which this VoteResponse was submitted. */
  timestamp?: Maybe<Scalars['DateTime']>;
  user?: Maybe<User>;
  /** ID of the user this VoteResponse is associated with. */
  userId?: Maybe<Scalars['BigInt']>;
  vote?: Maybe<Vote>;
  /** ID of the vote this VoteResponse is associated with. */
  voteId?: Maybe<Scalars['BigInt']>;
};

export enum VoteResponseOrderableFields {
  Id = 'id',
  Timestamp = 'timestamp'
}

export type CreateGroupMutationVariables = Exact<{
  data: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', group: { __typename?: 'Group', id?: any | null } };

export type CreateGroupPermissionMutationVariables = Exact<{
  input: CreateGroupPermissionInput;
}>;


export type CreateGroupPermissionMutation = { __typename?: 'Mutation', permission: { __typename?: 'GroupPermission', id?: any | null } };

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

export type DeleteGroupMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', group: { __typename?: 'Group', id?: any | null, name?: string | null } };

export type DeleteGroupPermissionMutationVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type DeleteGroupPermissionMutation = { __typename?: 'Mutation', permission: { __typename?: 'GroupPermission', id?: any | null } };

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
}>;


export type FindAllProductionsQuery = { __typename?: 'Query', productions: Array<{ __typename?: 'Production', id?: any | null, name?: string | null, startTime?: any | null, description?: string | null, thumbnail?: { __typename?: 'Image', path?: string | null } | null }> };

export type FindAuditLogsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterAuditLogInput>;
}>;


export type FindAuditLogsQuery = { __typename?: 'Query', auditLogCount: number, auditLogs: Array<{ __typename?: 'AuditLog', id?: any | null, action: string, details: Array<string>, identifier?: any | null, message?: string | null, subject?: string | null, timestamp?: any | null, user?: { __typename?: 'User', id?: any | null, username?: string | null } | null }> };

export type FindGroupPermissionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterGroupPermissionInput>;
}>;


export type FindGroupPermissionsQuery = { __typename?: 'Query', groupPermissionCount: number, permissions: Array<{ __typename?: 'GroupPermission', id?: any | null, action?: string | null, subject?: Array<string> | null, fields?: Array<string> | null, conditions?: any | null, inverted?: boolean | null, reason?: string | null }> };

export type FindGroupsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterGroupInput>;
}>;


export type FindGroupsQuery = { __typename?: 'Query', groupCount: number, groups: Array<{ __typename?: 'Group', id?: any | null, name?: string | null, priority?: number | null, parent?: { __typename?: 'Group', id?: any | null, name?: string | null } | null }> };

export type FindRolesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterRoleInput>;
}>;


export type FindRolesQuery = { __typename?: 'Query', roleCount: number, roles: Array<{ __typename?: 'Role', id?: any | null, name?: string | null, priority?: number | null }> };

export type FindUserPermissionsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterUserPermissionInput>;
}>;


export type FindUserPermissionsQuery = { __typename?: 'Query', userPermissionCount: number, permissions: Array<{ __typename?: 'UserPermission', id?: any | null, action?: string | null, subject?: Array<string> | null, fields?: Array<string> | null, conditions?: any | null, inverted?: boolean | null, reason?: string | null }> };

export type FindUsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterUserInput>;
}>;


export type FindUsersQuery = { __typename?: 'Query', userCount: number, users: Array<{ __typename?: 'User', id?: any | null, username?: string | null, joined?: any | null, discord?: string | null, mail?: string | null }> };

export type FindVideosQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterVideoInput>;
}>;


export type FindVideosQuery = { __typename?: 'Query', videoCount: number, videos: Array<{ __typename?: 'Video', id?: any | null, name?: string | null, metadata?: any | null, format?: string | null }> };

export type GroupDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type GroupDetailsQuery = { __typename?: 'Query', group?: { __typename?: 'Group', id?: any | null, name?: string | null, priority?: number | null, parent?: { __typename?: 'Group', id?: any | null, name?: string | null } | null } | null };

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

export type RoleDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type RoleDetailsQuery = { __typename?: 'Query', role?: { __typename?: 'Role', id?: any | null, name?: string | null, priority?: number | null, description?: string | null, displayInMembership?: boolean | null, displayInLeadership?: boolean | null } | null };

export type SearchGroupsQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterGroupInput>;
}>;


export type SearchGroupsQuery = { __typename?: 'Query', groupCount: number, groups: Array<{ __typename?: 'Group', id?: any | null, name?: string | null }> };

export type SearchRolesQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterRoleInput>;
}>;


export type SearchRolesQuery = { __typename?: 'Query', roleCount: number, roles: Array<{ __typename?: 'Role', id?: any | null, name?: string | null }> };

export type SearchVideosQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInput>;
  filter?: InputMaybe<FilterVideoInput>;
}>;


export type SearchVideosQuery = { __typename?: 'Query', videoCount: number, roles: Array<{ __typename?: 'Video', id?: any | null, name?: string | null }> };

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

export type UserDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type UserDetailsQuery = { __typename?: 'Query', user?: { __typename?: 'User', id?: any | null, username?: string | null, joined?: any | null, discord?: string | null, mail?: string | null, person?: { __typename?: 'Person', id?: any | null, name?: string | null } | null, groups?: Array<{ __typename?: 'UserGroup', id?: any | null, group?: { __typename?: 'Group', id?: any | null, name?: string | null, priority?: number | null } | null }> | null, accessLogs?: Array<{ __typename?: 'AccessLog', timestamp?: any | null }> | null } | null };

export type VideoDetailsQueryVariables = Exact<{
  id: Scalars['BigInt'];
}>;


export type VideoDetailsQuery = { __typename?: 'Query', video?: { __typename?: 'Video', id?: any | null, name?: string | null, metadata?: any | null, format?: string | null } | null };


export const CreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"group"},"name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
export const CreateGroupPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGroupPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"createGroupPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateGroupPermissionMutation, CreateGroupPermissionMutationVariables>;
export const CreateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"createRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateRoleMutation, CreateRoleMutationVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const CreateUserGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"userGroup"},"name":{"kind":"Name","value":"createUserGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"groupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserGroupMutation, CreateUserGroupMutationVariables>;
export const CreateUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateUserPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"createUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateUserPermissionMutation, CreateUserPermissionMutationVariables>;
export const CreateVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateVideoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"createVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateVideoMutation, CreateVideoMutationVariables>;
export const DeleteGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"group"},"name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const DeleteGroupPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroupPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"deleteGroupPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteGroupPermissionMutation, DeleteGroupPermissionMutationVariables>;
export const DeleteRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"deleteRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const DeleteUserGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUserGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"userGroup"},"name":{"kind":"Name","value":"deleteUserGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteUserGroupMutation, DeleteUserGroupMutationVariables>;
export const DeleteUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"deleteUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteUserPermissionMutation, DeleteUserPermissionMutationVariables>;
export const DeleteVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"deleteVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteVideoMutation, DeleteVideoMutationVariables>;
export const FindAccessLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAccessLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterAccessLogInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessLogCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"accessLogs"},"name":{"kind":"Name","value":"findManyAccessLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"service"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<FindAccessLogsQuery, FindAccessLogsQueryVariables>;
export const FindAlertLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAlertLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterAlertLogInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"alertLogCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"alertLogs"},"name":{"kind":"Name","value":"findManyAlertLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"severity"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]} as unknown as DocumentNode<FindAlertLogsQuery, FindAlertLogsQueryVariables>;
export const FindAllProductionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAllProductions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"productions"},"name":{"kind":"Name","value":"findManyProduction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"startTime"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]}}]} as unknown as DocumentNode<FindAllProductionsQuery, FindAllProductionsQueryVariables>;
export const FindAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterAuditLogInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"auditLogs"},"name":{"kind":"Name","value":"findManyAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"details"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"timestamp"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<FindAuditLogsQuery, FindAuditLogsQueryVariables>;
export const FindGroupPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindGroupPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterGroupPermissionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupPermissionCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"permissions"},"name":{"kind":"Name","value":"findManyGroupPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"inverted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<FindGroupPermissionsQuery, FindGroupPermissionsQueryVariables>;
export const FindGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterGroupInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"groups"},"name":{"kind":"Name","value":"findManyGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"priority"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<FindGroupsQuery, FindGroupsQueryVariables>;
export const FindRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterRoleInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"roles"},"name":{"kind":"Name","value":"findManyRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"priority"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]},{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"name"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}}]} as unknown as DocumentNode<FindRolesQuery, FindRolesQueryVariables>;
export const FindUserPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUserPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterUserPermissionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userPermissionCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"permissions"},"name":{"kind":"Name","value":"findManyUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"inverted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]} as unknown as DocumentNode<FindUserPermissionsQuery, FindUserPermissionsQueryVariables>;
export const FindUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterUserInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"users"},"name":{"kind":"Name","value":"findManyUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"joined"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}},{"kind":"Field","name":{"kind":"Name","value":"discord"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}}]}}]}}]} as unknown as DocumentNode<FindUsersQuery, FindUsersQueryVariables>;
export const FindVideosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FindVideos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterVideoInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"videos"},"name":{"kind":"Name","value":"findManyVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"name"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]} as unknown as DocumentNode<FindVideosQuery, FindVideosQueryVariables>;
export const GroupDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"group"},"name":{"kind":"Name","value":"findOneGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GroupDetailsQuery, GroupDetailsQueryVariables>;
export const ListStreamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListStreams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"findManyStream"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"to"}},{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ListStreamsQuery, ListStreamsQueryVariables>;
export const LoginLocalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginLocal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loginLocal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<LoginLocalMutation, LoginLocalMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"logoutSuccess"},"name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const PermissionsForDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PermissionsFor"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permissions"},"name":{"kind":"Name","value":"permissionsFor"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GroupPermission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"inverted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserPermission"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"fields"}},{"kind":"Field","name":{"kind":"Name","value":"conditions"}},{"kind":"Field","name":{"kind":"Name","value":"inverted"}},{"kind":"Field","name":{"kind":"Name","value":"reason"}}]}}]}}]}}]} as unknown as DocumentNode<PermissionsForQuery, PermissionsForQueryVariables>;
export const RoleDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoleDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"findOneRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"displayInMembership"}},{"kind":"Field","name":{"kind":"Name","value":"displayInLeadership"}}]}}]}}]} as unknown as DocumentNode<RoleDetailsQuery, RoleDetailsQueryVariables>;
export const SearchGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchGroups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterGroupInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"groups"},"name":{"kind":"Name","value":"findManyGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchGroupsQuery, SearchGroupsQueryVariables>;
export const SearchRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchRoles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterRoleInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"roles"},"name":{"kind":"Name","value":"findManyRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchRolesQuery, SearchRolesQueryVariables>;
export const SearchVideosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchVideos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PaginationInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterVideoInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}]},{"kind":"Field","alias":{"kind":"Name","value":"roles"},"name":{"kind":"Name","value":"findManyVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pagination"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SearchVideosQuery, SearchVideosQueryVariables>;
export const SelfIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SelfId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"self"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SelfIdQuery, SelfIdQueryVariables>;
export const StartStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStream"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"from"}},{"kind":"Field","name":{"kind":"Name","value":"to"}}]}}]}}]} as unknown as DocumentNode<StartStreamMutation, StartStreamMutationVariables>;
export const StopStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StopStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStream"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<StopStreamMutation, StopStreamMutationVariables>;
export const UpdateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"group"},"name":{"kind":"Name","value":"updateGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateGroupMutation, UpdateGroupMutationVariables>;
export const UpdateGroupPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGroupPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGroupPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"updateGroupPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateGroupPermissionMutation, UpdateGroupPermissionMutationVariables>;
export const UpdateRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"role"},"name":{"kind":"Name","value":"updateRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateUserPermissionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserPermission"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserPermissionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"permission"},"name":{"kind":"Name","value":"updateUserPermission"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUserPermissionMutation, UpdateUserPermissionMutationVariables>;
export const UpdateVideoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateVideo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateVideoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"updateVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateVideoMutation, UpdateVideoMutationVariables>;
export const UserDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"findOneUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"joined"}},{"kind":"Field","name":{"kind":"Name","value":"discord"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"person"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"accessLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pagination"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"take"},"value":{"kind":"IntValue","value":"1"}}]}},{"kind":"Argument","name":{"kind":"Name","value":"order"},"value":{"kind":"ListValue","values":[{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"field"},"value":{"kind":"EnumValue","value":"timestamp"}},{"kind":"ObjectField","name":{"kind":"Name","value":"direction"},"value":{"kind":"EnumValue","value":"Desc"}}]}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"timestamp"}}]}}]}}]}}]} as unknown as DocumentNode<UserDetailsQuery, UserDetailsQueryVariables>;
export const VideoDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VideoDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BigInt"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"video"},"name":{"kind":"Name","value":"findOneVideo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"format"}}]}}]}}]} as unknown as DocumentNode<VideoDetailsQuery, VideoDetailsQueryVariables>;