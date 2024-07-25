import type {
  ExcalidrawElement,
  FileId,
} from "../../packages/excalidraw/element/types";
import type Portal from "../collab/Portal";
import type { AppState } from "../../packages/excalidraw/types";
import type { SyncableExcalidrawElement } from ".";
import type { Socket } from "socket.io-client";

import {
  loadFilesFromFirebase,
  loadFromFirebase,
  saveFilesToFirebase,
  saveToFirebase,
  isSavedToFirebase,
  loadFirebaseStorage,
} from "./storage-provider/firebase";

const ErrorNoStorageProvider = Error(
  "No StorageProvider defined, set VITE_APP_STORAGE_PROVIDER",
);

const storageProvider = import.meta.env.VITE_APP_STORAGE_PROVIDER ?? "firebase";

export const isSavedToStorage = (
  portal: Portal,
  elements: readonly ExcalidrawElement[],
): boolean => {
  switch (storageProvider) {
    case "firebase":
      return isSavedToFirebase(portal, elements);
    default:
      throw ErrorNoStorageProvider;
  }
};

export const loadFilesFromStorage = async (
  prefix: string,
  decryptionKey: string,
  filesIds: readonly FileId[],
) => {
  switch (storageProvider) {
    case "firebase":
      return loadFilesFromFirebase(prefix, decryptionKey, filesIds);
    default:
      throw ErrorNoStorageProvider;
  }
};

export const loadFromStorage = async (
  roomId: string,
  roomKey: string,
  socket: Socket | null,
): Promise<readonly SyncableExcalidrawElement[] | null> => {
  switch (storageProvider) {
    case "firebase":
      return loadFromFirebase(roomId, roomKey, socket);
    default:
      throw ErrorNoStorageProvider;
  }
};

export const saveFilesToStorage = async ({
  prefix,
  files,
}: {
  prefix: string;
  files: { id: FileId; buffer: Uint8Array }[];
}) => {
  switch (storageProvider) {
    case "firebase":
      return saveFilesToFirebase({ prefix, files });
    default:
      throw ErrorNoStorageProvider;
  }
};

export const saveToStorage = async (
  portal: Portal,
  elements: readonly SyncableExcalidrawElement[],
  appState: AppState,
) => {
  switch (storageProvider) {
    case "firebase":
      return saveToFirebase(portal, elements, appState);
    default:
      throw ErrorNoStorageProvider;
  }
};

export const loadStorage = async () => {
  switch (storageProvider) {
    case "firebase":
      return loadFirebaseStorage();
    default:
      throw ErrorNoStorageProvider;
  }
};
