export interface Message {
    id: number;
    created_at: string;
    user_id: number;
    username: string;
    text: string;
  }

export enum InputType {
    TEXT = 'text',
    IMAGE = 'image',
    FILE = 'file',
}

export enum InputText {
    MESSAGE = 'message',
    USERNAME = 'username',
    PASSWORD = 'password',
}

export enum InputInfo {
    SEND = 'Send',
    CANCEL = 'Cancel',
    SUBMIT = 'Submit',
}

