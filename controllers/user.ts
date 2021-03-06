import User from "../models/user";
import bcrypt from "bcrypt";
import * as token from "../helpers/token";

interface UserParams {
  username: string;
  password: string;
}

interface SusbscriptionParams {
  url: string;
  category?: string;
}

export const register = async (params: UserParams): Promise<any> => {
  const users = await User.find({ username: params.username });

  if (!users.length) {
    const newUser = new User({
      username: params.username,
      password: bcrypt.hashSync(params.password, 10),
    });

    return newUser.save().then((_user: any, err: any) => (err ? false : true));
  } else {
    return { error: "User already exists." };
  }
};

export const auth = async (params: UserParams): Promise<any> => {
  const user = await User.findOne({ username: params.username });

  switch (true) {
    case !user: {
      return false;
    }
    case user && !bcrypt.compareSync(params.password, user.password): {
      return false;
    }
    default: {
      return { accessToken: token.create(user) };
    }
  }
};

export const subscribe = async (
  username: string,
  subscription: SusbscriptionParams
): Promise<any> => {
  const user = await User.findOne({ username });
  const subscriptionUrls = user.subscriptions.map(
    (subscription: SusbscriptionParams) => subscription.url
  );

  if (!subscriptionUrls.includes(subscription.url)) {
    user.subscriptions.push(subscription);
    return user.save().then((_user: any, err: any) => (err ? false : true));
  } else {
    return { error: "Subscription already exists." };
  }
};
