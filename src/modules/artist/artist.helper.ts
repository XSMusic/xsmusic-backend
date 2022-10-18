import axios from "axios";
import { load } from "cheerio";
import xpath from "xpath";

export class ArtistHelper {
  async scrapingArtists() {
    const args = process.argv.slice(2);
    const postCode = args[0] || 2000;
    const url = `https://djrankings.org/`;
    try {
      const response = await axios.get(url);
        const $ = load(response.data);
        const noOfProperties = $("table>tr>.first")
        console.log(
            `${noOfProperties}`
            );
    } catch (e) {
      console.error(
        `Error while fetching rental properties for ${postCode} - ${e.message}`
      );
    }
  }
}
