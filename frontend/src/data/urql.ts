import gql from "graphql-tag";
import * as Urql from "urql";
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
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
  flags: CreateFlagInput;
  name: Scalars["String"];
  sources: Array<CreateSourceInput>;
};

export type CreatePlaidStartInput = {
  user: Scalars["String"];
};

export type CreateSlackStartInput = {
  user: Scalars["String"];
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

export type Filter = {
  id: Scalars["ID"];
  name: Scalars["String"];
  op: Scalars["String"];
};

export type Flags = {
  __typename?: "Flags";
  enabled: Scalars["Boolean"];
};

export type Mutation = {
  __typename?: "Mutation";
  createPipe: Pipe;
  createPlaidStart: PlaidStart;
  createSlackStart: SlackStart;
  createTodo: Todo;
  removeTodo?: Maybe<Todo>;
  upload: Scalars["String"];
};

export type MutationCreatePipeArgs = {
  input: CreatePipeInput;
};

export type MutationCreatePlaidStartArgs = {
  input: CreatePlaidStartInput;
};

export type MutationCreateSlackStartArgs = {
  input: CreateSlackStartInput;
};

export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};

export type MutationRemoveTodoArgs = {
  id: Scalars["String"];
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

export type PlaidStart = {
  __typename?: "PlaidStart";
  public_token: Scalars["String"];
  state: Scalars["String"];
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

export type SlackStart = {
  __typename?: "SlackStart";
  state: Scalars["String"];
  url: Scalars["String"];
};

export type Source = {
  __typename?: "Source";
  account: PlaidAccount;
  filters: Array<Filter>;
  id: Scalars["ID"];
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

export type TodosQueryVariables = Exact<{ [key: string]: never }>;

export type TodosQuery = {
  __typename?: "Query";
  session: {
    __typename?: "Session";
    currentUser: {
      __typename?: "User";
      todos: Array<{ __typename?: "Todo"; id: string; title: string }>;
    };
  };
};

export type RemoveTodoMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type RemoveTodoMutation = {
  __typename?: "Mutation";
  removeTodo?:
    | { __typename?: "Todo"; id: string; title: string }
    | null
    | undefined;
};

export type CreateTodoMutationVariables = Exact<{
  id: Scalars["String"];
  title: Scalars["String"];
}>;

export type CreateTodoMutation = {
  __typename?: "Mutation";
  createTodo: { __typename?: "Todo"; id: string; title: string };
};

export type UploadMutationVariables = Exact<{
  name: Scalars["String"];
  type: Scalars["String"];
}>;

export type UploadMutation = { __typename?: "Mutation"; upload: string };

export type PipesQueryVariables = Exact<{ [key: string]: never }>;

export type PipesQuery = {
  __typename?: "Query";
  session: {
    __typename?: "Session";
    currentUser: {
      __typename?: "User";
      pipes: Array<{
        __typename?: "Pipe";
        flags: { __typename?: "Flags"; enabled: boolean };
        sources: Array<{
          __typename?: "Source";
          account: {
            __typename?: "PlaidAccount";
            name: string;
            category: string;
            subcategory: string;
          };
          filters: Array<
            | {
                __typename?: "NumberFilter";
                num: number;
                name: string;
                op: string;
              }
            | {
                __typename?: "TextFilter";
                text: string;
                name: string;
                op: string;
              }
          >;
        }>;
        destinations: Array<{
          __typename?: "SlackChannel";
          name: string;
          topic: string;
        }>;
      }>;
    };
  };
};

export type CreatePipeMutationVariables = Exact<{
  input: CreatePipeInput;
}>;

export type CreatePipeMutation = {
  __typename?: "Mutation";
  createPipe: { __typename?: "Pipe"; id: string; name: string };
};

export type ConnectionsQueryVariables = Exact<{ [key: string]: never }>;

export type ConnectionsQuery = {
  __typename?: "Query";
  session: {
    __typename?: "Session";
    currentUser: {
      __typename?: "User";
      connections: Array<
        | {
            __typename?: "PlaidConnection";
            institution: string;
            id: string;
            kind: string;
            accounts: Array<{
              __typename?: "PlaidAccount";
              id: string;
              name: string;
              category: string;
              subcategory: string;
            }>;
          }
        | {
            __typename?: "SlackConnection";
            name: string;
            id: string;
            kind: string;
            channels: Array<{
              __typename?: "SlackChannel";
              id: string;
              name: string;
              topic: string;
              num_members: number;
            }>;
          }
      >;
    };
  };
};

export type CreatePlaidStartMutationVariables = Exact<{
  input: CreatePlaidStartInput;
}>;

export type CreatePlaidStartMutation = {
  __typename?: "Mutation";
  createPlaidStart: {
    __typename?: "PlaidStart";
    public_token: string;
    state: string;
  };
};

export type CreateSlackStartMutationVariables = Exact<{
  input: CreateSlackStartInput;
}>;

export type CreateSlackStartMutation = {
  __typename?: "Mutation";
  createSlackStart: { __typename?: "SlackStart"; url: string };
};

export const TodosDocument = gql`
  query Todos {
    session {
      currentUser {
        todos {
          id
          title
        }
      }
    }
  }
`;

export function useTodosQuery(
  options: Omit<Urql.UseQueryArgs<TodosQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<TodosQuery>({ query: TodosDocument, ...options });
}
export const RemoveTodoDocument = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id) {
      id
      title
    }
  }
`;

export function useRemoveTodoMutation() {
  return Urql.useMutation<RemoveTodoMutation, RemoveTodoMutationVariables>(
    RemoveTodoDocument
  );
}
export const CreateTodoDocument = gql`
  mutation CreateTodo($id: String!, $title: String!) {
    createTodo(input: { id: $id, title: $title }) {
      id
      title
    }
  }
`;

export function useCreateTodoMutation() {
  return Urql.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(
    CreateTodoDocument
  );
}
export const UploadDocument = gql`
  mutation Upload($name: String!, $type: String!) {
    upload(name: $name, type: $type)
  }
`;

export function useUploadMutation() {
  return Urql.useMutation<UploadMutation, UploadMutationVariables>(
    UploadDocument
  );
}
export const PipesDocument = gql`
  query Pipes {
    session {
      currentUser {
        pipes {
          flags {
            enabled
          }
          sources {
            account {
              name
              category
              subcategory
            }
            filters {
              name
              op
              ... on NumberFilter {
                num
              }
              ... on TextFilter {
                text
              }
            }
          }
          destinations {
            name
            topic
          }
        }
      }
    }
  }
`;

export function usePipesQuery(
  options: Omit<Urql.UseQueryArgs<PipesQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<PipesQuery>({ query: PipesDocument, ...options });
}
export const CreatePipeDocument = gql`
  mutation CreatePipe($input: CreatePipeInput!) {
    createPipe(input: $input) {
      id
      name
    }
  }
`;

export function useCreatePipeMutation() {
  return Urql.useMutation<CreatePipeMutation, CreatePipeMutationVariables>(
    CreatePipeDocument
  );
}
export const ConnectionsDocument = gql`
  query Connections {
    session {
      currentUser {
        connections {
          id
          kind
          ... on PlaidConnection {
            institution
            accounts {
              id
              name
              category
              subcategory
            }
          }
          ... on SlackConnection {
            name
            channels {
              id
              name
              topic
              num_members
            }
          }
        }
      }
    }
  }
`;

export function useConnectionsQuery(
  options: Omit<Urql.UseQueryArgs<ConnectionsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<ConnectionsQuery>({
    query: ConnectionsDocument,
    ...options,
  });
}
export const CreatePlaidStartDocument = gql`
  mutation CreatePlaidStart($input: CreatePlaidStartInput!) {
    createPlaidStart(input: $input) {
      public_token
      state
    }
  }
`;

export function useCreatePlaidStartMutation() {
  return Urql.useMutation<
    CreatePlaidStartMutation,
    CreatePlaidStartMutationVariables
  >(CreatePlaidStartDocument);
}
export const CreateSlackStartDocument = gql`
  mutation CreateSlackStart($input: CreateSlackStartInput!) {
    createSlackStart(input: $input) {
      url
    }
  }
`;

export function useCreateSlackStartMutation() {
  return Urql.useMutation<
    CreateSlackStartMutation,
    CreateSlackStartMutationVariables
  >(CreateSlackStartDocument);
}
