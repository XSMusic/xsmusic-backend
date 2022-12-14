import { config } from '@config';
import { IgApiClient } from 'instagram-private-api';

export class ScrapingInstagramService {
  ig = new IgApiClient();

  async searchName(name: string) {
    this.ig.state.generateDevice(config.tokens.instagram.user);
    try {
      await this.ig.simulate.preLoginFlow();
      await this.ig.account.login(
        config.tokens.instagram.user,
        config.tokens.instagram.password
      );
      const users = await this.ig.search.users(name);
      const items = [];
      for (const user of users) {
        console.log(user);
        const data = {
          name: user.username,
          image: user.profile_pic_url,
          fullName: user.full_name,
        };
        items.push(data);
      }
      //   console.log({ loggedInUser });
      //   // The same as preLoginFlow()
      //   // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
      //   process.nextTick(async () => await this.ig.simulate.postLoginFlow());
      //   // Create UserFeed instance to get loggedInUser's posts
      //   const userFeed = this.ig.feed.user(loggedInUser.pk);
      //   const myPostsFirstPage = await userFeed.items();
      //   // All the feeds are auto-paginated, so you just need to call .items() sequentially to get next page
      //   const myPostsSecondPage = await userFeed.items();
      //   //   await ig.media.like({
      //   //     // Like our first post from first page or first post from second page randomly
      //   //     mediaId: sample([myPostsFirstPage[0].id, myPostsSecondPage[0].id]),
      //   //     moduleInfo: {
      //   //       module_name: 'profile',
      //   //       user_id: loggedInUser.pk,
      //   //       username: loggedInUser.username,
      //   //     },
      //   //     d: sample([0, 1]),
      //   });
      return items;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
