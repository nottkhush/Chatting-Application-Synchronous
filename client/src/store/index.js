import { createAuthSlice } from "./slices/auth-slice";
import { create } from "zustand";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create()((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
}));
