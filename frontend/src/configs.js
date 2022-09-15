const URI_USER_SVC = process.env.URI_USER_SVC || 'http://localhost:8000'
const PREFIX_USER_SVC = '/api/user'
export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC

const URI_MATCH_SVC = process.env.URI_USER_SVC || 'http://localhost:8001'
const PREFIX_MATCH_SVC = '/api/match'
export const URL_MATCH_SVC = URI_MATCH_SVC + PREFIX_MATCH_SVC
