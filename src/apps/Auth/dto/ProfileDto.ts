import Profile from "../model/Profile";
import User from "../model/User";
import Grant from "../model/Grant";

/**
 * Data Transfer Object (DTO) for the `Profile` entity.
 */
export default class ProfileDto {
    private id?: string;
    private name: string;
    private description: string;
    private users?: User[];
    private associatedGrants?: Grant[];

    /**
     * Creates an instance of the ProfileDto class.
     * 
     * @param name - The name of the profile.
     * @param description - A description of the profile.
     * @param users - Optional list of users associated with the profile.
     * @param associatedGrants - Optional list of grants associated with the profile.
     */
    constructor(
        name: string,
        description: string,
        users?: User[],
        associatedGrants?: Grant[],
    ) {
        this.name = name;
        this.description = description;
        this.users = users;
        this.associatedGrants = associatedGrants;
    }

    /**
     * Gets the ID of the profile.
     * 
     * @returns {string | undefined} The ID of the profile.
     */
    public getId(): string | undefined {
        return this.id;
    }

    /**
     * Sets the ID of the profile.
     * 
     * @param id - The ID of the profile.
     */
    public setId(id: string): void {
        this.id = id;
    }

    /**
     * Gets the name of the profile.
     * 
     * @returns {string} The name of the profile.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Sets the name of the profile.
     * 
     * @param name - The name of the profile.
     */
    public setName(name: string): void {
        if (name !== null && name.trim() !== "") 
            this.name = name;
    }

    /**
     * Gets the description of the profile.
     * 
     * @returns {string} The description of the profile.
     */
    public getDescription(): string {
        return this.description;
    }

    /**
     * Sets the description of the profile.
     * 
     * @param description - The description of the profile.
     */
    public setDescription(description: string): void {
        if (description !== null && description.trim() !== "") 
            this.description = description;
    }

    /**
     * Gets the list of users associated with the profile.
     * 
     * @returns {User[] | undefined} The list of users.
     */
    public getUsers(): User[] | undefined {
        return this.users;
    }

    /**
     * Sets the list of users associated with the profile.
     * 
     * @param users - The list of users.
     */
    public setUsers(users: User[]): void {
        this.users = users;
    }

    /**
     * Gets the list of grants associated with the profile.
     * 
     * @returns {Grant[] | undefined} The list of grants.
     */
    public getAssociatedGrants(): Grant[] | undefined {
        return this.associatedGrants;
    }

    /**
     * Sets the list of grants associated with the profile.
     * 
     * @param associatedGrants - The list of grants.
     */
    public setAssociatedGrants(associatedGrants: Grant[]): void {
        this.associatedGrants = associatedGrants;
    }

    /**
     * Checks if the ProfileDto is valid.
     * 
     * @returns {boolean} True if the ProfileDto is valid, false otherwise.
     */
    public isValid(): boolean {
        return (
            this.name !== null && this.name.trim() !== "" &&
            this.description !== null && this.description.trim() !== ""
        );
    }

    /**
     * Converts the ProfileDto to a Profile entity.
     * 
     * @returns {Profile} The Profile entity created from the DTO.
     */
    public toProfile(): Profile {
        const now: Date = new Date();
        const profile = new Profile(this.name, this.description, this.users, this.associatedGrants, now, now);
        return profile;
    }
}
