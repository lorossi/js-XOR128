import { XOR128 } from "../xor128.js";
import * as chai from "chai";

const CHI_SAMPLE_SIZE = 100000;
const KS_SAMPLE_SIZE = 10000;
const BINOMIAL_SAMPLE_SIZE = 100; // update value for critical value if changed
const SEEDS = [
  140690385442, 932417215139, 175372117770, 182118658154, 761205298214,
  631710856717, 938806554993, 358973410676, 497045664158, 823262369844,
  563544973101, 630462541086, 753788700227, 362086758616, 121596585086,
  752490722158, 586152887959, 154944842206, 419068884415, 524888625967,
  741085659169, 457901013184, 631871133354, 193510025517, 763202312257,
  224298653953, 72574202877, 670915071126, 396190923590, 316130513397,
  632336883548, 300873222125, 30715594457, 339383527626, 716949923103,
  962214229000, 993266522306, 179153002192, 494786468645, 768436314259,
  116197080852, 85517547729, 67684089184, 711587728016, 704149422465,
  809270690621, 703769822062, 32993062215, 420385970018, 389199561140,
];

describe("randomness test", () => {
  it("chi square test", () => {
    SEEDS.forEach((seed) => {
      const BINS_NUM = 10;

      const random = new XOR128(seed);
      const bins = new Array(BINS_NUM).fill(0);

      for (let i = 0; i < CHI_SAMPLE_SIZE; i++)
        bins[Math.floor(random.random_int(BINS_NUM))]++;

      const expected = CHI_SAMPLE_SIZE / BINS_NUM;
      const chi_sq = bins.reduce(
        (acc, cur) => acc + (cur - expected) ** 2 / expected,
        0
      );

      // critical value for 9 degrees of freedom and 0.05 significance level
      const critical = 16.919;

      chai.expect(chi_sq).to.be.below(critical);
    });
  });

  it("Kolmogorov-Smirnov test", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);
      const values = new Array(KS_SAMPLE_SIZE)
        .fill(0)
        .map(() => random.random());

      values.sort((a, b) => a - b);

      const k_plus = values.reduce(
        (acc, cur, i) => Math.max(acc, (i + 1) / KS_SAMPLE_SIZE - cur),
        0
      );

      const k_minus = values.reduce(
        (acc, cur, i) => Math.max(acc, cur - i / KS_SAMPLE_SIZE),
        0
      );

      const k = Math.sqrt(KS_SAMPLE_SIZE) * Math.max(k_plus, k_minus);

      // critical value for n=50, 0.05 significance level
      const critical = 1.358 * Math.sqrt(KS_SAMPLE_SIZE);

      chai.expect(k).to.be.below(critical);
    });
  });

  it("check random_bool distribution", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);
      let true_count = 0;

      for (let i = 0; i < CHI_SAMPLE_SIZE; i++)
        if (random.random_bool()) true_count++;

      const expected = CHI_SAMPLE_SIZE / 2;
      const chi_sq = (true_count - expected) ** 2 / expected;

      // critical value for 1 degree of freedom and 0.05 significance level
      const critical = 3.841;

      chai.expect(chi_sq).to.be.below(critical);
    });
  });

  it("binomial test", () => {
    const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
    const binomial = (n, k) => fact(n) / (fact(k) * fact(n - k));

    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);
      let true_count = 0;

      for (let i = 0; i < BINOMIAL_SAMPLE_SIZE; i++)
        if (random.random_bool()) true_count++;

      const result =
        binomial(BINOMIAL_SAMPLE_SIZE, true_count) *
        0.5 ** BINOMIAL_SAMPLE_SIZE *
        0.5 *
        (BINOMIAL_SAMPLE_SIZE - true_count);

      const zeta_alpha = 1.96;

      const lower_bound = 0.5 - zeta_alpha * Math.sqrt(result / 2);
      const upper_bound = 0.5 + zeta_alpha * Math.sqrt(result / 2);

      chai.expect(0.5).to.be.within(lower_bound, upper_bound);
    });
  });
});
