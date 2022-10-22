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
  DateTime: any;
  JSON: any;
};

export type CreateRoleIntput = {
  isDefault?: InputMaybe<Scalars['Boolean']>;
  scp: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateRoleOutput = {
  __typename?: 'CreateRoleOutput';
  id: Scalars['String'];
};

export type CreateRoomInput = {
  capacity: Scalars['Float'];
  description?: InputMaybe<Scalars['String']>;
  language: Scalars['String'];
  topic: Scalars['String'];
};

export type CreateRoomOutput = {
  __typename?: 'CreateRoomOutput';
  id: Scalars['String'];
};

export type DeleteRoleIntput = {
  id: Scalars['String'];
};

export type DeleteRoleOutput = {
  __typename?: 'DeleteRoleOutput';
  id: Scalars['String'];
};

export type DeleteUserInput = {
  id: Scalars['String'];
};

export type DeleteUserOuput = {
  __typename?: 'DeleteUserOuput';
  id: Scalars['String'];
};

export type GetDeletedRolesOutput = {
  __typename?: 'GetDeletedRolesOutput';
  id: Scalars['String'];
  isDefault: Scalars['Boolean'];
  scp: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type GetRoleByIdInput = {
  id: Scalars['String'];
  relations?: InputMaybe<Array<Scalars['String']>>;
};

export type GetRoleByIdOutput = {
  __typename?: 'GetRoleByIdOutput';
  id: Scalars['String'];
  isDefault: Scalars['Boolean'];
  scp: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type GetRolesOutput = {
  __typename?: 'GetRolesOutput';
  id: Scalars['String'];
  isDefault: Scalars['Boolean'];
  scp: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type GetRoomsIntput = {
  pagination: PaginationInput;
  relations?: InputMaybe<Array<Scalars['String']>>;
};

export type GetRoomsOutput = {
  __typename?: 'GetRoomsOutput';
  data: Array<RoomEntity>;
  pagination: Pagination;
};

export type GetUserInput = {
  id: Scalars['String'];
  relations?: InputMaybe<Array<Scalars['String']>>;
};

export type GetUserOutput = {
  __typename?: 'GetUserOutput';
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  emailVerified?: Maybe<Scalars['Boolean']>;
  fullName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  privilege?: Maybe<Array<Privilege>>;
  roles?: Maybe<Array<RoleEntity>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type GetUsersInput = {
  pagination: PaginationInput;
  relations?: InputMaybe<Array<Scalars['String']>>;
};

export type GetUsersOutput = {
  __typename?: 'GetUsersOutput';
  data: Array<UserEntity>;
  pagination: Pagination;
};

export type MeOutput = {
  __typename?: 'MeOutput';
  email: Scalars['String'];
  id: Scalars['String'];
  scp: Array<Scalars['String']>;
  sub: Scalars['String'];
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createRole: CreateRoleOutput;
  createRoom: CreateRoomOutput;
  deleteRole: DeleteRoleOutput;
  deleteUser: DeleteUserOuput;
  recoverRole: RecoverRoleOutput;
  recoverUser: RecoverUserOutput;
  signin: SigninOutput;
  signinByGoogle: SigninOutput;
  signup: SignupOutput;
  updateRole: UpdateRoleOuput;
  updateUser: UpdateUserOutput;
  updateUserByAdmin: UpdateUserByAdminOutput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleIntput;
};


export type MutationCreateRoomArgs = {
  input: CreateRoomInput;
};


export type MutationDeleteRoleArgs = {
  input: DeleteRoleIntput;
};


export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


export type MutationRecoverRoleArgs = {
  input: RecoverRoleIntput;
};


export type MutationRecoverUserArgs = {
  input: RecoverUserInput;
};


export type MutationSigninArgs = {
  input: SigninIntput;
};


export type MutationSigninByGoogleArgs = {
  input: SigninByGoogleIntput;
};


export type MutationSignupArgs = {
  input: Signup;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleIntput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateUserByAdminArgs = {
  input: UpdateUserByAdminInput;
};

export type Pagination = {
  __typename?: 'Pagination';
  limit: Scalars['Float'];
  page: Scalars['Float'];
  totalCount: Scalars['Float'];
};

export type PaginationInput = {
  limit: Scalars['Float'];
  page: Scalars['Float'];
  totalCount?: InputMaybe<Scalars['Float']>;
};

export enum Privilege {
  SuperAdmin = 'SuperAdmin'
}

export type Query = {
  __typename?: 'Query';
  getDeletedRoles: Array<GetDeletedRolesOutput>;
  getDeletedUsers: GetUsersOutput;
  getRoleById: GetRoleByIdOutput;
  getRoles: Array<GetRolesOutput>;
  getRooms: GetRoomsOutput;
  getUser: GetUserOutput;
  getUsers: GetUsersOutput;
  me: MeOutput;
};


export type QueryGetDeletedUsersArgs = {
  input: GetUsersInput;
};


export type QueryGetRoleByIdArgs = {
  input: GetRoleByIdInput;
};


export type QueryGetRoomsArgs = {
  input: GetRoomsIntput;
};


export type QueryGetUserArgs = {
  input: GetUserInput;
};


export type QueryGetUsersArgs = {
  input: GetUsersInput;
};

export type RecoverRoleIntput = {
  id: Scalars['String'];
};

export type RecoverRoleOutput = {
  __typename?: 'RecoverRoleOutput';
  id: Scalars['String'];
};

export type RecoverUserInput = {
  id: Scalars['String'];
};

export type RecoverUserOutput = {
  __typename?: 'RecoverUserOutput';
  id: Scalars['String'];
};

export type RelationshipInput = {
  id: Scalars['String'];
};

export type RoleEntity = {
  __typename?: 'RoleEntity';
  createdAt?: Maybe<Scalars['DateTime']>;
  id?: Maybe<Scalars['String']>;
  isDefault?: Maybe<Scalars['Boolean']>;
  scp?: Maybe<Array<Scalars['String']>>;
  title: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type RoomEntity = {
  __typename?: 'RoomEntity';
  capacity: Scalars['Float'];
  clients?: Maybe<Array<UserEntity>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  creator: UserEntity;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  language: Scalars['String'];
  topic: Scalars['String'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type SigninByGoogleIntput = {
  token: Scalars['String'];
};

export type SigninIntput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SigninOutput = {
  __typename?: 'SigninOutput';
  email: Scalars['String'];
  id: Scalars['String'];
  memberships: Scalars['JSON'];
  refreshToken?: Maybe<Scalars['String']>;
  scp: Array<Scalars['String']>;
  token: Scalars['String'];
};

export type Signup = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SignupOutput = {
  __typename?: 'SignupOutput';
  email: Scalars['String'];
  id: Scalars['String'];
  refreshToken?: Maybe<Scalars['String']>;
  scp: Array<Scalars['String']>;
  token: Scalars['String'];
};

export type UpdateRoleIntput = {
  id: Scalars['String'];
  isDefault?: InputMaybe<Scalars['Boolean']>;
  scp?: InputMaybe<Array<Scalars['String']>>;
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateRoleOuput = {
  __typename?: 'UpdateRoleOuput';
  id: Scalars['String'];
};

export type UpdateUserByAdminInput = {
  id: Scalars['String'];
  roles?: InputMaybe<Array<RelationshipInput>>;
};

export type UpdateUserByAdminOutput = {
  __typename?: 'UpdateUserByAdminOutput';
  id: Scalars['String'];
};

export type UpdateUserInput = {
  fullName?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  mobile?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  profile?: InputMaybe<Scalars['String']>;
  username?: InputMaybe<Scalars['String']>;
};

export type UpdateUserOutput = {
  __typename?: 'UpdateUserOutput';
  id: Scalars['String'];
};

export type UserEntity = {
  __typename?: 'UserEntity';
  createdAt?: Maybe<Scalars['DateTime']>;
  email: Scalars['String'];
  emailVerified?: Maybe<Scalars['Boolean']>;
  fullName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  privilege?: Maybe<Array<Privilege>>;
  roles?: Maybe<Array<RoleEntity>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type SigninMutationVariables = Exact<{
  input: SigninIntput;
}>;


export type SigninMutation = { __typename?: 'Mutation', signin: { __typename?: 'SigninOutput', id: string, email: string, scp: Array<string>, token: string, refreshToken?: string | null } };

export type SigninByGoogleMutationVariables = Exact<{
  input: SigninByGoogleIntput;
}>;


export type SigninByGoogleMutation = { __typename?: 'Mutation', signinByGoogle: { __typename?: 'SigninOutput', id: string, email: string, scp: Array<string>, token: string, refreshToken?: string | null } };

export type CreateRoomMutationVariables = Exact<{
  input: CreateRoomInput;
}>;


export type CreateRoomMutation = { __typename?: 'Mutation', createRoom: { __typename?: 'CreateRoomOutput', id: string } };

export type GetRoomsQueryVariables = Exact<{
  input: GetRoomsIntput;
}>;


export type GetRoomsQuery = { __typename?: 'Query', getRooms: { __typename?: 'GetRoomsOutput', data: Array<{ __typename?: 'RoomEntity', id?: string | null, capacity: number, language: string, description?: string | null, topic: string, createdAt?: any | null }>, pagination: { __typename?: 'Pagination', limit: number, page: number, totalCount: number } } };


export const SigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SigninIntput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"scp"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SigninMutation, SigninMutationVariables>;
export const SigninByGoogleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signinByGoogle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SigninByGoogleIntput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signinByGoogle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"scp"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SigninByGoogleMutation, SigninByGoogleMutationVariables>;
export const CreateRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRoomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateRoomMutation, CreateRoomMutationVariables>;
export const GetRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRooms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetRoomsIntput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetRoomsQuery, GetRoomsQueryVariables>;
export const namedOperations = {
  Query: {
    getRooms: 'getRooms'
  },
  Mutation: {
    signin: 'signin',
    signinByGoogle: 'signinByGoogle',
    createRoom: 'createRoom'
  }
}