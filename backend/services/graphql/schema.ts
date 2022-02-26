export const typeDefs = `schema{query:Query mutation:Mutation}interface Connection{id:ID!kind:String!}input CreateFiltersInput{num:CreateNumberFilter!text:CreateTextFilter!}input CreateFlagInput{enabled:Boolean!}input CreateNumberFilter{name:String!num:Int!op:String!}input CreatePipeInput{flags:CreateFlagInput!name:String!sources:[CreateSourceInput!]!}input CreatePlaidStartInput{user:String!}input CreateSlackStartInput{user:String!}input CreateSourceInput{account:String!filters:CreateFiltersInput!}input CreateTextFilter{name:String!op:String!text:String!}input CreateTodoInput{id:String!title:String!}type Debug{database:String!}interface Filter{id:ID!name:String!op:String!}type Flags{enabled:Boolean!}type Mutation{createPipe(input:CreatePipeInput!):Pipe!createPlaidStart(input:CreatePlaidStartInput!):PlaidStart!createSlackStart(input:CreateSlackStartInput!):SlackStart!createTodo(input:CreateTodoInput!):Todo!removeTodo(id:String!):Todo upload(name:String!type:String!):String!}type NumberFilter implements Filter{id:ID!name:String!num:Int!op:String!}type Pipe{destinations:[SlackChannel!]!flags:Flags!id:ID!name:String!sources:[Source!]!}type PlaidAccount{category:String!id:ID!name:String!subcategory:String!}type PlaidConnection implements Connection{accounts:[PlaidAccount!]!id:ID!institution:String!kind:String!}type PlaidStart{public_token:String!state:String!}type Query{debug:Debug!session:Session!user(id:ID!):User!}type Session{currentUser:User!}type SlackChannel{id:ID!name:String!num_members:Int!topic:String!}type SlackConnection implements Connection{channels:[SlackChannel!]!id:ID!kind:String!name:String!}type SlackStart{state:String!url:String!}type Source{account:PlaidAccount!filters:[Filter!]!id:ID!}type TextFilter implements Filter{id:ID!name:String!op:String!text:String!}type Todo{id:ID!title:String!}type User{connections:[Connection!]!id:ID!pipes:[Pipe!]!todos:[Todo!]!}`;
