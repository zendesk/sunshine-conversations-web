export class Smooch {
    init(props) {
      return Promise.resolve();
    }

    login(userId, jwt) {
      return Promise.resolve();
    }

    logout() {
      return this.login();
    }

    track() {
      return Promise.resolve()
    }

    sendMessage(text) {
      return Promise.resolve()
    }

    updateUser(props) {
      return Promise.resolve()
    }

    destroy() {}
}
