/**
 * Message schema
 * ---------------------------------------------------------------------------
 * Represents a single chat message exchanged between two users.
 *
 * Design considerations
 * ---------------------
 * • Messages support either plain text or an image URL (one or both may be set).
 * • A bidirectional model (senderId → receiverId) keeps reads simple for
 *   point‑to‑point conversations while still allowing efficient inbox queries.
 * • `timestamps: true` automatically records `createdAt` and `updatedAt`,
 *   enabling chronological ordering and soft‑delete strategies if required.
 *
 * Indexing strategy (future work)
 * -------------------------------
 * For high‑traffic applications, add a compound index on:
 *   { senderId: 1, receiverId: 1, createdAt: -1 }
 * to accelerate retrieval of the latest messages in a conversation.
 */

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    /** Originator of the message (foreign key → User) */
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      required: true,
    },

    /** Recipient of the message (foreign key → User) */
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      required: true,
    },

    /** UTF‑8 text payload. Optional when an image is supplied. */
    text: {
      type: String,
      trim: true,
    },

    /** Publicly accessible URL of the image associated with the message. */
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
