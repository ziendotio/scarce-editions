# Usage

## Create an Edition

`bool success = scareEditions.create(address to, uint256 tokenId, string memory uri);`

Where: 
- `to` The address that will own the scarce edition.
- `tokenId` uint256 ID of the scarce edition.
- `uri` The URI of the work.

All id's are zero based (start from 0, not 1)

## Transfer an Edition

`scareEditions.transferFrom(address from, address to, uint256 tokenId)`

Where:
- `from` The address that currently own the scarce edition.
- `to` The address that will own the scarce edition.
- `tokenId` uint256 ID of the scarce edition.
