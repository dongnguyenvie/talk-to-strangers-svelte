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
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type CreateOneRoomInput = {
  capacity: Scalars['Float'];
  description?: InputMaybe<Scalars['String']>;
  language: Scalars['String'];
  topic: Scalars['String'];
};

export type CreateOneRoomOutput = {
  __typename?: 'CreateOneRoomOutput';
  id: Scalars['String'];
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

export type DeleteRoleIntput = {
  id: Scalars['String'];
};

export type DeleteRoleOutput = {
  __typename?: 'DeleteRoleOutput';
  id: Scalars['String'];
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

export type GetRolesWasDeletedOutput = {
  __typename?: 'GetRolesWasDeletedOutput';
  id: Scalars['String'];
  isDefault: Scalars['Boolean'];
  scp: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type GetRoomsIntput = {
  pagination: PaginationIntput;
  relations?: InputMaybe<Array<Scalars['String']>>;
};

export type GetRoomsOutput = {
  __typename?: 'GetRoomsOutput';
  data: Array<RoomEntity>;
  pagination: Pagination;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** {"publ":false,"t":"Tạo room","desc":"","sys":false,"sub":false,"gr":"room","d":false} */
  createOneRoom: CreateOneRoomOutput;
  /** {"publ":false,"t":"Tạo vai trò người dùng","desc":"","sys":false,"sub":false,"gr":"role","d":false} */
  createRole: CreateRoleOutput;
  /** {"publ":false,"t":"Xóa vai trò người dùng","desc":"","sys":false,"sub":false,"gr":"role","d":false} */
  deleteRole: DeleteRoleOutput;
  /** {"publ":false,"t":"Phục hồi quyền","desc":"","sys":true,"sub":false,"gr":"role","d":false} */
  recoverRole: RecoverRoleOutput;
  /** {"publ":true,"t":"Đăng nhập","desc":"","sys":false,"sub":false,"gr":"auth","d":false} */
  signin: SigninOutput;
  /** {"publ":true,"t":"Đăng kí","desc":"","sys":false,"sub":false,"gr":"auth","d":false} */
  signup: SignupOutput;
  /** {"publ":false,"t":"Cập nhập vai trò người dùng","desc":"","sys":false,"sub":false,"gr":"role","d":false} */
  updateRole: UpdateRoleOuput;
};


export type MutationCreateOneRoomArgs = {
  input: CreateOneRoomInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleIntput;
};


export type MutationDeleteRoleArgs = {
  input: DeleteRoleIntput;
};


export type MutationRecoverRoleArgs = {
  input: RecoverRoleIntput;
};


export type MutationSigninArgs = {
  input: SigninIntput;
};


export type MutationSignupArgs = {
  input: Signup;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleIntput;
};

export type Pagination = {
  __typename?: 'Pagination';
  limit: Scalars['Float'];
  page: Scalars['Float'];
  totalCount: Scalars['Float'];
};

export type PaginationIntput = {
  limit: Scalars['Float'];
  page: Scalars['Float'];
  totalCount?: InputMaybe<Scalars['Float']>;
};

export enum Privilege {
  SuperAdmin = 'SuperAdmin'
}

export type Query = {
  __typename?: 'Query';
  /** {"publ":true,"t":"Lấy vai trò bằng ID","desc":"","sys":false,"sub":false,"gr":"role","d":false} */
  getRoleById: GetRoleByIdOutput;
  /** {"publ":true,"t":"Lấy danh sách vai trò","desc":"","sys":false,"sub":false,"gr":"role","d":false} */
  getRoles: Array<GetRolesOutput>;
  /** {"publ":false,"t":"Danh sách vai trò đã xóa","desc":"","sys":true,"sub":false,"gr":"role","d":false} */
  getRolesWasDeleted: Array<GetRolesWasDeletedOutput>;
  /** {"publ":false,"t":"Lấy danh sách room","desc":"","sys":false,"sub":false,"gr":"room","d":false} */
  getRooms: GetRoomsOutput;
};


export type QueryGetRoleByIdArgs = {
  input: GetRoleByIdInput;
};


export type QueryGetRoomsArgs = {
  input: GetRoomsIntput;
};

export type RecoverRoleIntput = {
  id: Scalars['String'];
};

export type RecoverRoleOutput = {
  __typename?: 'RecoverRoleOutput';
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
  /** Email to login */
  email: Scalars['String'];
  /** Password */
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

export type CreateOneRoomMutationVariables = Exact<{
  input: CreateOneRoomInput;
}>;


export type CreateOneRoomMutation = { __typename?: 'Mutation', createOneRoom: { __typename?: 'CreateOneRoomOutput', id: string } };

export type GetRoomsQueryVariables = Exact<{
  input: GetRoomsIntput;
}>;


export type GetRoomsQuery = { __typename?: 'Query', getRooms: { __typename?: 'GetRoomsOutput', data: Array<{ __typename?: 'RoomEntity', id?: string | null, capacity: number, language: string, description?: string | null, topic: string, createdAt?: any | null }>, pagination: { __typename?: 'Pagination', limit: number, page: number, totalCount: number } } };


export const SigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SigninIntput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"scp"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SigninMutation, SigninMutationVariables>;
export const CreateOneRoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createOneRoom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOneRoomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOneRoom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateOneRoomMutation, CreateOneRoomMutationVariables>;
export const GetRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"getRooms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GetRoomsIntput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getRooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"capacity"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"topic"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pagination"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]} as unknown as DocumentNode<GetRoomsQuery, GetRoomsQueryVariables>;
export const namedOperations = {
  Query: {
    getRooms: 'getRooms'
  },
  Mutation: {
    signin: 'signin',
    createOneRoom: 'createOneRoom'
  }
}