class Result {
    constructor(status, message) {
        this.status = status
        this.message = message
    }

    log() {
        console.log(message)
    }
}


class TokenResult extends Result {
    constructor(status, token, message) {
        super(status, message)
        this.token = token
    }
}