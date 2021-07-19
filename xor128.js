/**
* XOR128 js implementation
* @version 1.0.0
* @author Lorenzo Rossi - https://www.lorenzoros.si - https://github.com/lorossi/
* @license Attribution 4.0 International (CC BY 4.0)
*/

/**
 * XOR128 pseudo-random number generator.
 * Based on the implementation by WizCorp https://github.com/Wizcorp/xor128/
 * All parameters are optional, if nothing is passed a random value from
 *  js functions Math.random() will be used
 *
 * @param {Number} [x]
 * @param {Number} [y]
 * @param {Number} [z]
 * @param {Number} [w]
 * @returns {XOR128}
 */
function XOR128(x = Math.random() * 4294967296, y = Math.random() * 4294967296, z = Math.random() * 4294967296, w = Math.random() * 4294967296) {
  if (x < 1 || y < 1 || z < 1 || w < 1)
    throw new Error("Invalid seed");

  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
}


XOR128.prototype = {
  /**
   * Private function, returns a random 32bit integer in range [0, 2^32-1)
   * 
   * @private
   * @returns {Number}
   */
  _next_integer: function () {
    const t = this.x ^ ((this.x << 11) >>> 0);

    this.x = this.y;
    this.y = this.z;
    this.z = this.w;
    this.w = (this.w ^ (this.w >>> 19) ^ (t ^ (t >>> 8))) >>> 0;

    return this.w;
  },

  /**
   * Returns a random number in range [a, b) (i.e. a included, b excluded)
   * If only one parameter is passed, the random number will be generated in range [0, a)
   * If no parameters are passed, the random number will be generated in range [0, 1)
   *
   * @param {Number} [a] if two parameters are passed, minimum range value; maximum range value otherwise
   * @param {Number} [b] maximum range value
   * @returns {Number} random number
   */
  random: function (a, b) {
    if (a == undefined && b == undefined) {
      a = 0;
      b = 1;
    } else if (b == undefined) {
      b = a;
      a = 0;
    }

    return this._next_integer() / 4294967296 * (b - a) + a;
  },

  /**
   * Returns a random integer in range [a, b) (i.e. a included, b excluded)
   * If only one parameter is passed, the random number will be generated in range [0, a)
   * If no parameters are passed, the random number will be generated in range [0, 1]
   *
   * @param {Number} [a] if two parameters are passed, minimum range value; maximum range value otherwise
   * @param {Number} [b] maximum range value
   * @returns {Number} random number
   */
  random_int: function (a, b) {
    if (a == undefined && b == undefined) {
      a = 0;
      b = 2;
    }
    else if (b == undefined) {
      b = a;
      a = 0;
    }

    return Math.floor(this._next_integer() / 4294967296 * (b - a)) + a;
  },

  /**
   * Returns a random integer in range (average - interval, average + interval)
   * If only one parameter is passed, the random number will be generated in range (average - 0.5, average + 0.5)
   * If no parameters are passed, the random number will be generated in range [0, 1]
   *
   * @param {Number} [a=0.5] average value of the random numbers
   * @param {Number} [b=0.5] semi interval of the random numbers
   * @returns {Number} random number
   */
  random_interval: function (average = 0.5, interval = 0.5) {
    return this.random(average - interval, average + interval);
  },

  /**
   * Returns a random item from the provided array
   * 
   * @param {Array} arr an array
   * @returns {any} item from input array
   */
  random_from_array: function (arr) {
    return arr[this.random_int(0, arr.length)];
  },

  /**
  * Shuffles the provided array without returning it (the original array gets shuffled)
  *
  * @param {Array} arr an array
  */
  shuffle_array: function (arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.random_int(0, arr.length);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  },

  /**
   * Shuffles and returns a string
   * 
   * @param {String} string the string to be shuffled 
   * @returns {String}
   */
  shuffle_string: function (string) {
    string.split("").sort((_, __) => this.random(-1, 1)).join("");
  },
};
