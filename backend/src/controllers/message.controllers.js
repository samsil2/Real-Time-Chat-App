
import User from "../models/user.models.js";
import Message from "../models/message.models.js";


/**
 * GET /api/users/sidebar
 * -----------------------------------------------------------------------------
 * Returns a list of users suitable for rendering in the chat sidebar.
 *
 * Business rules
 * --------------
 * • The authenticated user (req.user) must be excluded from the result set.
 * • Password hashes and other sensitive fields are never exposed to clients.
 *
 * Response contract
 * -----------------
 * • 200 OK      – Array<User>   (password omitted, other public fields intact)
 * • 500 INTERNAL – Generic error message; stack trace is logged server‑side.
 *
 * @param {import('express').Request}  req – Expects `req.user` populated by
 *                                           auth middleware.
 * @param {import('express').Response} res – Sends JSON payload.
 */
export const getUsersForSidebar = async (req, res) => {
  try {
    /* ---------------------------------------------------------------
     * 1. Determine the ID of the currently authenticated user.
     * ------------------------------------------------------------- */
    const loggedInUserId = req.user._id;

    /* ---------------------------------------------------------------
     * 2. Query for every user except the caller and remove sensitive
     *    fields (`-password` ensures hashes never leave the server).
     * ------------------------------------------------------------- */
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }, // $ne === "not equal"
    }).select("-password");         // exclude password field

    /* ---------------------------------------------------------------
     * 3. Send the sanitized list to the client.
     * ------------------------------------------------------------- */
    return res.status(200).json(filteredUsers);
  } catch (error) {
    /* ---------------------------------------------------------------
     * 4. Log the full error for observability and return a generic
     *    message to avoid leaking stack traces to the client.
     * ------------------------------------------------------------- */
    console.error("Error in getUsersForSidebar:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


/**
 * GET /api/messages/:id
 * -----------------------------------------------------------------------------
 * Fetches the full message history between the authenticated user (`req.user`)
 * and the user specified by route param `:id`.
 *
 * Business rules
 * --------------
 * • Both inbound and outbound messages are returned, ordered by default index.
 * • No pagination is applied; callers should layer their own limits if needed.
 *
 * Response contract
 * -----------------
 * • 200 OK      – Array<Message>
 * • 500 INTERNAL – Generic error message; details are logged server‑side.
 *
 * Security
 * --------
 * • Endpoint must be protected by authentication middleware that populates
 *   `req.user`; otherwise, access is denied at an earlier layer.
 */
export const getMessages = async (req, res) => {
  try {
    /* ---------------------------------------------------------------
     * 1. Determine conversation participants
     * ------------------------------------------------------------- */
    const { id: userToChatId } = req.params; // User we’re chatting with
    const myId = req.user._id;               // Authenticated caller

    /* ---------------------------------------------------------------
     * 2. Query for all messages where (me → them) OR (them → me)
     * ------------------------------------------------------------- */
    const messages = await Message.find({
      $or: [
        { senderId: myId,        receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId       },
      ],
    });

    /* ---------------------------------------------------------------
     * 3. Return the conversation to the client
     * ------------------------------------------------------------- */
    return res.status(200).json(messages);
  } catch (error) {
    /* ---------------------------------------------------------------
     * 4. Log internal error and send generic failure response
     * ------------------------------------------------------------- */
    console.error("Error in getMessages controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    //later socket.io(real-time functionality) will be added

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
