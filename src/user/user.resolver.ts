import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {PrismaService} from "../prisma/prisma.service";
import {validate} from "class-validator";
import {plainToClass} from "class-transformer";
import {BadRequestException, Logger, Session} from "@nestjs/common";
import {Rule} from "../casl/rule.decorator";
import {AbilityAction} from "../casl/casl-ability.factory";

@Resolver(() => User)
export class UserResolver {
  private logger: Logger = new Logger('UserResolver')
  constructor(private readonly prisma: PrismaService) {}

  @Query(() => [User])
  async findManyUser(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  @Query(() => User, { nullable: true })
  async findOneUser(@Args('id', { type: () => Int}) id: number): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        id
      }
    })
  }

  @Query(() => User, { nullable: true })
  @Rule((ability) => ability.can(AbilityAction.Read, User))
  async self(@Session() session: Record<string, any>, @Context() ctx: any): Promise<User|null> {
    return ctx.req.user || null;
  }

  @Mutation(() => User)
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
  async updateUser(@Args('id', {type: () => Int}) id: number, @Args('input', {type: () => UpdateUserInput}) input: UpdateUserInput): Promise<User> {
    // TODO
    return new User();
  }
}
