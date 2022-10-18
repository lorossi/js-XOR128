mocha.setup("bdd");

const NUM = 10000;
let random = new XOR128();

describe("test", () => {
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

  it("random_range should be in the correct range", () => {
    for (let i = 0; i < NUM; i++) {
      chai.expect(random.random_interval()).to.be.within(0, 1);
      chai.expect(random.random_interval(10, 10)).to.be.within(0, 20);
    }
  });

  it("random_from_array should return a random item from the array", () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let i = 0; i < NUM; i++) {
      chai.expect(arr).to.include(random.random_from_array(arr));
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
  });
});
