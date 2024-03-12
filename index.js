/**
 * Efficient CIDR matching for IPv4 and IPv6 addresses.
 *
 * @author Henrize <mail@henrize.kim>
 * @version 0.1.0
 * @license MIT
 */

import { parseCIDR, parseAddress } from './src/parse.js';
import { AddressTree } from './src/tree.js';

/** Efficient CIDR matching for IPv4 and IPv6 addresses. */
export class Matcher {
  /** The prefix tree */
  #tree = new AddressTree();

  /**
   * Add a CIDR to the matcher.
   * Available formats:
   * - IPv6 (full and abbreviated)
   * - IPv4
   * - IPv4-mapped IPv6
   *
   * @param {string} cidr - The CIDR to add
   */
  add (cidr) {
    let { address, mask } = parseCIDR(cidr);
    this.#tree.insertCIDR(address, mask);
  }

  /**
   * Check if the address is in the matcher.
   * Available formats:
   * - IPv6 (full and abbreviated)
   * - IPv4
   * - IPv4-mapped IPv6
   *
   * @param {string} address - The address to check
   * @returns {boolean} Whether the address is in the tree
   */
  has (address) {
    return this.#tree.contains(parseAddress(address));
  }
}
