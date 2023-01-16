import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {PrismaService} from "../prisma/prisma.service";
import {validate} from "class-validator";
import {plainToClass} from "class-transformer";
import {BadRequestException, Logger, Session} from "@nestjs/common";
import {Rules} from "../casl/rules.decorator";
import {AbilityAction} from "../casl/casl-ability.factory";
import {accessibleBy} from "@casl/prisma";

@Resolver(() => User)
export class UserResolver {
  private logger: Logger = new Logger('UserResolver')
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [User])
  @Rules("Read users", AbilityAction.Read, User)
  async findManyUser(@Context() ctx: any): Promise<User[]> {
    return this.prisma.user.findMany({
      where: accessibleBy(ctx.req.permissions).User
    });
  }

  @Query(() => User, { nullable: true })
  @Rules("Read user", AbilityAction.Read, User)
  async findOneUser(@Args('id', { type: () => Int}) id: number, @Context() ctx: any): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        AND: [
          { id },
          accessibleBy(ctx.req.permissions).User
        ]
      }
    })
  }

  @Query(() => User, { nullable: true })
  @Rules("Read users", AbilityAction.Read, User)
  async self(@Session() session: Record<string, any>, @Context() ctx: any): Promise<User|null> {
    return ctx.req.user || null;
  }

  @Mutation(() => User)
  @Rules("Create user", AbilityAction.Create, User)
  async createUser(@Args('input', {type: () => CreateUserInput}) input: CreateUserInput): Promise<User> {
    // TODO
    input = plainToClass(CreateUserInput, input);
    const errors = await validate(input, {skipMissingProperties: true});
    if(errors.length > 0) {
      const firstErrorFirstConstraint = errors[0].constraints[Object.keys(errors[0].constraints)[0]]
      throw new BadRequestException(firstErrorFirstConstraint);
    }
    return this.prisma.user.create({
      data: input
    })
  }

  @Mutation(() => User)
  @Rules("Update user", AbilityAction.Update, User)
  async updateUser(@Args('id', {type: () => Int}) id: number, @Args('input', {type: () => UpdateUserInput}) input: UpdateUserInput): Promise<User> {
    // TODO
    return new User();
  }

  @Mutation(() => User)
  @Rules("Delete user", AbilityAction.Delete, User)
  async deleteUser(@Args('id', {type: () => Int}) id: number): Promise<User> {
    // TODO
    return new User();
  }
}
