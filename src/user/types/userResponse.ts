import {UserType} from "./userResponse.type";

export interface userResponseInterface {
  user: UserType & {token: string}
}
