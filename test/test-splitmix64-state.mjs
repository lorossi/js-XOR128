import { SplitMix64State } from "../js/splitmix64-state.js";
import * as chai from "chai";

describe("SplitMix64State", () => {
  it("Should initialize correctly", () => {
    const state = new SplitMix64State(12345);
    chai.expect(state._seed).to.equal(12345);
  });

  it("Should throw error on invalid initialization", () => {
    chai.expect(() => new SplitMix64State("12345")).to.throw();
    chai.expect(() => new SplitMix64State(null)).to.throw();
  });

  it("Should mix state correctly", () => {
    const state = new SplitMix64State(0);
    const mixed = state.mix();

    chai.expect(mixed).to.be.an("array").that.has.lengthOf(2);
    chai.expect(mixed[0]).to.be.a("number");
    chai.expect(mixed[1]).to.be.a("number");
  });
});
