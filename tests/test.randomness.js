import { XOR128 } from "../xor128.js";

mocha.setup("bdd");

const SAMPLE_SIZE = 100000;
const TESTS_NUM = 10;

describe("test", () => {
  it("chi square test", () => {
    for (let t = 0; t < TESTS_NUM; t++) {
      const BINS_NUM = 10;

      const random = new XOR128();
      const bins = new Array(BINS_NUM).fill(0);

      for (let i = 0; i < SAMPLE_SIZE; i++)
        bins[Math.floor(random.random_int(BINS_NUM))]++;

      const expected = SAMPLE_SIZE / BINS_NUM;
      const chi_sq = bins.reduce(
        (acc, cur) => acc + (cur - expected) ** 2 / expected,
        0
      );

      // critical value for 9 degrees of freedom and 0.05 significance level
      const critical = 16.919;

      chai.expect(chi_sq).to.be.below(critical);
    }
  });

  it("Kolmogorov-Smirnov test", () => {
    for (let t = 0; t < TESTS_NUM; t++) {
      const BINS_NUM = 10;

      const random = new XOR128();
      const values = new Array(BINS_NUM).fill(0);
      for (let i = 0; i < SAMPLE_SIZE; i++) values[i] = random.random();

      values.sort();

      const k_plus =
        Math.sqrt(BINS_NUM) *
        Math.max(
          ...values.map((value, index) => (index + 1) / SAMPLE_SIZE - value)
        );

      const k_minus =
        Math.sqrt(BINS_NUM) *
        Math.max(...values.map((value, index) => value - index / SAMPLE_SIZE));

      // critical value for 0.05 significance level
      const critical = 1.36;

      chai.expect(k_plus).to.be.below(critical);
      chai.expect(k_minus).to.be.below(critical);
    }
  });

  it("check random_bool distribution", () => {
    for (let t = 0; t < TESTS_NUM; t++) {
      const random = new XOR128();
      let true_count = 0;

      for (let i = 0; i < SAMPLE_SIZE; i++)
        if (random.random_bool()) true_count++;

      const expected = SAMPLE_SIZE / 2;
      const chi_sq = (true_count - expected) ** 2 / expected;

      // critical value for 1 degree of freedom and 0.05 significance level
      const critical = 3.841;

      chai.expect(chi_sq).to.be.below(critical);
    }
  });
});
