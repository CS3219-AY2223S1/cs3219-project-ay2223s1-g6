const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:9000';
const PREFIX_USER_SVC = '/api/user';
export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;

const URI_MATCHING_SVC = process.env.URI_MATCHING_SVC || 'http://localhost:8001';
export const MATCHING_SVC_SOCKETIO_PATH = '/api/match/socket.io/';
export const URL_MATCHING_SVC_MATCH_NAMESPACE = URI_MATCHING_SVC + '/match';
export const URL_MATCHING_SVC_ROOM_NAMESPACE = URI_MATCHING_SVC + '/room';

const URI_QUESTION_SVC = process.env.URI_QUESTION_SVC || 'http://localhost:9000';
const PREFIX_QUESTION_SVC = '/api/questions';
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;

export const URL_EDITOR_SVC = process.env.URI_EDITOR_SVC || 'http://localhost:8003';
export const EDITOR_SVC_SOCKETIO_PATH = '/api/editor/socket.io/';

export const URL_CHAT_SVC = process.env.URI_CHAT_SVC || 'http://localhost:8004';
export const CHAT_SVC_SOCKETIO_PATH = '/api/chat/socket.io/';

