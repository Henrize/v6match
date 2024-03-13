import {v4, v6} from './constants.js'

/**
 * Parse the IPv6 to a BigInt
 *
 * @param {string} address - The IPv6 address
 * @returns {BigInt} The parsed address
 */
function IPv6toInteger (address) {

  // If the address is a full IPv6 address
  if (v6.REGEX.test(address)) {

    // Directly convert the address to a BigInt
    return BigInt('0x' + address.split(v6.SEPARATOR).map((part) => part.padStart(4, '0')).join(''));

  // Or if the address is an abbreviated IPv6 address
  } else if (v6.REGEX_ABBREVIATED.test(address)) {

    // Split the address into left and right parts
    let [left, right] = address.split(v6.SEPARATOR + v6.SEPARATOR);

    // Split the left and right parts into their components
    left = left.split(v6.SEPARATOR).map((part) => part.padStart(4, '0'));
    right = right.split(v6.SEPARATOR).map((part) => part.padStart(4, '0'));

    // Count the number of zero parts
    const zeroCount = v6.PARTS - left.length - right.length;
    if (zeroCount < 0) {
      throw new Error('Invalid IPv6 address: ' + address);
    }

    // Create the zero part
    const zeroPart = '0000'.repeat(zeroCount);

    // Join the parts together
    return BigInt('0x' + [...left, zeroPart, ...right].join(''));
  } else {
    throw new Error('Invalid IPv6 address: ' + address);
  }
}

/**
 * Parse the IPv6 CIDR
 *
 * @param {string} cidr - The IPv6 CIDR
 * @returns {Object} The parsed address and mask
 * @property {BigInt} address - The parsed address
 * @property {number} mask - The parsed mask
 */
function parseIPv6CIDR (cidr) {
  let [address, mask] = cidr.trim().split(v6.CIDR_SUBNET_SEPARATOR);

  // Make sure the mask is a number
  if (Number(mask).toString() !== mask) {
    throw new Error('Invalid CIDR: ' + cidr);
  } else if (Number(mask) < 0 || Number(mask) > v6.BITS) {
    throw new Error('Invalid CIDR: ' + cidr);
  }

  try {
    // Parse the address
    address = IPv6toInteger(address);
  } catch (error) {

    // If the address is invalid, throw an error
    throw new Error('Invalid CIDR: ' + cidr);
  }

  return { address, mask: Number(mask) };
}

/**
 * Parse the IPv4 to a BigInt same as IPv6
 *
 * @param {string} address - The IPv4 address
 * @returns {BigInt} The parsed address
 */
function IPv4toInteger (address) {
  // Check if the address is valid
  if (!v4.REGEX.test(address)) {
    throw new Error('Invalid IPv4 address: ' + address);
  }

  // Split the address into its components
  let parts = address.split(v4.SEPARATOR);
  parts = parts.map((part) => parseInt(part, 10));

  // Check if the parts are valid
  for (let part of parts) {
    if (part < 0 || part > 255) {
      throw new Error('Invalid IPv4 address: ' + address);
    }
  }

  // Convert the address to a BigInt
  return BigInt(parts[0] * 256 ** 3 + parts[1] * 256 ** 2 + parts[2] * 256 + parts[3]) | 0xffff00000000n;
}

/**
 * Parse the IPv4 CIDR
 *
 * @param {string} cidr - The IPv4 CIDR
 * @returns {Object} The parsed address and mask
 * @property {BigInt} address - The parsed address
 * @property {number} mask - The parsed mask
 */
function parseIPv4CIDR (cidr) {
  let [address, mask] = cidr.trim().split(v4.CIDR_SUBNET_SEPARATOR);

  // Make sure the mask is a number
  if (Number(mask).toString() !== mask) {
    throw new Error('Invalid CIDR: ' + cidr);
  } else if (Number(mask) < 0 || Number(mask) > v4.BITS) {
    throw new Error('Invalid CIDR: ' + cidr);
  }

  try {
    // Parse the address
    address = IPv4toInteger(address);
  } catch (error) {

    // If the address is invalid, throw an error
    throw new Error('Invalid CIDR: ' + cidr);
  }

  return { address, mask: Number(mask) + 96 };
}

/**
 * Parse the IPv4-mapped IPv6 Address
 *
 * @param {string} address - The IPv4-mapped IPv6 address
 * @return {BigInt} The parsed address
 */
function parseIPv4MappedIPv6 (address) {
  // Extract the IPv4 address from the IPv4-mapped IPv6 address
  const ipv4 = address.slice(address.lastIndexOf(v6.SEPARATOR) + 1);
  const ipv6 = address.slice(0, address.lastIndexOf(v6.SEPARATOR));

  // Check if the IPv4 address is valid
  if (!v4.REGEX.test(ipv4)) {
    throw new Error('Invalid IPv4-mapped IPv6 address: ' + address);
  }

  // Check the IPv6 address equal to 0xffff
  if (IPv6toInteger(ipv6) !== BigInt(0xffff)) {
    throw new Error('Invalid IPv4-mapped IPv6 address: ' + address);
  }

  // Parse the IPv4 address
  return IPv4toInteger(ipv4);
}

/**
 * Parse the IPv4-mapped IPv6 CIDR
 *
 * @param {string} cidr - The CIDR
 * @returns {Object} The parsed address and mask
 * @property {BigInt} address - The parsed address
 * @property {number} mask - The parsed mask
 */
function parseIPv4MappedIPv6CIDR (cidr) {
  let [address, mask] = cidr.trim().split(v6.CIDR_SUBNET_SEPARATOR);

  // Make sure the mask is a number
  if (Number(mask).toString() !== mask) {
    throw new Error('Invalid CIDR: ' + cidr);
  } else if (Number(mask) < 96 || Number(mask) > v6.BITS) {
    throw new Error('Invalid CIDR: ' + cidr);
  }

  try {
    // Parse the address
    address = parseIPv4MappedIPv6(address);
  } catch (error) {

    // If the address is invalid, throw an error
    throw new Error('Invalid CIDR: ' + cidr);
  }

  return { address, mask: Number(mask) };
}

/**
 * Parse the address to a BigInt
 * Available formats:
 * - IPv6 (full and abbreviated)
 * - IPv4
 * - IPv4-mapped IPv6
 *
 * @param address
 * @return {BigInt} The parsed address
 */
export function parseAddress (address) {
  address = address.toLowerCase();

  try {
    return IPv6toInteger(address);
  } catch ( error ) {
    try {
      return IPv4toInteger(address);
    } catch ( error ) {
      try {
        return parseIPv4MappedIPv6(address);
      } catch ( error ) {
        throw new Error('Invalid address: ' + address);
      }
    }
  }
}

/**
 * Parse the CIDR
 * Available formats:
 * - IPv6 (full and abbreviated)
 * - IPv4
 * - IPv4-mapped IPv6
 *
 * @param cidr
 * @return {Object} The parsed address and mask
 * @property {BigInt} address - The parsed address
 * @property {number} mask - The parsed mask
 */
export function parseCIDR (cidr) {
  cidr = cidr.toLowerCase();

  try {
    return parseIPv6CIDR(cidr);
  } catch ( error ) {
    try {
      return parseIPv4CIDR(cidr);
    } catch ( error ) {
      try {
        return parseIPv4MappedIPv6CIDR(cidr);
      } catch ( error ) {
        throw new Error('Invalid CIDR: ' + cidr);
      }
    }
  }
}
