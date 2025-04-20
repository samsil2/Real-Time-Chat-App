
import User from "../models/user.model.js";
import Message from "../models/message.model.js";


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


export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
