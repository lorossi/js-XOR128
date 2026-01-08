import { XOR128State } from "../js/xor128-state.js";
import * as chai from "chai";

describe("XOR128State", () => {
  it("Should initialize correctly", () => {
    const state = new XOR128State(1, 2, 3, 4);
    chai.expect(state.state).to.deep.equal([1, 2, 3, 4]);
  });

  it("Should throw error on invalid initialization", () => {
    chai.expect(() => new XOR128State(1, 2, 3, "4")).to.throw();
    chai.expect(() => new XOR128State(1, 2, null, 4)).to.throw();
  });

  it("Should detect all zero state", () => {
    const state = new XOR128State(0, 0, 0, 0);
    chai.expect(state.isAllZero()).to.equal(true);

    const state2 = new XOR128State(1, 0, 0, 0);
    chai.expect(state2.isAllZero()).to.equal(false);
  });

  it("Should rotate state correctly", () => {
    const state = new XOR128State(1, 2, 3, 4);

    chai.expect(state.state).to.deep.equal([1, 2, 3, 4]);
    state.rotateState();
    chai.expect(state.state).to.deep.equal([2, 3, 4, 1]);
  });

  it("Should set first word correctly", () => {
    const state = new XOR128State(1, 2, 3, 4);
    state.setFirstWord(10);
    chai.expect(state.state).to.deep.equal([10, 2, 3, 4]);
  });

  it("Should throw error on invalid first word", () => {
    const state = new XOR128State(1, 2, 3, 4);
    chai.expect(() => state.setFirstWord("10")).to.throw();
  });
});
