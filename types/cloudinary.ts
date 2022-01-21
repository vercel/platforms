declare global {
  var cloudinary: {
    applyUploadWidget: (
      element: unknown,
      options: CloudinaryWidgetOptions,
      widgetCallback?: Function
    ) => void;
    createUploadWidget: (
      options: CloudinaryWidgetOptions,
      widgetCallback?: Function
    ) => CloudinaryWidget;
    openUploadWidget: (
      options: CloudinaryWidgetOptions,
      widgetCallback?: Function
    ) => void;
    setAPIKey: (key: string) => void;
    setCloudName: (name: string) => void;
    WIDGET_SOURCES: CloudinaryWidgetSource;
    WIDGET_VERSION: string;
  };
}

enum CloudinaryWidgetSource {
  CAMERA = "camera",
  DROPBOX = "dropbox",
  FACEBOOK = "facebook",
  GETTY = "getty",
  GOOGLE_DRIVE = "google_drive",
  IMAGE_SEARCH = "image_search",
  INSTAGRAM = "instagram",
  ISTOCK = "istock",
  LOCAL = "local",
  SHUTTERSTOCK = "shutterstock",
  UNSPLASH = "unsplash",
  URL = "url",
}

export interface CloudinaryWidget {
  close: (t?: unknown) => void;
  destroy: (t?: unknown) => void;
  hide: () => void;
  isDestroyed: () => void;
  isMinimized: () => void;
  isShowing: () => void;
  minimize: () => void;
  open: (t?: unknown, e?: unknown) => void;
  show: () => void;
  update: (t?: unknown) => void;
}

interface CloudinaryWidgetOptions {
  cloudName: string;
  cropping: boolean;
  uploadPreset: string;
}

export interface CloudinaryWidgetResult {
  data: {
    event: string;
    info: string;
  };
  event: string;
  info: string;
  uw_event: boolean;
}
