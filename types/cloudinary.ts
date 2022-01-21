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
    ) => void;
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

interface CloudinaryWidgetOptions {
  cloudName: string;
  cropping: boolean;
  uploadPreset: string;
}

export interface CloudinaryWidget {
  data: {
    event: string;
    info: string;
  };
  event: string;
  info: string;
  uw_event: boolean;
}
