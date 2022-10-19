mocha.setup("bdd");

const NUM = 10000;
const MAX = 10;
const random = new XOR128();

describe("test", () => {
  it("test instantiation", () => {
    chai.expect(() => new XOR128(1, 2, 3, 4, 5)).to.throw();
    chai.expect(() => new XOR128(1, 2, 3, "A")).to.throw();
    chai.expect(() => new XOR128("A")).to.throw();
    chai.expect(() => new XOR128(-1)).to.throw();
    chai.expect(() => new XOR128([1, 2, 3, 4])).to.not.throw();
    chai.expect(() => new XOR128([1, 2])).to.not.throw();
  });

  it("test method arguments", () => {
    chai.expect(() => random.random(2, 0)).to.throw();
    chai.expect(() => random.random_int(2, 0)).to.throw();
    chai.expect(() => random.random_from_array("A")).to.throw();
    chai.expect(() => random.shuffle(1)).to.throw();
  });

  it("returned value is a number", () => {
    for (let i = 0; i < NUM; i++) {
      const r = random.random();
      chai.expect(r).to.be.a("number");
      chai.expect(r).to.not.equal(NaN);

      const i = random.random_int();
      chai.expect(i).to.be.a("number");
      chai.expect(i).to.not.equal(NaN);
      chai.expect(i).to.equal(Math.floor(i));
    }
  });

  it("random should be in the correct range", () => {
    for (let i = 0; i < NUM; i++) {
      chai.expect(random.random()).to.be.within(0, 1);
      chai.expect(random.random(10)).to.be.within(0, 10);
    }
  });

  it("random_int should be in the correct range", () => {
    for (let i = 0; i < NUM; i++) {
      chai.expect(random.random_int()).to.be.within(0, 1);
      chai.expect(random.random_int(10)).to.be.within(0, 10);
    }
  });

  it("check random and random_int distribution", () => {
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

    const int_values = Array(MAX)
      .fill(0)
      .map((_, i) => i);
    for (let i = 0; i < NUM; i++) {
      const r = random.random_int(MAX);
      int_values[r]++;
    }
    const int_check = int_values.every((v) => v > 0);
    chai.expect(int_check).to.be.true;
    chai.expect(int_check).to.be.a("boolean");
  });

  it("random_range should be in the correct range", () => {
    for (let i = 0; i < NUM; i++) {
      chai.expect(random.random_interval()).to.be.within(0, 1);
      chai.expect(random.random_interval(10, 10)).to.be.within(0, 20);
    }
  });

  it("random_boolean should be true or false", () => {
    for (let i = 0; i < NUM; i++) {
      chai.expect(random.random_bool()).to.be.oneOf([true, false]);
    }
  });

  it("random_string should generate a valid random string", () => {
    for (let i = 0; i < NUM; i++) {
      const s = random.random_string();
      chai.expect(s).to.be.a("string");
      chai.expect(s.length).to.equal(10);
      chai.expect(s).to.match(/^[A-Za-z0-9]+$/);
    }
  });

  it("random_from_array should return a random item from the array", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = 0; i < NUM; i++) {
      chai.expect(arr).to.include(random.random_from_array(arr));
      chai.expect(arr).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
  });

  it("random_from_string should return a random char from the string", () => {
    const str = "1234567890";
    for (let i = 0; i < NUM; i++) {
      chai.expect(str).to.include(random.random_from_string(str));
    }
  });

  it("shuffle_array should return a shuffled array", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = 0; i < NUM; i++) {
      const shuffled = random.shuffle_array(arr);
      chai.expect(shuffled).to.not.deep.equal(arr);
      chai.expect(shuffled).to.have.lengthOf(arr.length);
      for (let j = 0; j < arr.length; j++) {
        chai.expect(arr).to.include(shuffled[j]);
      }
    }
  });

  it("shuffle_string should return a shuffled string", () => {
    const str = "1234567890";
    for (let i = 0; i < NUM; i++) {
      const shuffled = random.shuffle_string(str);
      chai.expect(shuffled).to.have.lengthOf(str.length);
      for (let j = 0; j < str.length; j++) {
        chai.expect(str).to.include(shuffled[j]);
      }
    }
  });

  it("check pick distribution", () => {
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

  it("test repeatability", () => {
    const seed = [1234, 5678, 9012, 3456];
    const x = new XOR128(...seed);
    const r1 = x.random();

    for (let i = 0; i < NUM; i++) {
      const y = new XOR128(...seed);
      const r2 = y.random();
      chai.expect(r1).to.equal(r2);
    }
  });

  it("test shuffle repeatability with arrays", () => {
    const seed = [1234, 5678, 9012, 3456];
    for (let i = 0; i < NUM; i++) {
      const x = new XOR128(...seed);
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const r1 = x.shuffle(arr);
      const y = new XOR128(...seed);
      const r2 = y.shuffle(arr);
      chai.expect(r1).to.deep.equal(r2);
    }
  });

  it("test shuffle repeatability with strings", () => {
    const seed = [1234, 5678, 9012, 3456];
    for (let i = 0; i < NUM; i++) {
      const x = new XOR128(...seed);
      const str = "1234567890";
      const r1 = x.shuffle(str);
      const y = new XOR128(...seed);
      const r2 = y.shuffle(str);
      chai.expect(r1).to.equal(r2);
    }
  });

  it("test repeatability with random seed", () => {
    const seed = new Date().getTime();
    const x = new XOR128(seed);
    const r1 = x.random();

    for (let i = 0; i < NUM; i++) {
      const y = new XOR128(seed);
      const r2 = y.random();
      chai.expect(r1).to.equal(r2);
    }
  });
});
