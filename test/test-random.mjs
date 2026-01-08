import { XOR128 } from "../js/xor128.js";
import * as chai from "chai";

const NUM = 1000;
const MAX = 10;
const SEEDS = [
  893670696795, 493791200841, 978769234601, 289001128298, 239377148894,
  870529175047, 463594739943, 250307698143, 290283995731, 766975367336,
];

describe("instance test", function () {
  this.timeout(10000);

  it("Should instantiate without throwing", () => {
    chai.expect(() => new XOR128([1, 2, 3, 4])).to.not.throw();
    chai.expect(() => new XOR128()).to.not.throw();
    chai.expect(() => new XOR128(42)).to.not.throw();

    // test that all zeros will not throw an error but will show a warning
    chai.expect(() => new XOR128([0, 0, 0, 0])).to.not.throw();
  });

  it("Should throw on invalid seeds", () => {
    chai.expect(() => new XOR128(false)).to.throw();
    chai.expect(() => new XOR128("A")).to.throw();
    chai.expect(() => new XOR128(-1)).to.throw();
    chai.expect(() => new XOR128(0)).to.throw();
    chai.expect(() => new XOR128([1, 2, 3])).to.throw();
    chai.expect(() => new XOR128([1, 2, 3, 4, 5])).to.throw();
  });

  it("Should throw on invalid method arguments", () => {
    const random = new XOR128([1, 2, 3, 4]);

    chai.expect(() => random.random(2, 0)).to.throw();
    chai.expect(() => random.random("A", "B")).to.throw();
    chai.expect(() => random.random("A", 2)).to.throw();
    chai.expect(() => random.random(1, "A")).to.throw();

    chai.expect(() => random.random_int(2, 0)).to.throw();

    chai.expect(() => random.pick_from_array("A")).to.throw();
    chai.expect(() => random.pick_from_array(42)).to.throw();

    chai.expect(() => random.pick_from_string(42)).to.throw();
    chai.expect(() => random.pick_from_string({})).to.throw();

    chai.expect(() => random.pick(42)).to.throw();
    chai.expect(() => random.pick({})).to.throw();

    chai.expect(() => random.shuffle(1)).to.throw();
  });

  it("Should behave on edge cases", () => {
    const random = new XOR128([1, 2, 3, 4]);

    chai.expect(random.shuffle_array([])).to.equal(null);
    chai.expect(random.shuffle([])).to.equal(null);

    chai.expect(random.shuffle_string("")).to.equal("");
    chai.expect(random.shuffle("")).to.equal("");

    chai.expect(random.pick_from_array([])).to.equal(null);
    chai.expect(random.pick([])).to.equal(null);
    chai.expect(random.pick_from_string("")).to.equal(null);
    chai.expect(random.pick("")).to.equal(null);
  });

  it("Should return numbers for random ", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      for (let i = 0; i < NUM; i++) {
        const r = random.random();
        chai.expect(r).to.be.a("number");
        chai.expect(r).to.not.equal(NaN);
      }
    });
  });

  it("Should return integers for random_int ", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      for (let i = 0; i < NUM; i++) {
        const i = random.random_int();
        chai.expect(i).to.be.a("number");
        chai.expect(i).to.not.equal(NaN);
        chai.expect(i).to.equal(Math.floor(i));
      }
    });
  });

  it("Should return numbers within the correct range for random", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      for (let i = 0; i < NUM; i++) {
        chai.expect(random.random()).to.be.within(0, 1);
        chai.expect(random.random(10)).to.be.within(0, 10);
      }
    });
  });

  it("Should return numbers within the correct range for random_int", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      for (let i = 0; i < NUM; i++) {
        chai.expect(random.random_int()).to.be.within(0, 1);
        chai.expect(random.random_int(10)).to.be.within(0, 10);
      }
    });
  });

  it("Should return float values for random", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      const float_values = Array(MAX)
        .fill(0)
        .map((_, i) => i);
      for (let i = 0; i < NUM; i++) {
        const r = Math.floor(random.random(MAX));
        float_values[r]++;
      }
      const float_check = float_values.every((v) => v > 0);
      chai.expect(float_check).to.be.true;
      chai.expect(float_check).to.be.a("boolean");
    });
  });

  it("Should return integer values for random_int", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      const int_values = Array(MAX)
        .fill(0)
        .map((_, i) => i);
      for (let i = 0; i < NUM; i++) {
        const r = random.random_int(MAX);
        int_values[r]++;
      }
      const int_check = int_values.every((v) => v > 0);
      chai.expect(int_check).to.be.true;
    });
  });

  it("Should return numbers in the correct range for random_range", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      for (let i = 0; i < NUM; i++) {
        chai.expect(random.random_interval()).to.be.within(0, 1);
        chai.expect(random.random_interval(10, 10)).to.be.within(0, 20);
      }
    });
  });

  it("Should return true or false for random_boolean", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      for (let i = 0; i < NUM; i++) {
        chai.expect(random.random_bool()).to.be.oneOf([true, false]);
      }
    });
  });

  it("Should generate a valid random string for random_string", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);
      const length = 16;
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < NUM; i++) {
        const s = random.random_string(length, chars);
        chai.expect(s).to.be.a("string");
        chai.expect(s.length).to.equal(length);
        chai.expect(s).to.match(/^[a-zA-Z0-9]+$/);
      }
    });
  });

  it("Should return a random item from the array for random_from_array without modifying the array", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      for (let i = 0; i < NUM; i++) {
        chai.expect(arr).to.include(random.pick_from_array(arr));
        chai.expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      }
    });
  });

  it("Should return a random char from the string for random_from_string without modifying the string", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      const str = "1234567890";
      for (let i = 0; i < NUM; i++) {
        chai.expect(str).to.include(random.pick_from_string(str));
        chai.expect(str).to.equal("1234567890");
      }
    });
  });

  it("Should return a shuffled array for shuffle_array", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      for (let i = 0; i < NUM; i++) {
        const shuffled = random.shuffle_array(arr);
        chai.expect(shuffled).to.not.deep.equal(arr);
        chai.expect(shuffled).to.have.lengthOf(arr.length);

        for (let j = 0; j < arr.length; j++) {
          chai.expect(arr).to.include(shuffled[j]);
          chai.expect(shuffled).to.include(arr[j]);
        }
      }
    });
  });

  it("Should return a shuffled string for shuffle_string", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      const str = "1234567890";
      for (let i = 0; i < NUM; i++) {
        const shuffled = random.shuffle_string(str);
        chai.expect(str).to.be.equal("1234567890");
        chai.expect(shuffled).to.have.lengthOf(str.length);
        for (let j = 0; j < str.length; j++) {
          chai.expect(str).to.include(shuffled[j]);
        }
      }
    });
  });

  it("Should provide a valid distribution for pick", () => {
    SEEDS.forEach((seed) => {
      const random = new XOR128(seed);

      const str_values = Array(MAX)
        .fill(0)
        .map((_, i) => i);
      const str = [...Array(MAX).keys()].join("");
      for (let i = 0; i < NUM; i++) {
        const r = random.pick(str);
        const i = str.indexOf(r);
        str_values[i]++;
      }
      const str_check = str_values.every((v) => v > 0);
      chai.expect(str_check).to.be.true;
      chai.expect(str_check).to.be.a("boolean");

      const arr_values = Array(MAX)
        .fill(0)
        .map((_, i) => i);
      const arr = [...Array(MAX).keys()];
      for (let i = 0; i < NUM; i++) {
        const r = random.pick(arr);
        const i = arr.indexOf(r);
        arr_values[i]++;
      }
      const arr_check = arr_values.every((v) => v > 0);
      chai.expect(arr_check).to.be.true;
      chai.expect(arr_check).to.be.a("boolean");

      const arr_obj_values = Array(MAX)
        .fill(0)
        .map((_, i) => i);
      const arr_obj = Array(MAX)
        .fill(0)
        .map((_, i) => ({ id: i, value: i ^ 0xc0ffee }));

      for (let i = 0; i < NUM; i++) {
        const r = random.pick(arr_obj);
        const i = arr_obj.indexOf(r);
        arr_obj_values[i]++;
      }
      const arr_obj_check = arr_obj_values.every((v) => v > 0);
      chai.expect(arr_obj_check).to.be.true;
      chai.expect(arr_obj_check).to.be.a("boolean");
    });
  });

  it("Should provide repeatable random values for the same seed", () => {
    const seed = [1234, 5678, 9012, 3456];
    const x = new XOR128(...seed);
    const y = new XOR128(...seed);

    for (let i = 0; i < NUM; i++) {
      const r1 = x.random();
      const r2 = y.random();
      chai.expect(r1).to.equal(r2);
    }
  });

  it("Should provide repeatable shuffled arrays for the same seed", () => {
    const seed = [1234, 5678, 9012, 3456];
    const x = new XOR128(...seed);
    const y = new XOR128(...seed);
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (let i = 0; i < NUM; i++) {
      const r1 = x.shuffle(arr);
      const r2 = y.shuffle(arr);
      chai.expect(r1).to.deep.equal(r2);
    }
  });

  it("Should provide repeatable shuffled strings for the same seed", () => {
    const seed = [1234, 5678, 9012, 3456];
    const x = new XOR128(...seed);
    const y = new XOR128(...seed);

    for (let i = 0; i < NUM; i++) {
      const str = "1234567890";
      const r1 = x.shuffle(str);
      const r2 = y.shuffle(str);
      chai.expect(r1).to.equal(r2);
    }
  });

  it("Should provide repeatable random int values for the same random seed", () => {
    const seed = new Date().getTime();
    const x = new XOR128(seed);
    const y = new XOR128(seed);

    for (let i = 0; i < NUM; i++) {
      const r1 = x.random_int();
      const r2 = y.random_int();
      chai.expect(r1).to.equal(r2);
    }
  });
});
