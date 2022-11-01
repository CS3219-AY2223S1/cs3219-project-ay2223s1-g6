const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000';
const PREFIX_USER_SVC = '/api/user';
export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;

const URI_MATCH_SVC = process.env.URI_MATCH_SVC || 'http://localhost:8001';
const MATCH_SVC_MATCH_NAMESPACE = '/api/match';
const MATCH_SVC_ROOM_NAMESPACE = '/api/room';
export const URL_MATCH_SVC_MATCH_NAMESPACE = URI_MATCH_SVC + MATCH_SVC_MATCH_NAMESPACE;
export const URL_MATCH_SVC_ROOM_NAMESPACE = URI_MATCH_SVC + MATCH_SVC_ROOM_NAMESPACE;

const URI_QUESTION_SVC = process.env.URI_QUESTION_SVC || 'http://localhost:8002';
const PREFIX_QUESTION_SVC = '/api/questions';
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;

const URI_EDITOR_SVC = process.env.URI_EDITOR_SVC || 'http://localhost:8003';
const EDITOR_SVC_DEFAULT_NAMESPACE = '/api/editor';
export const URL_EDITOR_SVC_DEFAULT_NAMESPACE = URI_EDITOR_SVC + EDITOR_SVC_DEFAULT_NAMESPACE;

const URI_CHAT_SVC = process.env.URI_CHAT_SVC || 'http://localhost:8004';
const CHAT_SVC_DEFAULT_NAMESPACE = '/api/chat';
export const URL_CHAT_SVC_DEFAULT_NAMESPACE = URI_CHAT_SVC + CHAT_SVC_DEFAULT_NAMESPACE;
