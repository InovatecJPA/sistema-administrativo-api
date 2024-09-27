import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "../../Messaging/model/Message";
import User from "../model/User";

/**
 * Class representing a group of users.
 */
@Entity("user_groups")
class UserGroup {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column("group_name")
  public groupName: string;

  @OneToMany(() => User, (user) => user.group)
  public users: User[];

  @OneToMany(() => Message, (message) => message.receiverGroup)
  messages: Message[];

  /**
   * Creates a UserGroup instance.
   * @param groupName - The name of the user group.
   */
  constructor(groupName: string) {
    this.groupName = groupName;
    this.users = [];
  }

  /**
   * Gets the unique identifier of the user group.
   * @returns The unique ID of the group.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Adds a user to the group.
   * @param user - The user to be added to the group.
   * @returns A boolean indicating whether the user was added successfully.
   */
  public addUser(user: User): boolean {
    if (!this.users.includes(user)) {
      this.users.push(user);
      return true; // User added successfully
    }
    return false;
  }

  /**
   * Removes a user from the group.
   * @param user - The user to be removed from the group.
   * @returns A boolean indicating whether the user was removed successfully.
   */
  public removeUser(user: User): boolean {
    const index = this.users.indexOf(user);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Checks if a user is in the group.
   * @param user - The user to check.
   * @returns A boolean indicating whether the user is in the group.
   */
  public hasUser(user: User): boolean {
    return this.users.includes(user);
  }

  /**
   * Gets the list of users in the group.
   * @returns An array of users in the group.
   */
  public getUsers(): User[] {
    return this.users;
  }

  /**
   * Gets the name of the user group.
   * @returns The name of the group.
   */
  public getGroupName(): string {
    return this.groupName;
  }
}

export default UserGroup;
