import { tree, v6 } from './constants.js';

/**
 * Class representing a prefix tree for IP matching.
 */
export class AddressTree {
  /**
   * Root node of the prefix tree.
   *
   * @type {Map<number | Symbol, Map | Array<number> | boolean>}
   */
  #root;

  /**
   * Create a prefix tree.
   *
   * @returns {AddressTree} The prefix tree
   */
  constructor () {

    // Initialize the root node.
    this.#root = new Map();
    this.#root.set(tree.LENGTH_LIST, []);
    this.#root.set(tree.END, false);
  }

  /**
   * Add a CIDR to the tree.
   *
   * @param {BigInt} address - The IP address
   * @param {number} mask - The CIDR mask
   */
  insertCIDR (address, mask) {

    // Start from the root node.
    let node = this.#root;

    // Traverse the tree.
    for (let loop = 0; loop < mask; loop += tree.NODE_LENGTH) {

      // Extract the bits from the address.
      let bits = this.#extractBits(address, loop);

      // Add mask bit length to the bits if the mask not bigger than the node length.
      // Address : 10101010   Mask : 6 (101)
      // 10101010 | 10100000000 = 10110101000
      if (mask - loop < tree.NODE_LENGTH) {
        bits = ((bits >> (tree.NODE_LENGTH - (mask - loop))) << (tree.NODE_LENGTH - (mask - loop)));
        bits = bits | ((mask - loop - 1) << tree.NODE_LENGTH);
        node.get(tree.LENGTH_LIST).push(mask - loop);
      }

      // If the node doesn't exist, create a new node.
      if (!node.has(bits)) {
        node.set(bits, new Map());
        node.get(bits).set(tree.LENGTH_LIST, []);
        node.get(bits).set(tree.END, false);
      }

      // If the node is the end of the tree, mark it.
      if (mask - loop <= tree.NODE_LENGTH) {
        node.get(bits).set(tree.END, true);
      }

      // Move to the next node.
      node = node.get(bits);
    }
  }

  /**
   * Check if the tree contains the address.
   *
   * @param {BigInt} address - The IP address
   * @returns {boolean} True if the tree contains the address, false otherwise
   */
  contains (address) {
    let node = this.#root;

    for (let loop = 0; loop < v6.BITS; loop += tree.NODE_LENGTH) {
      // Extract the bits from the address.
      const bits = this.#extractBits(address, loop);

      if (node.has(bits)) {
        // If the node exists, move to the next node.
        node = node.get(bits);

        // If this is the end of the tree, return true.
        if (node.get(tree.END)) {
          return true;
        }
      } else {

        // If the node doesn't exist, check if the node has a mask.
        for (const length of node.get(tree.LENGTH_LIST)) {

          // Turn the bits into a mask with the length.
          let withMask = bits >> (tree.NODE_LENGTH - length) << (tree.NODE_LENGTH - length);
          withMask = withMask | (length - 1 << tree.NODE_LENGTH);
          if (node.has(withMask)) {

            // If the node exists, the address is in the tree.
            return true;
          }
        }
      }

    }

    return false;
  }

  /**
   * Extract bits from the address.
   *
   * @param {BigInt} address - The IP address
   * @param {number} start - The start bit from v6.BITS
   * @returns {number} The extracted bits
   */
  #extractBits (address, start) {
    const bitsMask = (1n << BigInt(tree.NODE_LENGTH)) - 1n;
    const shiftAmount = BigInt(v6.BITS - start - tree.NODE_LENGTH);

    return Number((address & (bitsMask << shiftAmount)) >> shiftAmount);
  }
}
