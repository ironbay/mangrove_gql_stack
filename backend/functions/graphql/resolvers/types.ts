import { GraphQLResolveInfo } from "graphql";
import { Context } from "@mangrove/core";
import { DeepPartial } from "utility-types";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Connection = {
  id: Scalars["ID"];
  kind: Scalars["String"];
};

export type CreateFiltersInput = {
  num: CreateNumberFilter;
  text: CreateTextFilter;
};

export type CreateFlagInput = {
  enabled: Scalars["Boolean"];
};

export type CreateNumberFilter = {
  name: Scalars["String"];
  num: Scalars["Int"];
  op: Scalars["String"];
};

export type CreatePipeInput = {
  flag: CreateFlagInput;
  name: Scalars["String"];
  sources: Array<CreateSourceInput>;
};

export type CreateSourceInput = {
  account: Scalars["String"];
  filters: CreateFiltersInput;
};

export type CreateTextFilter = {
  name: Scalars["String"];
  op: Scalars["String"];
  text: Scalars["String"];
};

export type CreateTodoInput = {
  id: Scalars["String"];
  title: Scalars["String"];
};

export type Debug = {
  __typename?: "Debug";
  database: Scalars["String"];
};

export type Destination = {
  __typename?: "Destination";
  channel: SlackChannel;
  conn: SlackConnection;
  id: Scalars["ID"];
  kind: Scalars["String"];
};

export type Filter = {
  id: Scalars["ID"];
  name: Scalars["String"];
  op: Scalars["String"];
};

export type FinishPlaidAuth = {
  __typename?: "FinishPlaidAuth";
  item_id: Scalars["String"];
};

export type FinishPlaidAuthInput = {
  public_token: Scalars["String"];
  user: Scalars["String"];
};

export type Flags = {
  __typename?: "Flags";
  enabled: Scalars["Boolean"];
};

export type Mutation = {
  __typename?: "Mutation";
  createPipe: Pipe;
  createTodo: Todo;
  finishPlaidAuth: FinishPlaidAuth;
  removePipe: Pipe;
  removePlaidConnection: PlaidConnection;
  removeSlackConnection: SlackConnection;
  removeTodo?: Maybe<Todo>;
  startPlaidAuth: StartPlaidAuth;
  startSlackAuth: StartSlackAuth;
  upload: Scalars["String"];
};

export type MutationCreatePipeArgs = {
  input: CreatePipeInput;
};

export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};

export type MutationFinishPlaidAuthArgs = {
  input: FinishPlaidAuthInput;
};

export type MutationRemovePipeArgs = {
  id: Scalars["String"];
};

export type MutationRemovePlaidConnectionArgs = {
  id: Scalars["String"];
};

export type MutationRemoveSlackConnectionArgs = {
  id: Scalars["String"];
};

export type MutationRemoveTodoArgs = {
  id: Scalars["String"];
};

export type MutationStartPlaidAuthArgs = {
  input: StartPlaidAuthInput;
};

export type MutationStartSlackAuthArgs = {
  input: StartSlackAuthInput;
};

export type MutationUploadArgs = {
  name: Scalars["String"];
  type: Scalars["String"];
};

export type NumberFilter = Filter & {
  __typename?: "NumberFilter";
  id: Scalars["ID"];
  name: Scalars["String"];
  num: Scalars["Int"];
  op: Scalars["String"];
};

export type Pipe = {
  __typename?: "Pipe";
  destinations: Array<SlackChannel>;
  flags: Flags;
  id: Scalars["ID"];
  name: Scalars["String"];
  sources: Array<Source>;
};

export type PlaidAccount = {
  __typename?: "PlaidAccount";
  category: Scalars["String"];
  id: Scalars["ID"];
  name: Scalars["String"];
  subcategory: Scalars["String"];
};

