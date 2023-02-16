import { Field, Int, ObjectType } from "@nestjs/graphql";
import { IsDate, IsInt, MaxLength, Min } from "class-validator";
import { Asset as PrismaAsset } from "@prisma/client";
import { BigIntMin } from "../../custom-validators";
import { GraphQLBigInt } from "graphql-scalars";

/**
 * Assets are the physical objects that are property of RPI TV, or are otherwise managed and tracked by RPI TV.
 *
 *  Due to the club's rapidly revolving door of members, it's easy for equipment to get lost or forgotten about. The
 *  Asset system is intended to assist in keeping track of what assets RPI TV owns, where they were purchased, how
 *  much they were purchased for, and where they are being used (and by whom).
 *
 *  Assets currently do not have a "checked in" or "checked out" status. Instead, each asset has a last known location,
 *  as well as the last known user who was using the asset. When an asset is "checked out", the user will scan the
 *  location's bar code and the asset's QR code, which will update the asset's last known location and last known
 *  handler. It is presumed that an asset will not be checked out for long, or if it is, the user who checked it out
 *  will have it in their possession at all times, so they will know the status of it while it is in their possession.
 *  When the user wants to "check in" the asset, the same process is done as when they checked it out.
 */
@ObjectType()
export class Asset implements PrismaAsset {
    /**
     * CASL "modelName" used for detecting subject type. Only necessary when the string "Asset" is passed to CASL's
     *   can() method, and the passed Asset object hasn't passed through the subject() helper function.
     * @see {@link https://casl.js.org/v6/en/advanced/typescript}
     */
    static readonly modelName = "Asset" as const;

    /**
     * Unique ID for this asset. Automatically generated.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    id: bigint | null;

    /**
     * Unique tag number for this asset. This is what is printed/written/labeled on the asset itself. Sometimes, assets
     *  are not tagged (e.g. due to physical size constraints), however they should still have a tag number.
     */
    @IsInt()
    @Min(10_000)
    @Field(() => Int, { nullable: true })
    tag: number | null;

    /**
     * The name of this asset. This isn't necessarily the same as the model name, but it should be a human-readable
     * @example "Camera 01 (Sony)"
     */
    @MaxLength(150)
    @Field(() => String, { nullable: true })
    name: string | null;

    /**
     * The last known location of this asset. This should be the last location that the asset was checked out
     *  from/checked into.
     * @example "HFH Control Room"
     */
    @MaxLength(150)
    @Field(() => String, { nullable: true })
    lastKnownLocation: string | null;

    /**
     * The user ID of the user who last checked this asset out/in.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    lastKnownHandlerId: bigint | null;

    /**
     * Flag whether this asset is lost or not. The asset is usually considered lost if the asset is not at the last
     *  known location and the last known handler cannot account for its current location.
     */
    @Field(() => Boolean, { nullable: true })
    isLost: boolean | null;

    /**
     * Optional notes about this asset.
     */
    @MaxLength(500)
    @Field(() => String, { nullable: true })
    notes: string | null;

    /**
     * The price which this asset was purchased for in pennies. This is useful for new club members who wish to
     *  re-purchase an asset, and want to know the worth of the asset, for example. If an asset wasn't purchased,
     *  (i.e. it was donated), the purchase price can be set to 0. If the purchase price is unknown, it can also be set
     *  to null.
     */
    @Min(0)
    @Field(() => Int, { nullable: true })
    purchasePrice: number;

    /**
     * The location where this asset was purchased. This is useful for new club members who wish to re-purchase an
     *  asset, and want to know where to purchase it from. If the purchase location is unknown, it can be set to null.
     *  Purchase location should be as specific as possible, and can be either a physical location or a website URL.
     */
    @MaxLength(1000)
    @Field(() => String, { nullable: true })
    purchaseLocation: string;

    /**
     * DateTime at which this asset was purchased. This doesn't have to be super specific, but gives future club
     *  members a rough idea of how old a piece of equipment is, and whether it may still be under warranty. This
     *  should be the date that the asset was purchased, not the date that it was received. If the purchase date is
     *  unknown, it can be set to null.
     */
    @IsDate()
    @Field(() => Date, { nullable: true })
    purchaseDate: Date | null;

    /**
     * The model number of this asset. While the asset name is a human-readable name for quickly identifying what the
     *  asset is for, the model number is defined by the manufacturer, and is used to identify the exact model of the
     *  asset. This is useful for future club members who wish to re-purchase an asset or find out more information
     *  about it, such as the manual. Not all assets will have a model number, in which case this can be set to null.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    modelNumber: string | null;

    /**
     * The serial number of this asset. Serial numbers are useful for warranty or support tickets with the manufacturer.
     *  Most assets will likely have a serial number somewhere, however it may be hard to find, or doesn't necessarily
     *  make sense to log it. In this case, the serial number can be set to null.
     */
    @MaxLength(100)
    @Field(() => String, { nullable: true })
    serialNumber: string | null;

    /**
     * Some assets are part of a larger set of assets. For example, a camera may be part of a camera kit, which
     * includes a camera, a lens, a battery, and a bag. It doesn't make sense to require the user to scan the QR code
     * for all of these assets. Instead, the kit itself can be scanned and all child assets will be updated. Note that
     * scanning a child will not update a parent, nor it's siblings. If the asset is not part of a set, this can be
     * set to null.
     */
    @BigIntMin(0)
    @Field(() => GraphQLBigInt, { nullable: true })
    parentId: bigint | null;
}
