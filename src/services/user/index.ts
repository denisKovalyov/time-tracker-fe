import api from '../api';

export type UserData = {
  id: string;
  login: string;
}

class UserService {
  private data: UserData = {} as UserData;
  private loading = false;
  private subscriptions: Function[] = [];

  private setUser(data: UserData) {
    this.data = { ...data }
  };

  private async fetchUser() {
    this.loading = true;
    const userData = await api({ url: '/user/read'});
    this.loading = false;
    this.setUser(userData[0]);
    this.subscriptions.forEach((fn) => fn(userData[0]));
    this.subscriptions = [];
    return userData[0];
  }

  getUser(): Promise<UserData> {
    if (Object.keys(this.data).length) return Promise.resolve(this.data);
    if (this.loading) {
      return new Promise((resolve) => {
        this.subscriptions.push(resolve);
      });
    }

    return this.fetchUser();
  };
}

export default new UserService();