export type PlaidConnection = Connection & {
  __typename?: "PlaidConnection";
  accounts: Array<PlaidAccount>;
  id: Scalars["ID"];
  institution: Scalars["String"];
  kind: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  debug: Debug;
  session: Session;
  user: User;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type RemovePlaidConnection = {
  __typename?: "RemovePlaidConnection";
  id: Scalars["ID"];
};

export type RemovePlaidConnectionInput = {
  id: Scalars["ID"];
};

export type Session = {
  __typename?: "Session";
  currentUser: User;
};

export type SlackChannel = {
  __typename?: "SlackChannel";
  id: Scalars["ID"];
  name: Scalars["String"];
  num_members: Scalars["Int"];
  topic: Scalars["String"];
};

export type SlackConnection = Connection & {
  __typename?: "SlackConnection";
  channels: Array<SlackChannel>;
  id: Scalars["ID"];
  kind: Scalars["String"];
  name: Scalars["String"];
};

export type Source = {
  __typename?: "Source";
  account: PlaidAccount;
  connection?: Maybe<PlaidConnection>;
  filters: Array<Filter>;
  id: Scalars["ID"];
  kind: Scalars["String"];
};

export type StartPlaidAuth = {
  __typename?: "StartPlaidAuth";
  link_token: Scalars["String"];
  state: Scalars["String"];
};

export type StartPlaidAuthInput = {
  user: Scalars["String"];
};

export type StartSlackAuth = {
  __typename?: "StartSlackAuth";
  url: Scalars["String"];
  user: Scalars["String"];
};

export type StartSlackAuthInput = {
  user: Scalars["String"];
};

export type TextFilter = Filter & {
  __typename?: "TextFilter";
  id: Scalars["ID"];
  name: Scalars["String"];
  op: Scalars["String"];
  text: Scalars["String"];
};

export type Todo = {
  __typename?: "Todo";
  id: Scalars["ID"];
  title: Scalars["String"];
};

export type User = {
  __typename?: "User";
  connections: Array<Connection>;
  id: Scalars["ID"];
  pipes: Array<Pipe>;
  todos: Array<Todo>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> = ResolverFn<TResult, TParent, TContext, TArgs>;

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

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<DeepPartial<Scalars["Boolean"]>>;
  Connection:
    | ResolversTypes["PlaidConnection"]
    | ResolversTypes["SlackConnection"];
  CreateFiltersInput: ResolverTypeWrapper<DeepPartial<CreateFiltersInput>>;
  CreateFlagInput: ResolverTypeWrapper<DeepPartial<CreateFlagInput>>;
  CreateNumberFilter: ResolverTypeWrapper<DeepPartial<CreateNumberFilter>>;
  CreatePipeInput: ResolverTypeWrapper<DeepPartial<CreatePipeInput>>;
  CreateSourceInput: ResolverTypeWrapper<DeepPartial<CreateSourceInput>>;
  CreateTextFilter: ResolverTypeWrapper<DeepPartial<CreateTextFilter>>;
  CreateTodoInput: ResolverTypeWrapper<DeepPartial<CreateTodoInput>>;
  Debug: ResolverTypeWrapper<DeepPartial<Debug>>;
  Destination: ResolverTypeWrapper<DeepPartial<Destination>>;
  Filter: ResolversTypes["NumberFilter"] | ResolversTypes["TextFilter"];
  FinishPlaidAuth: ResolverTypeWrapper<DeepPartial<FinishPlaidAuth>>;
  FinishPlaidAuthInput: ResolverTypeWrapper<DeepPartial<FinishPlaidAuthInput>>;
  Flags: ResolverTypeWrapper<DeepPartial<Flags>>;
  ID: ResolverTypeWrapper<DeepPartial<Scalars["ID"]>>;
  Int: ResolverTypeWrapper<DeepPartial<Scalars["Int"]>>;
  Mutation: ResolverTypeWrapper<{}>;
  NumberFilter: ResolverTypeWrapper<DeepPartial<NumberFilter>>;
  Pipe: ResolverTypeWrapper<DeepPartial<Pipe>>;
  PlaidAccount: ResolverTypeWrapper<DeepPartial<PlaidAccount>>;
  PlaidConnection: ResolverTypeWrapper<DeepPartial<PlaidConnection>>;
  Query: ResolverTypeWrapper<{}>;
  RemovePlaidConnection: ResolverTypeWrapper<
    DeepPartial<RemovePlaidConnection>
  >;
  RemovePlaidConnectionInput: ResolverTypeWrapper<
    DeepPartial<RemovePlaidConnectionInput>
  >;
  Session: ResolverTypeWrapper<DeepPartial<Session>>;
  SlackChannel: ResolverTypeWrapper<DeepPartial<SlackChannel>>;
  SlackConnection: ResolverTypeWrapper<DeepPartial<SlackConnection>>;
  Source: ResolverTypeWrapper<DeepPartial<Source>>;
  StartPlaidAuth: ResolverTypeWrapper<DeepPartial<StartPlaidAuth>>;
  StartPlaidAuthInput: ResolverTypeWrapper<DeepPartial<StartPlaidAuthInput>>;
  StartSlackAuth: ResolverTypeWrapper<DeepPartial<StartSlackAuth>>;
  StartSlackAuthInput: ResolverTypeWrapper<DeepPartial<StartSlackAuthInput>>;
  String: ResolverTypeWrapper<DeepPartial<Scalars["String"]>>;
  TextFilter: ResolverTypeWrapper<DeepPartial<TextFilter>>;
  Todo: ResolverTypeWrapper<DeepPartial<Todo>>;
  User: ResolverTypeWrapper<DeepPartial<User>>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: DeepPartial<Scalars["Boolean"]>;
  Connection:
    | ResolversParentTypes["PlaidConnection"]
    | ResolversParentTypes["SlackConnection"];
  CreateFiltersInput: DeepPartial<CreateFiltersInput>;
  CreateFlagInput: DeepPartial<CreateFlagInput>;
  CreateNumberFilter: DeepPartial<CreateNumberFilter>;
  CreatePipeInput: DeepPartial<CreatePipeInput>;
  CreateSourceInput: DeepPartial<CreateSourceInput>;
  CreateTextFilter: DeepPartial<CreateTextFilter>;
  CreateTodoInput: DeepPartial<CreateTodoInput>;
  Debug: DeepPartial<Debug>;
  Destination: DeepPartial<Destination>;
  Filter:
    | ResolversParentTypes["NumberFilter"]
    | ResolversParentTypes["TextFilter"];
  FinishPlaidAuth: DeepPartial<FinishPlaidAuth>;
  FinishPlaidAuthInput: DeepPartial<FinishPlaidAuthInput>;
  Flags: DeepPartial<Flags>;
  ID: DeepPartial<Scalars["ID"]>;
  Int: DeepPartial<Scalars["Int"]>;
  Mutation: {};
  NumberFilter: DeepPartial<NumberFilter>;
  Pipe: DeepPartial<Pipe>;
  PlaidAccount: DeepPartial<PlaidAccount>;
  PlaidConnection: DeepPartial<PlaidConnection>;
  Query: {};
  RemovePlaidConnection: DeepPartial<RemovePlaidConnection>;
  RemovePlaidConnectionInput: DeepPartial<RemovePlaidConnectionInput>;
  Session: DeepPartial<Session>;
  SlackChannel: DeepPartial<SlackChannel>;
  SlackConnection: DeepPartial<SlackConnection>;
  Source: DeepPartial<Source>;
  StartPlaidAuth: DeepPartial<StartPlaidAuth>;
  StartPlaidAuthInput: DeepPartial<StartPlaidAuthInput>;
  StartSlackAuth: DeepPartial<StartSlackAuth>;
  StartSlackAuthInput: DeepPartial<StartSlackAuthInput>;
  String: DeepPartial<Scalars["String"]>;
  TextFilter: DeepPartial<TextFilter>;
  Todo: DeepPartial<Todo>;
  User: DeepPartial<User>;
}>;

export type ConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Connection"] = ResolversParentTypes["Connection"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "PlaidConnection" | "SlackConnection",
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type DebugResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Debug"] = ResolversParentTypes["Debug"]
> = ResolversObject<{
  database?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DestinationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Destination"] = ResolversParentTypes["Destination"]
> = ResolversObject<{
  channel?: Resolver<ResolversTypes["SlackChannel"], ParentType, ContextType>;
  conn?: Resolver<ResolversTypes["SlackConnection"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FilterResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Filter"] = ResolversParentTypes["Filter"]
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    "NumberFilter" | "TextFilter",
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  op?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
}>;

export type FinishPlaidAuthResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["FinishPlaidAuth"] = ResolversParentTypes["FinishPlaidAuth"]
> = ResolversObject<{
  item_id?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FlagsResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Flags"] = ResolversParentTypes["Flags"]
> = ResolversObject<{
  enabled?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  createPipe?: Resolver<
    ResolversTypes["Pipe"],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePipeArgs, "input">
  >;
  createTodo?: Resolver<
    ResolversTypes["Todo"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTodoArgs, "input">
  >;
  finishPlaidAuth?: Resolver<
    ResolversTypes["FinishPlaidAuth"],
    ParentType,
    ContextType,
    RequireFields<MutationFinishPlaidAuthArgs, "input">
  >;
  removePipe?: Resolver<
    ResolversTypes["Pipe"],
    ParentType,
    ContextType,
    RequireFields<MutationRemovePipeArgs, "id">
  >;
  removePlaidConnection?: Resolver<
    ResolversTypes["PlaidConnection"],
    ParentType,
    ContextType,
    RequireFields<MutationRemovePlaidConnectionArgs, "id">
  >;
  removeSlackConnection?: Resolver<
    ResolversTypes["SlackConnection"],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveSlackConnectionArgs, "id">
  >;
  removeTodo?: Resolver<
    Maybe<ResolversTypes["Todo"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveTodoArgs, "id">
  >;
  startPlaidAuth?: Resolver<
    ResolversTypes["StartPlaidAuth"],
    ParentType,
    ContextType,
    RequireFields<MutationStartPlaidAuthArgs, "input">
  >;
  startSlackAuth?: Resolver<
    ResolversTypes["StartSlackAuth"],
    ParentType,
    ContextType,
    RequireFields<MutationStartSlackAuthArgs, "input">
  >;
  upload?: Resolver<
    ResolversTypes["String"],
    ParentType,
    ContextType,
    RequireFields<MutationUploadArgs, "name" | "type">
  >;
}>;

export type NumberFilterResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["NumberFilter"] = ResolversParentTypes["NumberFilter"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  num?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  op?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PipeResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Pipe"] = ResolversParentTypes["Pipe"]
> = ResolversObject<{
  destinations?: Resolver<
    Array<ResolversTypes["SlackChannel"]>,
    ParentType,
    ContextType
  >;
  flags?: Resolver<ResolversTypes["Flags"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  sources?: Resolver<Array<ResolversTypes["Source"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlaidAccountResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PlaidAccount"] = ResolversParentTypes["PlaidAccount"]
> = ResolversObject<{
  category?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  subcategory?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlaidConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["PlaidConnection"] = ResolversParentTypes["PlaidConnection"]
> = ResolversObject<{
  accounts?: Resolver<
    Array<ResolversTypes["PlaidAccount"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  institution?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  debug?: Resolver<ResolversTypes["Debug"], ParentType, ContextType>;
  session?: Resolver<ResolversTypes["Session"], ParentType, ContextType>;
  user?: Resolver<
    ResolversTypes["User"],
    ParentType,
    ContextType,
    RequireFields<QueryUserArgs, "id">
  >;
}>;

export type RemovePlaidConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["RemovePlaidConnection"] = ResolversParentTypes["RemovePlaidConnection"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SessionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Session"] = ResolversParentTypes["Session"]
> = ResolversObject<{
  currentUser?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SlackChannelResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SlackChannel"] = ResolversParentTypes["SlackChannel"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  num_members?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  topic?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SlackConnectionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["SlackConnection"] = ResolversParentTypes["SlackConnection"]
> = ResolversObject<{
  channels?: Resolver<
    Array<ResolversTypes["SlackChannel"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SourceResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Source"] = ResolversParentTypes["Source"]
> = ResolversObject<{
  account?: Resolver<ResolversTypes["PlaidAccount"], ParentType, ContextType>;
  connection?: Resolver<
    Maybe<ResolversTypes["PlaidConnection"]>,
    ParentType,
    ContextType
  >;
  filters?: Resolver<Array<ResolversTypes["Filter"]>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  kind?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StartPlaidAuthResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["StartPlaidAuth"] = ResolversParentTypes["StartPlaidAuth"]
> = ResolversObject<{
  link_token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  state?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StartSlackAuthResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["StartSlackAuth"] = ResolversParentTypes["StartSlackAuth"]
> = ResolversObject<{
  url?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TextFilterResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["TextFilter"] = ResolversParentTypes["TextFilter"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  op?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  text?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TodoResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Todo"] = ResolversParentTypes["Todo"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = ResolversObject<{
  connections?: Resolver<
    Array<ResolversTypes["Connection"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  pipes?: Resolver<Array<ResolversTypes["Pipe"]>, ParentType, ContextType>;
  todos?: Resolver<Array<ResolversTypes["Todo"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Connection?: ConnectionResolvers<ContextType>;
  Debug?: DebugResolvers<ContextType>;
  Destination?: DestinationResolvers<ContextType>;
  Filter?: FilterResolvers<ContextType>;
  FinishPlaidAuth?: FinishPlaidAuthResolvers<ContextType>;
  Flags?: FlagsResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NumberFilter?: NumberFilterResolvers<ContextType>;
  Pipe?: PipeResolvers<ContextType>;
  PlaidAccount?: PlaidAccountResolvers<ContextType>;
  PlaidConnection?: PlaidConnectionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RemovePlaidConnection?: RemovePlaidConnectionResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  SlackChannel?: SlackChannelResolvers<ContextType>;
  SlackConnection?: SlackConnectionResolvers<ContextType>;
  Source?: SourceResolvers<ContextType>;
  StartPlaidAuth?: StartPlaidAuthResolvers<ContextType>;
  StartSlackAuth?: StartSlackAuthResolvers<ContextType>;
  TextFilter?: TextFilterResolvers<ContextType>;
  Todo?: TodoResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
