export default class ResponseSender<T> {

    public status: number;
    public data: T;
    public message: string

    constructor(status: number, data: T, message?: string) {
        this.status = status
        this.data = data
        this.message = message ?? "Đã gửi yêu cầu đến máy chủ"
    }

    json() {
        return JSON.stringify({ status: this.status, data: this.data, message: this.message })
    }
}