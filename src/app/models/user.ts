import { Roles } from "./Role";

export class User {
    id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Roles;
    token: string;
    staff: any;
    staff_id: string;
    userProfile: any;
}