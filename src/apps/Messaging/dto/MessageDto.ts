import Sector from "../../Api/model/Sector";
import User from "../../Auth/model/User";
import Message from "../model/Message";

/**
 * Data Transfer Object (DTO) for the `Message` entity.
 * Used to transfer data between layers and interact with the `Message` entity.
 */
export default class MessageDto {
  private id?: string;
  private text: string;
  private sender: User;
  private receiver?: User;
  private receiverSector?: Sector;

  constructor(
    text: string,
    sender: User,
    receiver?: User,
    receiverSector?: Sector
  ) {
    this.text = text;
    this.sender = sender;
    this.receiver = receiver;
    this.receiverSector = receiverSector;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getText(): string {
    return this.text;
  }

  public setText(text: string): void {
    this.text = text;
  }

  public getSender(): User {
    return this.sender;
  }

  public setSender(sender: User): void {
    this.sender = sender;
  }

  public getReceiver(): User | undefined {
    return this.receiver;
  }

  public setReceiver(receiver: User): void {
    this.receiver = receiver;
  }

  public getReceiverSector(): Sector | undefined {
    return this.receiverSector;
  }

  public setReceiverSector(receiverSector: Sector): void {
    this.receiverSector = receiverSector;
  }

  /**
   * Retrieves the ID of the sender.
   *
   * @returns {string} The ID of the sender user.
   */
  public getSenderId(): string {
    return this.sender.id;
  }

  /**
   * Retrieves the ID of the receiver, if set.
   *
   * @returns {string | undefined} The ID of the receiver user or undefined.
   */
  public getReceiverId(): string | undefined {
    return this.receiver?.id;
  }

  /**
   * Retrieves the ID of the receiver sector, if set.
   *
   * @returns {string | undefined} The ID of the sector or undefined.
   */
  public getReceiverSectorId(): string | undefined {
    return this.receiverSector?.id;
  }

  /**
   * Validates if the DTO has the required properties.
   *
   * @returns {boolean} True if valid, otherwise false.
   */
  public isValid(): boolean {
    return (
      this.text &&
      this.text.trim() !== "" &&
      this.sender !== null &&
      (this.receiver !== undefined || this.receiverSector !== undefined)
    );
  }

  /**
   * Converts this DTO to a Message entity.
   *
   * @returns {Message} The Message entity created from this DTO.
   */
  public toMessage(): Message {
    return new Message(
      this.text,
      this.sender,
      this.receiver ?? null,
      this.receiverSector ?? null,
      new Date()
    );
  }
}
