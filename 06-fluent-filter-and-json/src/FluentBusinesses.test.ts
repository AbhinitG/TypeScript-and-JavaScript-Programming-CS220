import assert from "assert";
import { Business } from "../include/data.js";
import { FluentBusinesses } from "./FluentBusinesses";

const testData: Business[] = [
  {
    business_id: "abcd",
    name: "Applebee's",
    city: "Charlotte",
    state: "NC",
    stars: 4,
    review_count: 6,
  },
  {
    business_id: "abcd",
    name: "China Garden",
    state: "NC",
    city: "Charlotte",
    stars: 4,
    review_count: 10,
  },
  {
    business_id: "abcd",
    name: "Beach Ventures Roofing",
    state: "AZ",
    city: "Phoenix",
    stars: 3,
    review_count: 30,
  },
  {
    business_id: "abcd",
    name: "Alpaul Automobile Wash",
    city: "Charlotte",
    state: "NC",
    stars: 3,
    review_count: 30,
  },
  {
    business_id: "Pns2l4eNsfO8kk83dixA6A",
    name: "Abby Rappoport, LAC, CMQ",
    city: "Santa Barbara",
    state: "CA",
    postal_code: "93101",
    latitude: 34.4266787,
    longitude: -119.7111968,
    stars: 5,
    review_count: 7,
    attributes: {
      ByAppointmentOnly: true,
    },
    categories: [
      "Doctors",
      "Traditional Chinese Medicine",
      "Naturopathic/Holistic",
      "Acupuncture",
      "Health & Medical",
      "Nutritionists",
    ],
  },
  {
    business_id: "mpf3x-BjTdTEA3yCZrAYPw",
    name: "The UPS Store",
    city: "Affton",
    state: "MO",
    postal_code: "63123",
    latitude: 38.551126,
    longitude: -90.335695,
    stars: 3,
    review_count: 15,
    attributes: {
      BusinessAcceptsCreditCards: true,
      BusinessAcceptsApplePay: true,
    },
    categories: ["Shipping Centers", "Local Services", "Notaries", "Mailbox Centers", "Printing Services"],
    hours: {
      Monday: "0:0-0:0",
      Tuesday: "8:0-18:30",
      Wednesday: "8:0-18:30",
      Thursday: "8:0-18:30",
      Friday: "8:0-18:30",
      Saturday: "8:0-14:0",
    },
  },
];

describe("fromCityInState", () => {
  it("is correct for empty data list", () => {
    const list = new FluentBusinesses([]).fromCityInState("Charlotte", "NC").getData();

    assert(list.length === 0);
  });

  it("is correct for no matches", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Boston", "MA").getData();

    assert(list.length === 0);
  });

  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Alpaul Automobile Wash");
  });
});

describe("hasStarsGeq", () => {
  it("is correct for empty data list", () => {
    const list = new FluentBusinesses([]).hasStarsGeq(69).getData();

    assert(list.length === 0);
  });

  it("is correct for no matches", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(69).getData();

    assert(list.length === 0);
  });

  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(4).getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });

  it("filters correctly on repeated calls", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(0).hasStarsGeq(4).getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });
});

describe("inCategory", () => {
  it("is correct for empty data list", () => {
    const list = new FluentBusinesses([]).inCategory("Racing").getData();

    assert(list.length === 0);
  });

  it("is correct for no matches", () => {
    const list = new FluentBusinesses(testData).inCategory("Racing").getData();

    assert(list.length === 0);
  });

  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).inCategory("Shipping Centers").getData();

    assert(list.length === 1);
    assert(list[0].name === "The UPS Store");
  });

  it("filters correctly on repeated calls", () => {
    const list = new FluentBusinesses(testData).inCategory("Local Services").inCategory("Shipping Centers").getData();

    assert(list.length === 1);
    assert(list[0].name === "The UPS Store");
  });
});

describe("hasHoursOnDays", () => {
  it("is correct for empty data list", () => {
    const list = new FluentBusinesses([]).hasHoursOnDays([]).getData();

    assert(list.length === 0);
  });

  it("is correct for no matches", () => {
    const list = new FluentBusinesses(testData).hasHoursOnDays([]).getData();

    assert(list.length === 0);
  });

  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).hasHoursOnDays(["Monday"]).getData();

    assert(list.length === 1);
    assert(list[0].name === "The UPS Store");
  });

  it("filters correctly on repeated calls", () => {
    const list = new FluentBusinesses(testData)
      .hasHoursOnDays(["Wednesday", "Thursday", "Friday"])
      .hasHoursOnDays(["Monday"])
      .getData();

    assert(list.length === 1);
    assert(list[0].name === "The UPS Store");
  });
});

describe("hasAmbience", () => {
  it("is correct for empty data list", () => {
    const list = new FluentBusinesses([]).hasAmbience("BusinessAcceptsCreditCards").getData();

    assert(list.length === 0);
  });

  it("is correct for no matches", () => {
    const list = new FluentBusinesses(testData).hasAmbience("").getData();

    assert(list.length === 0);
  });

  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).hasAmbience("BusinessAcceptsCreditCards").getData();

    assert(list.length === 1);
    assert(list[0].name === "The UPS Store");
  });

  it("filters correctly on repeated calls", () => {
    const list = new FluentBusinesses(testData)
      .hasAmbience("BusinessAcceptsCreditCards")
      .hasAmbience("BusinessAcceptsApplePay")
      .getData();

    assert(list.length === 1);
    assert(list[0].name === "The UPS Store");
  });
});

describe("bestPlace", () => {
  it("is correct for empty data list", () => {
    const best = new FluentBusinesses([]).bestPlace();

    assert(!best);
  });

  it("finds the place with the most stars", () => {
    const best = new FluentBusinesses(testData).bestPlace();

    assert(best);
    assert(best.name === "Abby Rappoport, LAC, CMQ");
  });

  it("break tie with review count", () => {
    const best = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").bestPlace();

    assert(best);
    assert(best.name === "China Garden");
  });
});

describe("mostReviews", () => {
  it("is correct for empty data list", () => {
    const best = new FluentBusinesses([]).mostReviews();

    assert(!best);
  });

  it("finds the place with the most reviews and breaks tie based on whoever was first", () => {
    const best = new FluentBusinesses(testData).mostReviews();

    assert(best);
    assert(best.name === "Beach Ventures Roofing");
  });
});
