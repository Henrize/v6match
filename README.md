# v6match - Efficient CIDR blocks matching

![GitHub License](https://img.shields.io/github/license/henrize/v6match)
[![npm Version](https://img.shields.io/npm/v/v6match)](https://www.npmjs.com/package/v6match)
![GitHub last commit](https://img.shields.io/github/last-commit/henrize/v6match)

-----

## Features

- 🚀 **High Performance**: With prefix tree based matching, v6match is designed to be fast and efficient. Perform 150,000+ match queries per second on a single CPU core server.
- 🔍 **Large CIDR Block Support**: Designed to handle large sets, whether you're dealing with thousands of CIDR blocks.
- 🛠️ **Zero Dependencies**: v6match keeps your project light with no external dependencies, making it simple to integrate and deploy.
- ✅ **Easy to Use**: A straightforward API that gets you up and running with just a few lines of code.

## Installation

```bash
npm i v6match
```

## Usage

```javascript
import { Matcher } from 'v6match';

const m = new Matcher();

m.add('2001:db8::/32');
m.has('2001:db8::1'); // true
```

## API

### `Matcher.add(cidr: string): void`

Add a CIDR block to the matcher. Supports both IPv4, IPv6 and IPv4-mapped IPv6 CIDR blocks.

```javascript
m.add('127.0.0.1/8');
m.add('::FFFF:192.168.0.1/120');
m.add('2001:db8::/32');
```

### `Matcher.has(ip: string): boolean`

Check if an IP address is in any of the CIDR blocks added to the matcher.

```javascript
m.has('127.0.0.1'); // true
m.has('::FFFF:192.168.1.1'); // false
m.has('2001:db8::1'); // true
```

## License

[The MIT License](https://github.com/henrize/v6match/blob/main/LICENSE)
