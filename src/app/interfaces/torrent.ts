export interface Size {
    value: number;
    unit: string;
  }
  
  export interface UploadDate {
    day: number;
    month: number;
    year: number;
  }
  
  export interface Category {
    name: string;
    icon: string;
  }
  
  export interface Torrent {
    id: number;
    category: Category;
    name: string;
    size: Size;
    seeders: number;
    leechers: number;
    downloaders: number;
    upload_date: UploadDate;
    uploader: string;
    description: string;
  }