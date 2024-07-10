import type { Business } from "../include/data.js";

export class FluentBusinesses {
  private data: Business[];

  constructor(data: Business[]) {
    this.data = data;
  }

  getData(): Business[] {
    return this.data;
  }

  private hasProperty(business: Business, key: keyof Business) {
    return business[key] !== undefined;
  }

  private newFilteredFluentBusiness(cond: (b: Business) => boolean) {
    const filtered = this.data.filter(cond);
    return new FluentBusinesses(filtered);
  }

  fromCityInState(city: string, state: string): FluentBusinesses {
    const cond = (b: Business) =>
      this.hasProperty(b, "city") &&
      this.hasProperty(b, "state") &&
      b.city !== undefined &&
      b.state !== undefined &&
      b.city === city &&
      b.state === state;
    return this.newFilteredFluentBusiness(cond);
  }

  hasStarsGeq(stars: number): FluentBusinesses {
    // TODO
    const cond = (b: Business) => this.hasProperty(b, "stars") && b.stars !== undefined && b.stars >= stars;
    return this.newFilteredFluentBusiness(cond);
  }

  inCategory(category: string): FluentBusinesses {
    // TODO
    const cond = (b: Business) =>
      this.hasProperty(b, "categories") && b.categories !== undefined && b.categories.includes(category);
    return this.newFilteredFluentBusiness(cond);
  }

  hasHoursOnDays(days: string[]): FluentBusinesses {
    // TODO
    const cond = (b: Business) =>
      this.hasProperty(b, "hours") && days.length > 0 && days.every(day => b.hours !== undefined && day in b.hours);
    return this.newFilteredFluentBusiness(cond);
  }

  hasAmbience(ambience: string): FluentBusinesses {
    // TODO
    const cond = (b: Business) =>
      this.hasProperty(b, "attributes") &&
      b.attributes !== undefined &&
      b.attributes[ambience] !== undefined &&
      b.attributes[ambience] === true;
    return this.newFilteredFluentBusiness(cond);
  }

  private bestPlaceAndmostReviewsHelper(str: string): Business | undefined {
    const property = str === "s" ? "stars" : "review_count";
    const filtered = this.data.filter(b => this.hasProperty(b, property));
    if (filtered.length === 0) {
      return undefined;
    }
    return filtered.reduce((acc, e) => {
      const currStars = acc.stars ?? 0;
      const currRevCnt = acc.review_count ?? 0;
      const newStars = e.stars ?? 0;
      const newRevCnt = e.review_count ?? 0;

      if (str === "s") {
        return newStars > currStars || (newStars === currStars && newRevCnt > currRevCnt) ? e : acc;
      } else {
        return newRevCnt > currRevCnt || (newRevCnt === currRevCnt && newStars > currStars) ? e : acc;
      }
    });
  }

  bestPlace(): Business | undefined {
    // TODO
    return this.bestPlaceAndmostReviewsHelper("s");
  }

  mostReviews(): Business | undefined {
    // TODO
    return this.bestPlaceAndmostReviewsHelper("r");
  }
}
