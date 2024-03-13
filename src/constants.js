/** IPv6 Basic Properties */
export const v6 = {
  /** CIDR subnet separator */
  CIDR_SUBNET_SEPARATOR: '/',

  /** IPv6 parts separator */
  SEPARATOR: ':',

  /** RegExp to validate an IPv6 address */
  REGEX: /^([0-9a-f]{1,4}:){7}([0-9a-f]{1,4})$/,

  /** RegExp to validate an Abbreviated IPv6 address */
  REGEX_ABBREVIATED: /^([0-9a-f]{1,4}(:[0-9a-f]{1,4})*)?::([0-9a-f]{1,4}(:[0-9a-f]{1,4})*)?$/,

  /** The number of parts in an IPv6 address */
  PARTS: 8,

  /** The number of bits in an IPv6 address */
  BITS: 128
}

/** IPv4 Basic Properties */
export const v4 = {
  /** IPv4 parts separator */
  SEPARATOR: '.',

  /** CIDR subnet separator */
  CIDR_SUBNET_SEPARATOR: '/',

  /** RegExp to validate an IPv4 address */
  REGEX: /^(\d{1,3}\.){3}\d{1,3}$/,

  /** The number of bits in an IPv4 address */
  BITS: 32
}

/** Constants for the prefix tree */
export const tree = {
  /** CIDR Length per node in bits. */
  NODE_LENGTH: 8,

  /** Symbol for indicate the CIDR lengths */
  LENGTH_LIST: Symbol('v6match.tree.lengthList'),

  /** Symbol for indicate the end of the tree */
  END: Symbol('v6match.tree.end')
}
