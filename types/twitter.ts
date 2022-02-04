export interface TweetData {
  attachments?: { media_keys: Array<string> };
  author_id: string;
  created_at: Date;
  author: TwitterUser;
  media: Array<{
    type: string;
    media_key: string;
    height: number;
    width: number;
    preview_image_url: string;
    url: string;
  }>;
  video: {
    url: string;
  };
  polls: Array<{
    total_votes: number;
    options: Array<{
      votes: number;
      label: string;
      position: number;
    }>;
    voting_status: string;
    end_datetime: string;
  }>;
  url_meta: {
    title: string;
    description: string;
    unwound_url: string;
    images: Array<{
      url: string;
    }>;
  };
  entities?: {
    urls?: Array<{
      display_url: string;
      end: number;
      expanded_url: string;
      start: number;
      url: string;
    }>;
  };
  id: string;
  public_metrics: {
    like_count: number;
    quote_count: number;
    reply_count: number;
    retweet_count: number;
  };
  referenced_tweets?: Array<{
    id: string;
    type: string;
    username: string;
    author: TwitterUser;
  }>;
  text: string;
}

export interface Tweet {
  data: TweetData;
  includes: {
    media?: Array<{
      height: number;
      media_key: string;
      type: string;
      url: string;
      width: number;
    }>;
    polls?: Array<unknown>;
    tweets?: Array<Tweet["data"]>;
    users: Array<TwitterUser>;
  };
}

export interface MediaTweet {
  created_at: Date;
  id: number;
  id_str: string;
  full_text: string;
  truncated: boolean;
  display_text_range: Array<number>;
  entities: {
    hashtags: Array<unknown>;
    symbols: Array<unknown>;
    user_mentions: Array<unknown>;
    urls: Array<unknown>;
    media: Array<unknown>;
  };
  extended_entities: {
    media: Array<TwitterExtendedEntitiesMedia>;
  };
  source: string;
  in_reply_to_status_id: null;
  in_reply_to_status_id_str: null;
  in_reply_to_user_id: null;
  in_reply_to_user_id_str: null;
  in_reply_to_screen_name: null;
  user: {
    contributors_enabled: boolean;
    created_at: Date;
    default_profile_image: boolean;
    default_profile: boolean;
    description: string;
    entities: Array<object>;
    favourites_count: number;
    follow_request_sent: null;
    followers_count: number;
    following: null;
    friends_count: number;
    geo_enabled: boolean;
    has_extended_profile: boolean;
    id_str: string;
    id: number;
    is_translation_enabled: boolean;
    is_translator: boolean;
    lang: null;
    listed_count: number;
    location: string;
    name: string;
    notifications: null;
    profile_background_color: string;
    profile_background_image_url_https: string;
    profile_background_image_url: string;
    profile_background_tile: boolean;
    profile_banner_url: string;
    profile_image_url_https: string;
    profile_image_url: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    protected: boolean;
    screen_name: string;
    statuses_count: number;
    time_zone: null;
    translator_type: string;
    url: string;
    utc_offset: null;
    verified: boolean;
    withheld_in_countries: Array<unknown>;
  };
  geo: null;
  coordinates: null;
  place: null;
  contributors: null;
  is_quote_status: boolean;
  retweet_count: number;
  favorite_count: number;
  favorited: boolean;
  retweeted: boolean;
  possibly_sensitive: boolean;
  possibly_sensitive_appealable: boolean;
  lang: string;
}

interface TwitterExtendedEntitiesMedia {
  additional_media_info: {
    monetizable: boolean;
  };
  display_url: string;
  expanded_url: string;
  id_str: string;
  id: number;
  indices: Array<number>;
  media_url_https: string;
  media_url: string;
  sizes: Record<
    string,
    {
      w: number;
      h: number;
      resize: string;
    }
  >;
  type: string;
  url: string;
  video_info: {
    aspect_ratio: Array<number>;
    duration_millis: number;
    variants: Array<{
      bitrate: number;
      content_type: string;
      url: string;
    }>;
  };
}

export interface TwitterUser {
  id: string;
  name: string;
  profile_image_url: string;
  protected: boolean;
  url: string;
  username: string;
  verified: boolean;
}
